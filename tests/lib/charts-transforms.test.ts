import { describe, it, expect } from 'vitest';
import {
  toNightHours, axisRange, tickStep, rollingMean,
  seriesStats, formatDayMonth, formatFullDate
} from '../../src/lib/charts/transforms';

describe('toNightHours', () => {
  it('leaves evening hours untouched', () => {
    expect(toNightHours(20)).toBe(20);
    expect(toNightHours(23.5)).toBe(23.5);
  });

  it('pushes after-midnight hours past 24', () => {
    expect(toNightHours(0.5)).toBe(24.5);
    expect(toNightHours(0)).toBe(24);
  });

  it('keeps ordering across midnight — the whole point', () => {
    expect(toNightHours(0.5)).toBeGreaterThan(toNightHours(23.5));
  });

  it('uses noon as the boundary', () => {
    expect(toNightHours(12)).toBe(12);
    expect(toNightHours(11.99)).toBeCloseTo(35.99);
  });
});

describe('axisRange', () => {
  it('pads by 30 min and rounds outward to whole hours', () => {
    expect(axisRange([6.25, 7.75])).toEqual({ min: 5, max: 9 });
  });

  it('ignores nulls and non-finite values', () => {
    expect(axisRange([null, 6.25, NaN, 7.75, null])).toEqual({ min: 5, max: 9 });
  });

  it('never collapses to a zero span when every value is identical', () => {
    const r = axisRange([7, 7, 7]);
    expect(r.max - r.min).toBeGreaterThanOrEqual(2);
  });

  it('handles a single value', () => {
    const r = axisRange([7]);
    expect(r.min).toBeLessThan(7);
    expect(r.max).toBeGreaterThan(7);
  });

  it('falls back to a full day when there is no usable value', () => {
    expect(axisRange([])).toEqual({ min: 0, max: 24 });
    expect(axisRange([null, null])).toEqual({ min: 0, max: 24 });
  });

  it('supports night-hour values above 24', () => {
    expect(axisRange([19, 24.5])).toEqual({ min: 18, max: 25 });
  });
});

describe('tickStep', () => {
  it('uses hourly ticks on a narrow axis', () => {
    expect(tickStep(5, 9)).toBe(1);
  });

  it('uses two-hour ticks on a wide axis', () => {
    expect(tickStep(0, 24)).toBe(2);
  });
});

describe('rollingMean', () => {
  it('centres the window', () => {
    // window 3, minSamples 1 → each point is the mean of itself and its neighbours
    expect(rollingMean([1, 2, 3], 3, 1)).toEqual([1.5, 2, 2.5]);
  });

  it('excludes nulls from the mean instead of treating them as zero', () => {
    // [10, null, 20] window 3 → middle is mean(10, 20) = 15, NOT mean(10, 0, 20)
    expect(rollingMean([10, null, 20], 3, 1)).toEqual([10, 15, 20]);
  });

  it('emits null when fewer than minSamples values are present', () => {
    // minSamples counts FINITE values in the window, not window slots.
    // window 3: index 0 and 1 each see two finite values; index 2 sees one,
    // index 3 sees none.
    expect(rollingMean([10, 20, null, null], 3, 2)).toEqual([15, 15, null, null]);
  });

  it('emits null for an all-null window', () => {
    expect(rollingMean([null, null, null], 3, 1)).toEqual([null, null, null]);
  });

  it('handles a 7-day window over a flat series', () => {
    const flat = Array(10).fill(60);
    expect(rollingMean(flat, 7, 4)).toEqual(Array(10).fill(60));
  });

  it('emits null at the edges when the partial window is too small', () => {
    // index 0 of a 7-window sees only 4 values (itself + 3 after) → 4 >= 4, ok.
    // With minSamples 5 it must be null.
    const flat = Array(10).fill(60);
    expect(rollingMean(flat, 7, 5)[0]).toBeNull();
  });

  it('returns an empty array for an empty input', () => {
    expect(rollingMean([], 7, 4)).toEqual([]);
  });
});

describe('seriesStats', () => {
  it('reports min, max and mean over the finite values', () => {
    expect(seriesStats([10, null, 20, 30])).toEqual({ min: 10, max: 30, avg: 20 });
  });

  it('returns null when there is nothing to summarise', () => {
    expect(seriesStats([null, null])).toBeNull();
    expect(seriesStats([])).toBeNull();
  });
});

describe('date formatting', () => {
  // Guards the process-timezone trap: these must not shift by a day depending
  // on where the process runs.
  it('formats day/month for fr', () => {
    expect(formatDayMonth('2026-07-31', 'fr')).toBe('31/07');
  });

  it('formats month/day for en', () => {
    expect(formatDayMonth('2026-07-31', 'en')).toBe('07/31');
  });

  it('does not drift across a month boundary', () => {
    expect(formatDayMonth('2026-01-01', 'fr')).toBe('01/01');
    expect(formatDayMonth('2026-12-31', 'fr')).toBe('31/12');
  });

  it('produces a full date containing the year', () => {
    expect(formatFullDate('2026-07-31', 'fr')).toContain('2026');
    expect(formatFullDate('2026-07-31', 'en')).toContain('2026');
  });
});
