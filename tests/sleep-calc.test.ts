import { describe, it, expect } from 'vitest';
import { ageInMonths, idealBedtime } from '$lib/sleep-calc';

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
