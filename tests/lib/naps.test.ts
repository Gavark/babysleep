import { describe, it, expect } from 'vitest';
import {
  napDurationsByRank, dayNapMinutes, napCount,
  aggregateByRank, napSeriesByRank, maxNapRank
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
