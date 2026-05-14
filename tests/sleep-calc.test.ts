import { describe, it, expect } from 'vitest';
import { ageInMonths, idealBedtime, suggestNextNap, suggestedBedtime } from '$lib/sleep-calc';

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
});
