import { describe, it, expect } from 'vitest';
import {
  napDurationsByRank, dayNapMinutes, napCount,
  aggregateByRank, napSeriesByRank, maxNapRank, aggregateByMonthAndRank
} from '../../src/lib/naps';

// Slots are positional, NOT chronological — a parent may leave slot 1 empty.
const day = (slots: Record<string, unknown>) => slots;

describe('napDurationsByRank', () => {
  it('returns durations ordered by start time, not by slot number', () => {
    // Slot 1 holds the AFTERNOON nap, slot 2 the MORNING one.
    const e = day({
      nap1Start: '14:00', nap1End: '15:00',
      nap2Start: '09:00', nap2End: '09:45'
    });
    expect(napDurationsByRank(e)).toEqual([45, 60]);
  });

  it('does not shift ranks when slot 1 is empty', () => {
    const e = day({ nap2Start: '09:00', nap2End: '10:00' });
    expect(napDurationsByRank(e)).toEqual([60]);
  });

  it('subtracts the pause from the span', () => {
    const e = day({ nap1Start: '09:00', nap1End: '10:00', nap1PauseMin: 15 });
    expect(napDurationsByRank(e)).toEqual([45]);
  });

  it('never returns a negative duration when the pause exceeds the span', () => {
    const e = day({ nap1Start: '09:00', nap1End: '09:10', nap1PauseMin: 30 });
    expect(napDurationsByRank(e)).toEqual([0]);
  });

  it('ignores a nap that has started but not ended', () => {
    const e = day({ nap1Start: '09:00', nap1End: null });
    expect(napDurationsByRank(e)).toEqual([]);
  });

  it('ignores malformed times', () => {
    const e = day({ nap1Start: '9:00', nap1End: '10:00' });
    expect(napDurationsByRank(e)).toEqual([]);
  });

  it('returns an empty array for a day with no naps', () => {
    expect(napDurationsByRank(day({}))).toEqual([]);
  });

  it('reads all eight slots', () => {
    const e = day({
      nap1Start: '07:00', nap1End: '07:10',
      nap8Start: '06:00', nap8End: '06:10'
    });
    expect(napDurationsByRank(e)).toEqual([10, 10]);
  });
});

describe('dayNapMinutes', () => {
  it('sums the ranked durations', () => {
    const e = day({
      nap1Start: '09:00', nap1End: '10:00',
      nap2Start: '14:00', nap2End: '14:30', nap2PauseMin: 10
    });
    expect(dayNapMinutes(e)).toBe(80);
  });

  it('returns null — not 0 — when nothing was recorded', () => {
    expect(dayNapMinutes(day({}))).toBeNull();
  });
});

describe('napCount', () => {
  // Deliberately unchanged from the previous inline implementation: it counts
  // recorded END times, so a nap with an end but no start still counts. Making
  // it agree with napDurationsByRank would silently change the existing
  // "number of naps" chart on real data, which this pass must not do.
  it('counts recorded end times', () => {
    expect(napCount(day({ nap1End: '10:00', nap3End: '15:00' }))).toBe(2);
  });

  it('counts a nap with an end but no start', () => {
    expect(napCount(day({ nap1End: '10:00' }))).toBe(1);
  });
});

describe('aggregateByRank', () => {
  const entries = [
    day({ nap1Start: '09:00', nap1End: '10:00', nap2Start: '14:00', nap2End: '15:00' }), // 60, 60
    day({ nap1Start: '09:00', nap1End: '10:30', nap2Start: '14:00', nap2End: '14:30' }), // 90, 30
    day({ nap1Start: '09:00', nap1End: '10:00' })                                        // 60
  ];

  it('averages each rank over the days that rank occurred', () => {
    expect(aggregateByRank(entries)).toEqual([
      { rank: 1, avgMin: 70, days: 3 },
      { rank: 2, avgMin: 45, days: 2 }
    ]);
  });

  it('keeps a rank observed on a single day, with a count of 1', () => {
    const withThird = [...entries, day({
      nap1Start: '09:00', nap1End: '09:30',
      nap2Start: '12:00', nap2End: '12:30',
      nap3Start: '16:00', nap3End: '16:20'
    })];
    const third = aggregateByRank(withThird).find((r) => r.rank === 3);
    expect(third).toEqual({ rank: 3, avgMin: 20, days: 1 });
  });

  it('returns an empty array when no entry has a nap', () => {
    expect(aggregateByRank([day({}), day({})])).toEqual([]);
  });
});

describe('napSeriesByRank', () => {
  const entries = [
    day({ nap1Start: '09:00', nap1End: '10:00', nap2Start: '14:00', nap2End: '15:00' }),
    day({ nap1Start: '09:00', nap1End: '10:30' }),
    day({})
  ];

  it('yields one value per entry, null where that rank is absent', () => {
    expect(napSeriesByRank(entries, 1)).toEqual([60, 90, null]);
    expect(napSeriesByRank(entries, 2)).toEqual([60, null, null]);
  });
});

describe('maxNapRank', () => {
  it('returns the highest nap count seen on any single day', () => {
    expect(maxNapRank([
      day({ nap1Start: '09:00', nap1End: '10:00' }),
      day({ nap1Start: '09:00', nap1End: '10:00', nap2Start: '14:00', nap2End: '15:00' })
    ])).toBe(2);
  });

  it('returns 0 when there is no nap at all', () => {
    expect(maxNapRank([day({})])).toBe(0);
  });
});

describe('aggregateByMonthAndRank', () => {
  // `day` is the existing helper at the top of this file: (slots) => slots
  const e = (date: string, naps: Record<string, unknown>) => day({ date, ...naps });

  const twoNaps = (a: string, b: string, c: string, d: string) => ({
    nap1Start: a, nap1End: b, nap2Start: c, nap2End: d
  });

  it('returns months in chronological order regardless of input order', () => {
    const stats = aggregateByMonthAndRank([
      e('2026-07-02', { nap1Start: '09:00', nap1End: '10:00' }),
      e('2026-05-02', { nap1Start: '09:00', nap1End: '10:00' }),
      e('2026-06-02', { nap1Start: '09:00', nap1End: '10:00' })
    ]);
    expect(stats.months.map((m) => m.key)).toEqual(['2026-05', '2026-06', '2026-07']);
  });

  it('averages each rank within each month', () => {
    const stats = aggregateByMonthAndRank([
      e('2026-05-01', twoNaps('09:00', '10:00', '14:00', '15:00')), // 60, 60
      e('2026-05-02', twoNaps('09:00', '11:00', '14:00', '14:30'))  // 120, 30
    ]);
    expect(stats.series).toEqual([
      { rank: 1, points: [{ monthKey: '2026-05', meanMin: 90, days: 2 }] },
      { rank: 2, points: [{ monthKey: '2026-05', meanMin: 45, days: 2 }] }
    ]);
  });

  it('gives a rank a null point for a month it never occurred in', () => {
    const stats = aggregateByMonthAndRank([
      e('2026-05-01', twoNaps('09:00', '10:00', '14:00', '15:00')),
      e('2026-06-01', { nap1Start: '09:00', nap1End: '10:00' }) // no second nap in June
    ]);
    const rank2 = stats.series.find((s) => s.rank === 2)!;
    expect(rank2.points).toEqual([
      { monthKey: '2026-05', meanMin: 60, days: 1 },
      { monthKey: '2026-06', meanMin: null, days: 0 }
    ]);
  });

  it('gives every series one point per month, index-aligned with months', () => {
    const stats = aggregateByMonthAndRank([
      e('2026-05-01', twoNaps('09:00', '10:00', '14:00', '15:00')),
      e('2026-06-01', { nap1Start: '09:00', nap1End: '10:00' })
    ]);
    for (const s of stats.series) {
      expect(s.points.map((p) => p.monthKey)).toEqual(stats.months.map((m) => m.key));
    }
  });

  it('keeps a month with a single recorded day rather than filtering it out', () => {
    const stats = aggregateByMonthAndRank([
      e('2026-05-01', { nap1Start: '09:00', nap1End: '10:00' }),
      e('2026-08-01', { nap1Start: '09:00', nap1End: '09:20' })
    ]);
    expect(stats.months).toEqual([
      { key: '2026-05', days: 1 },
      { key: '2026-08', days: 1 }
    ]);
  });

  it('omits a month entirely when nothing was recorded, without breaking alignment', () => {
    // June has entries but NO naps — it must not appear as an empty group.
    const stats = aggregateByMonthAndRank([
      e('2026-05-01', { nap1Start: '09:00', nap1End: '10:00' }),
      e('2026-06-01', { wakeTime: '07:00', bedtime: '20:00' }),
      e('2026-07-01', { nap1Start: '09:00', nap1End: '10:00' })
    ]);
    expect(stats.months.map((m) => m.key)).toEqual(['2026-05', '2026-07']);
    expect(stats.series[0].points.map((p) => p.monthKey)).toEqual(['2026-05', '2026-07']);
  });

  it('counts only entries with at least one nap in a month\'s day count', () => {
    const stats = aggregateByMonthAndRank([
      e('2026-05-01', { nap1Start: '09:00', nap1End: '10:00' }),
      e('2026-05-02', { wakeTime: '07:00', bedtime: '20:00' }) // no nap: must not count
    ]);
    expect(stats.months).toEqual([{ key: '2026-05', days: 1 }]);
  });

  it('ranks chronologically, so an empty slot 1 does not shift a month\'s ranks', () => {
    // Morning nap stored in slot 2, slot 1 empty. Rank 1 must still be the 09:00 one.
    const stats = aggregateByMonthAndRank([
      e('2026-05-01', { nap2Start: '09:00', nap2End: '10:00', nap3Start: '14:00', nap3End: '14:30' })
    ]);
    expect(stats.series).toEqual([
      { rank: 1, points: [{ monthKey: '2026-05', meanMin: 60, days: 1 }] },
      { rank: 2, points: [{ monthKey: '2026-05', meanMin: 30, days: 1 }] }
    ]);
  });

  it('returns empty structures when there is no nap at all', () => {
    expect(aggregateByMonthAndRank([])).toEqual({ months: [], series: [] });
    expect(aggregateByMonthAndRank([e('2026-05-01', {})])).toEqual({ months: [], series: [] });
  });

  it('ignores an entry with no usable date', () => {
    const stats = aggregateByMonthAndRank([
      day({ nap1Start: '09:00', nap1End: '10:00' }), // no date field
      e('2026-05-01', { nap1Start: '09:00', nap1End: '10:00' })
    ]);
    expect(stats.months).toEqual([{ key: '2026-05', days: 1 }]);
  });
});
