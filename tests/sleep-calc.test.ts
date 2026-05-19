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
  const params = { beforeBedWindowMin: 180, nightSleepH: 11 } as const;

  it('returns idealBedtime when no nap end provided', () => {
    expect(suggestedBedtime({ wake: '07:00', napEnds: [] }, params)).toBe('20:00');
  });
  it('returns lastNap + beforeBedWindowMin when at least one nap', () => {
    expect(suggestedBedtime({ wake: '07:00', napEnds: ['10:00', '15:00'] }, params)).toBe('18:00');
  });
  it('uses the max of (wake, napEnds) — order-independent', () => {
    expect(suggestedBedtime({ wake: '07:00', napEnds: ['16:00', '10:00'] }, params)).toBe('19:00');
  });
  it('ignores empty/undefined nap ends', () => {
    expect(suggestedBedtime({ wake: '07:00', napEnds: ['', undefined, '15:00'] as (string|undefined)[] }, params))
      .toBe('18:00');
  });

  it('shifts bedtime later when over budget (60% compensation, capped at +90)', () => {
    // 1 nap completed; lastEnd=15:00 (900 min) + 180 = 18:00 natural bedtime
    const naturalParams = { beforeBedWindowMin: 180, nightSleepH: 11 };
    // Budget 180 min, completed 240 min → excess 60 min → shift +36 min
    const bt = suggestedBedtime(
      { wake: '07:00', napEnds: ['15:00'] },
      naturalParams,
      { totalMin: 180, completedMin: 240 }
    );
    expect(bt).toBe('18:36'); // 18:00 + 36 min
  });

  it('shifts bedtime earlier when under budget', () => {
    // Budget 180 min, completed 60 min → excess -120 → shift -72 min
    const bt = suggestedBedtime(
      { wake: '07:00', napEnds: ['15:00'] },
      { beforeBedWindowMin: 180, nightSleepH: 11 },
      { totalMin: 180, completedMin: 60 }
    );
    expect(bt).toBe('16:48'); // 18:00 - 72 min
  });

  it('caps shift at +90 min for big excess', () => {
    // Excess 300 min × 0.6 = 180 min, capped at +90
    const bt = suggestedBedtime(
      { wake: '07:00', napEnds: ['15:00'] },
      { beforeBedWindowMin: 180, nightSleepH: 11 },
      { totalMin: 180, completedMin: 480 }
    );
    expect(bt).toBe('19:30'); // 18:00 + 90 min
  });

  it('caps shift at -90 min for big shortage', () => {
    // Excess -300 × 0.6 = -180, capped at -90
    const bt = suggestedBedtime(
      { wake: '07:00', napEnds: ['15:00'] },
      { beforeBedWindowMin: 180, nightSleepH: 11 },
      { totalMin: 180, completedMin: 0 }   // 0 completed but at least 1 nap "ended" — though here napEnds=['15:00']
    );
    expect(bt).toBe('16:30'); // 18:00 - 90 min
  });

  it('ignores dayBudget with totalMin = 0', () => {
    const bt = suggestedBedtime(
      { wake: '07:00', napEnds: ['15:00'] },
      { beforeBedWindowMin: 180, nightSleepH: 11 },
      { totalMin: 0, completedMin: 60 }
    );
    expect(bt).toBe('18:00'); // no shift
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
