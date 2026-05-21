import { describe, it, expect } from 'vitest';
import { buildMonthGrid, buildTimelineSegments, computeDayMetrics, heatmapClass, type CalendarEntry, type CalendarBaby } from '../src/lib/calendar';

describe('buildMonthGrid', () => {
  it('returns 35 or 42 cells (multiple of 7)', () => {
    const cells = buildMonthGrid(2026, 5);
    expect(cells.length % 7).toBe(0);
    expect(cells.length === 35 || cells.length === 42).toBe(true);
  });

  it('starts on Monday', () => {
    // May 2026: 1st is a Friday. Grid starts on the Monday before (2026-04-27).
    const cells = buildMonthGrid(2026, 5);
    expect(cells[0].date).toBe('2026-04-27');
    expect(cells[0].inMonth).toBe(false);
  });

  it('marks days of the displayed month with inMonth = true', () => {
    const cells = buildMonthGrid(2026, 5);
    const inMonth = cells.filter((c) => c.inMonth);
    expect(inMonth.length).toBe(31); // May has 31 days
    expect(inMonth[0].date).toBe('2026-05-01');
    expect(inMonth[inMonth.length - 1].date).toBe('2026-05-31');
  });

  it('handles February of a non-leap year (28 days, starts Sunday)', () => {
    // Feb 2026: 1st is a Sunday. Grid starts on the Monday before (2026-01-26).
    const cells = buildMonthGrid(2026, 2);
    expect(cells[0].date).toBe('2026-01-26');
    expect(cells.filter((c) => c.inMonth).length).toBe(28);
  });

  it('handles February of a leap year (29 days)', () => {
    const cells = buildMonthGrid(2024, 2);
    expect(cells.filter((c) => c.inMonth).length).toBe(29);
  });

  it('handles a month starting on Monday with exactly 4 weeks (only possible for Feb non-leap starting Mon)', () => {
    // Feb 2027: 1st is a Monday, 28 days → exactly 4 weeks. Grid length = 28.
    const cells = buildMonthGrid(2027, 2);
    expect(cells.length).toBe(28);
    expect(cells[0].date).toBe('2027-02-01');
  });
});

function mkEntry(patch: Partial<CalendarEntry>): CalendarEntry {
  return {
    wakeTime: null,
    nap1Start: null, nap1End: null,
    nap2Start: null, nap2End: null,
    nap3Start: null, nap3End: null,
    nap4Start: null, nap4End: null,
    bedtime: null,
    ...patch
  };
}

describe('buildTimelineSegments', () => {
  it('returns empty for undefined entry', () => {
    expect(buildTimelineSegments(undefined)).toEqual([]);
  });

  it('returns empty for entry with no times', () => {
    expect(buildTimelineSegments(mkEntry({}))).toEqual([]);
  });

  it('night segment left from 00:00 to wake_time', () => {
    const segs = buildTimelineSegments(mkEntry({ wakeTime: '07:00' }));
    expect(segs).toEqual([{ kind: 'night', startMin: 0, endMin: 420 }]);
  });

  it('night segment right from bedtime to 24:00', () => {
    const segs = buildTimelineSegments(mkEntry({ bedtime: '19:30' }));
    expect(segs).toEqual([{ kind: 'night', startMin: 1170, endMin: 1440 }]);
  });

  it('adds nap segments for each complete pair', () => {
    const segs = buildTimelineSegments(
      mkEntry({ nap1Start: '10:00', nap1End: '11:00', nap2Start: '14:00', nap2End: '15:30' })
    );
    expect(segs).toEqual([
      { kind: 'nap', startMin: 600, endMin: 660 },
      { kind: 'nap', startMin: 840, endMin: 930 }
    ]);
  });

  it('ignores nap pair where only start or only end is set', () => {
    const segs = buildTimelineSegments(
      mkEntry({ nap1Start: '10:00', nap1End: null, nap2Start: null, nap2End: '12:00' })
    );
    expect(segs).toEqual([]);
  });

  it('full day returns 4 segments ordered by start', () => {
    const segs = buildTimelineSegments(
      mkEntry({
        wakeTime: '07:00',
        nap1Start: '10:30', nap1End: '11:40',
        nap2Start: '13:10', nap2End: '15:06',
        bedtime: '19:50'
      })
    );
    expect(segs.map((s) => s.kind)).toEqual(['night', 'nap', 'nap', 'night']);
    expect(segs.map((s) => s.startMin)).toEqual([0, 630, 790, 1190]);
  });

  it('ignores invalid HH:MM strings', () => {
    const segs = buildTimelineSegments(
      mkEntry({ wakeTime: 'bogus', nap1Start: '10:00', nap1End: 'X:Y', bedtime: '25:00' })
    );
    expect(segs).toEqual([]);
  });

  it('ignores inverted nap pair (start >= end)', () => {
    const segs = buildTimelineSegments(
      mkEntry({ nap1Start: '14:00', nap1End: '11:00', nap2Start: '10:00', nap2End: '10:00' })
    );
    expect(segs).toEqual([]);
  });

  it('ignores zero-width segments (wakeTime 00:00, bedtime 24:00)', () => {
    // wakeTime 00:00 would produce 0..0 → skipped.
    const a = buildTimelineSegments(mkEntry({ wakeTime: '00:00' }));
    expect(a).toEqual([]);
    // bedtime is HH:MM regex so 24:00 wouldn't validate anyway, but verify 23:59 still works as a normal 1-minute segment.
    const b = buildTimelineSegments(mkEntry({ bedtime: '23:59' }));
    expect(b).toEqual([{ kind: 'night', startMin: 1439, endMin: 1440 }]);
  });
});

describe('heatmapClass', () => {
  it('maps each level to a CSS class', () => {
    expect(heatmapClass('good')).toBe('heat-good');
    expect(heatmapClass('ok')).toBe('heat-ok');
    expect(heatmapClass('meh')).toBe('heat-meh');
    expect(heatmapClass('bad')).toBe('heat-bad');
    expect(heatmapClass('partial')).toBe('heat-partial');
    expect(heatmapClass('none')).toBe('heat-none');
  });
});

describe('computeDayMetrics', () => {
  const baby: CalendarBaby = { birthDate: '2025-11-13', ageOverrideMonths: null };

  it('returns hasAnyData=false for missing entry', () => {
    const m = computeDayMetrics('2026-05-13', undefined, baby, '2026-05-21');
    expect(m.hasAnyData).toBe(false);
    expect(m.heatLevel).toBe('none');
    expect(m.totalSleepMin).toBe(0);
    expect(m.segments).toEqual([]);
  });

  it('returns isComplete=true and heat-good for a full day at ~100% quota (6mo: 14h budget)', () => {
    // 6 months old, expected daySleepH+nightSleepH = 3 + 11 = 14h = 840min.
    // Total = 7h (night left) + 3*1h naps + (24-20)*60 (night right) = 7h + 3h + 4h = 14h00 = 840min → ratio 1.0
    const entry: CalendarEntry = {
      wakeTime: '07:00',
      nap1Start: '09:00', nap1End: '10:00',
      nap2Start: '12:00', nap2End: '13:00',
      nap3Start: '15:00', nap3End: '16:00',
      nap4Start: null, nap4End: null,
      bedtime: '20:00'
    };
    const m = computeDayMetrics('2026-05-13', entry, baby, '2026-05-21');
    expect(m.hasAnyData).toBe(true);
    expect(m.isComplete).toBe(true);
    expect(m.totalSleepMin).toBe(840);
    expect(m.recommendedMin).toBe(840);
    expect(m.ratio).toBe(1);
    expect(m.heatLevel).toBe('good');
    expect(m.napCount).toBe(3);
  });

  it('returns heatLevel=partial when bedtime is missing but data exists', () => {
    const entry: CalendarEntry = {
      wakeTime: '07:00', nap1Start: '09:00', nap1End: '10:00',
      nap2Start: null, nap2End: null,
      nap3Start: null, nap3End: null,
      nap4Start: null, nap4End: null,
      bedtime: null
    };
    const m = computeDayMetrics('2026-05-13', entry, baby, '2026-05-21');
    expect(m.isComplete).toBe(false);
    expect(m.heatLevel).toBe('partial');
  });

  it('returns isToday=true when the date matches todayISO', () => {
    const m = computeDayMetrics('2026-05-21', undefined, baby, '2026-05-21');
    expect(m.isToday).toBe(true);
  });

  it('applies heatLevel thresholds (good >= 0.90, ok [0.70, 0.90), meh [0.50, 0.70), bad < 0.50)', () => {
    // baby age 6 months → 14h = 840min budget
    // We synthesize total via wake='00:00' is skipped (zero-width), so only bedtime→24:00 contributes.
    // To get a precise totalMin we use the night-right segment only.
    const make = (totalMin: number): CalendarEntry => {
      // bedtime so that 1440 - bedMin = totalMin → bedMin = 1440 - totalMin
      const bedMin = 1440 - totalMin;
      const hh = String(Math.floor(bedMin / 60)).padStart(2, '0');
      const mm = String(bedMin % 60).padStart(2, '0');
      return {
        wakeTime: null,
        nap1Start: null, nap1End: null, nap2Start: null, nap2End: null,
        nap3Start: null, nap3End: null, nap4Start: null, nap4End: null,
        bedtime: `${hh}:${mm}`
      };
    };
    // 840 → ratio 1.00 → good. isComplete requires both wake and bedtime → false here → 'partial'.
    // Need wakeTime too to make isComplete=true. Use wakeTime='00:01' for a 1-min night-left segment
    // and compensate by reducing the totalMin we ask the helper to produce.
    const makeComplete = (totalMin: number): CalendarEntry => {
      // We want exactly totalMin minutes total. Use wakeTime='00:01' (1-min night-left segment)
      // and bedtime so that (1440 - bedMin) = totalMin - 1
      const nightRight = totalMin - 1;
      const bedMin = 1440 - nightRight;
      const hh = String(Math.floor(bedMin / 60)).padStart(2, '0');
      const mm = String(bedMin % 60).padStart(2, '0');
      return {
        wakeTime: '00:01',
        nap1Start: null, nap1End: null, nap2Start: null, nap2End: null,
        nap3Start: null, nap3End: null, nap4Start: null, nap4End: null,
        bedtime: `${hh}:${mm}`
      };
    };
    expect(computeDayMetrics('2026-05-13', makeComplete(840), baby, '2026-05-21').heatLevel).toBe('good');   // 100%
    expect(computeDayMetrics('2026-05-13', makeComplete(672), baby, '2026-05-21').heatLevel).toBe('ok');     // 80%
    expect(computeDayMetrics('2026-05-13', makeComplete(504), baby, '2026-05-21').heatLevel).toBe('meh');    // 60%
    expect(computeDayMetrics('2026-05-13', makeComplete(336), baby, '2026-05-21').heatLevel).toBe('bad');    // 40%
  });

  it('uses ageOverrideMonths when provided', () => {
    const overrideBaby: CalendarBaby = { birthDate: '2025-11-13', ageOverrideMonths: 12 };
    // 12-18mo: daySleepH=2.5 + nightSleepH=11 = 13.5h = 810min
    const m = computeDayMetrics('2026-05-13', undefined, overrideBaby, '2026-05-21');
    expect(m.recommendedMin).toBe(810);
  });
});
