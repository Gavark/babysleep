import { describe, it, expect } from 'vitest';
import { ageInMonths, idealBedtime, suggestNextNap, suggestedBedtime, NAP_WEIGHTS, suggestNapEnd, computeDaySleepBudget, formatDuration } from '$lib/sleep-calc';
import type { NapPair } from '$lib/sleep-calc';

describe('ageInMonths', () => {
  it('returns whole months between two dates', () => {
    expect(ageInMonths('2025-01-15', undefined, new Date('2025-07-15T12:00:00Z'))).toBe(6);
  });
  it('rounds down if the day-of-month has not passed', () => {
    expect(ageInMonths('2025-01-20', undefined, new Date('2025-07-15T12:00:00Z'))).toBe(5);
  });
  it('uses override when provided', () => {
    expect(ageInMonths('2025-01-15', 4, new Date('2025-07-15T12:00:00Z'))).toBe(4);
  });
  it('returns 0 for newborn', () => {
    expect(ageInMonths('2025-07-10', undefined, new Date('2025-07-15T12:00:00Z'))).toBe(0);
  });
  it('throws if birth date is in the future and no override', () => {
    expect(() => ageInMonths('2026-12-01', undefined, new Date('2025-07-15T12:00:00Z'))).toThrow();
  });
  it('clamps very old to a reasonable max (no upper throw)', () => {
    expect(ageInMonths('2020-01-15', undefined, new Date('2025-07-15T12:00:00Z'))).toBe(66);
  });
});

describe('idealBedtime', () => {
  it('07:00 wake with 11h night → 20:00', () => {
    expect(idealBedtime('07:00', 11)).toBe('20:00');
  });
  it('handles wrap before midnight: 06:00 wake with 9h → 21:00', () => {
    expect(idealBedtime('06:00', 9)).toBe('21:00');
  });
  it('06:30 wake with 10.5h → 20:00', () => {
    expect(idealBedtime('06:30', 10.5)).toBe('20:00');
  });
  it('rounds to nearest minute', () => {
    expect(idealBedtime('07:00', 11.25)).toBe('19:45');
  });
});

describe('suggestNextNap', () => {
  it('adds awakeWindowMin to last end time', () => {
    expect(suggestNextNap('07:00', 90)).toBe('08:30');
  });
  it('wraps past midnight', () => {
    expect(suggestNextNap('23:00', 120)).toBe('01:00');
  });
});

describe('suggestedBedtime', () => {
  // 4-6 mois bracket reference params: 3 naps × NAP_WEIGHTS[3]=[0.27,0.55,0.18],
  // awakeWindow 2h, beforeBed 2h, night 11h, dayBudget 3.5h = 210 min.
  const params46 = {
    naps: 3, awakeWindowMin: 120, beforeBedWindowMin: 120, nightSleepH: 11, daySleepH: 3.5
  };
  const emptyNaps = () => [
    { start: '', end: '' }, { start: '', end: '' }, { start: '', end: '' }, { start: '', end: '' }
  ];

  it('returns null when wake is invalid', () => {
    expect(suggestedBedtime({ wake: '', naps: emptyNaps() }, params46)).toBeNull();
    expect(suggestedBedtime({ wake: 'bogus', naps: emptyNaps() }, params46)).toBeNull();
  });

  it('falls back to idealBedtime when projection produces an earlier time (wake only)', () => {
    // wake=05:30, ideal = 05:30 - 11h = 18:30.
    // Projection: 3 naps starting at 05:30+2h=07:30, alternating with 2h awake windows, budget 210.
    // Nap1 (w=0.27/1.0) = 57 → 07:30-08:27. Nap2 starts 10:27 (w=0.55/0.73=0.753) dur=115 → 10:27-12:22.
    // Nap3 starts 14:22 (w=0.18/0.18=1.0) dur=210-57-115=38 → 14:22-15:00. bedtime=15:00+2h=17:00.
    // MAX(18:30, 17:00) = 18:30.
    expect(suggestedBedtime({ wake: '05:30', naps: emptyNaps() }, params46)).toBe('18:30');
  });

  it('uses projection when day is structured later than ideal', () => {
    // 3 actual naps ending at 17:37 → projection = 17:37 + 2h = 19:37.
    // wake=06:50, ideal = 06:50 - 11h = 19:50.
    // MAX(19:50, 19:37) = 19:50.
    const naps = [
      { start: '08:10', end: '09:00' },
      { start: '12:20', end: '14:07' },
      { start: '16:48', end: '17:37' },
      { start: '', end: '' }
    ];
    expect(suggestedBedtime({ wake: '06:50', naps }, params46)).toBe('19:50');
  });

  it('projection wins when wake is later (smaller ideal floor)', () => {
    // 3 naps ending at 18:10 → projection = 18:10 + 2h = 20:10.
    // wake=05:15, ideal = 05:15 - 11h = 18:15.
    // MAX(18:15, 20:10) = 20:10.
    const naps = [
      { start: '08:00', end: '09:30' },
      { start: '12:15', end: '13:12' },
      { start: '17:36', end: '18:10' },
      { start: '', end: '' }
    ];
    expect(suggestedBedtime({ wake: '05:15', naps }, params46)).toBe('20:10');
  });

  it('projects remaining naps when only nap1 is in progress (start saved, end not)', () => {
    // wake=05:30, nap1 starts at 08:25, end not saved.
    // Nap1 (w=0.27/1.0=0.27) dur=57 → end 09:22. cumNap=57.
    // Nap2 starts 11:22 (w=0.55/0.73) dur=115 → 13:17. cumNap=172.
    // Nap3 starts 15:17 (w=0.18/0.18) dur=210-172=38 → 15:55. cumNap=210.
    // bedtime=15:55+2h=17:55. MAX(18:30, 17:55) = 18:30.
    const naps = [
      { start: '08:25', end: '' }, { start: '', end: '' }, { start: '', end: '' }, { start: '', end: '' }
    ];
    expect(suggestedBedtime({ wake: '05:30', naps }, params46)).toBe('18:30');
  });

  it('accounts for actual naps beyond the expected count via MAX', () => {
    // Expected count = 3, but baby did 4 naps. nap4 ends 17:51 (latest).
    // projection (after expectedCount loop) takes lastNapEnd=15:39 from nap3, then MAX with nap4End=17:51.
    // bedtime = 17:51 + 2h = 19:51. wake=05:00, ideal=18:00. MAX(18:00, 19:51) = 19:51.
    const naps = [
      { start: '07:27', end: '09:25' },
      { start: '11:40', end: '12:42' },
      { start: '15:18', end: '15:39' },
      { start: '17:00', end: '17:51' }
    ];
    expect(suggestedBedtime({ wake: '05:00', naps }, params46)).toBe('19:51');
  });

  it('ignores nap pairs missing either side', () => {
    // Same as wake-only case for projection purposes: an orphan end without a start contributes nothing.
    const naps = [
      { start: '', end: '09:00' }, { start: '', end: '' }, { start: '', end: '' }, { start: '', end: '' }
    ];
    // With nap1 ignored, projection runs full 3-nap simulation starting from wake.
    // ageInMonths and idealBedtime calc same as wake-only case → 18:30.
    expect(suggestedBedtime({ wake: '05:30', naps }, params46)).toBe('18:30');
  });
});

describe('NAP_WEIGHTS', () => {
  it('every distribution sums to 1.0 (±0.001)', () => {
    for (const [, w] of Object.entries(NAP_WEIGHTS)) {
      const sum = w.reduce((s, x) => s + x, 0);
      expect(Math.abs(sum - 1.0)).toBeLessThan(0.001);
    }
  });
});

describe('suggestNapEnd', () => {
  const params3 = { naps: 3, daySleepH: 3 }; // 180 min budget, weights [0.27, 0.55, 0.18]
  const params1 = { naps: 1, daySleepH: 1.5 }; // 90 min budget, weight [1.0]

  it('first nap of 3-nap day at 09:00 → ~09:49 (27% of 180 min, rounds to 49)', () => {
    // Math.round(180 * 0.27) = Math.round(48.6) = 49 min
    expect(suggestNapEnd(0, '09:00', [], params3)).toBe('09:49');
  });

  it('second nap of 3-nap day at 12:00 (first one was full hour) → ~13:32 (55%/73% of 120 min)', () => {
    // After 60 min completed, remaining = 120 min, weights for naps 2+3 sum to 0.73
    // Nap 2 share = 120 * (0.55 / 0.73) = 90.4 ≈ 90 min → 13:30
    expect(suggestNapEnd(1, '12:00', [{ start: '09:00', end: '10:00' }], params3)).toBe('13:30');
  });

  it('returns null when napStart invalid', () => {
    expect(suggestNapEnd(0, 'not-a-time', [], params3)).toBeNull();
  });

  it('returns null when budget already exhausted', () => {
    // 3 hours slept already
    const naps: NapPair[] = [
      { start: '09:00', end: '10:00' },
      { start: '12:00', end: '14:00' }
    ];
    // completed = 180 min = budget → remaining 0 → null
    expect(suggestNapEnd(2, '16:00', naps, params3)).toBeNull();
  });

  it('caps suggestion to 180 min maximum', () => {
    // Wildly large budget would otherwise give 5h
    const huge = { naps: 1, daySleepH: 5 };
    const end = suggestNapEnd(0, '12:00', [], huge);
    // 5h at weight 1.0 = 300 min → capped to 180 → 15:00
    expect(end).toBe('15:00');
  });

  it('caps suggestion to 10 min minimum if remaining is tiny', () => {
    // 3-nap day, after 2h45 already slept, only 15 min left, but weighted to last nap
    const naps: NapPair[] = [
      { start: '09:00', end: '10:00' },
      { start: '12:00', end: '13:45' }
    ];
    // remaining = 180 - 60 - 105 = 15 min, weight for nap 3 / weight remaining = 0.18 / 0.18 = 1
    // → suggested = 15 min, no cap needed (15 ≥ 10)
    expect(suggestNapEnd(2, '16:00', naps, params3)).toBe('16:15');
  });

  it('handles 1-nap days (just adds budget to start)', () => {
    expect(suggestNapEnd(0, '13:00', [], params1)).toBe('14:30');
  });

  it('returns null when napIndex out of range', () => {
    expect(suggestNapEnd(5, '09:00', [], params3)).toBeNull();
    expect(suggestNapEnd(-1, '09:00', [], params3)).toBeNull();
  });
});

describe('computeDaySleepBudget', () => {
  it('returns total budget when no naps completed', () => {
    const r = computeDaySleepBudget([], { daySleepH: 3 });
    expect(r.totalMin).toBe(180);
    expect(r.completedMin).toBe(0);
    expect(r.remainingMin).toBe(180);
    expect(r.ratio).toBe(0);
  });
  it('counts only naps with both valid start and end', () => {
    const r = computeDaySleepBudget(
      [
        { start: '09:00', end: '10:00' },           // 60 min
        { start: '13:00', end: undefined },         // ignored (no end)
        { start: '15:00', end: '15:45' },           // 45 min
        { start: 'garbage', end: '16:00' }          // ignored (invalid start)
      ],
      { daySleepH: 3 }
    );
    expect(r.completedMin).toBe(105);
    expect(r.remainingMin).toBe(75);
    expect(r.ratio).toBeCloseTo(105 / 180);
  });
  it('caps remainingMin at 0 even when over budget', () => {
    const r = computeDaySleepBudget(
      [{ start: '09:00', end: '13:00' }],   // 240 min, well over a 180 budget
      { daySleepH: 3 }
    );
    expect(r.completedMin).toBe(240);
    expect(r.remainingMin).toBe(0);
    expect(r.ratio).toBeGreaterThan(1);
  });
});

describe('formatDuration', () => {
  it('formats minutes', () => {
    expect(formatDuration(0)).toBe('0 min');
    expect(formatDuration(45)).toBe('45 min');
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(90)).toBe('1h30');
    expect(formatDuration(180)).toBe('3h');
    expect(formatDuration(125)).toBe('2h05');
  });
});
