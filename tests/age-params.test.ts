import { describe, it, expect } from 'vitest';
import { AGE_PARAMS, paramsForAge } from '$lib/age-params';

describe('AGE_PARAMS', () => {
  it('has 8 tiers', () => {
    expect(AGE_PARAMS).toHaveLength(8);
  });
  it('is sorted by ageMinMonths ascending', () => {
    for (let i = 1; i < AGE_PARAMS.length; i++) {
      expect(AGE_PARAMS[i].ageMinMonths).toBeGreaterThanOrEqual(AGE_PARAMS[i - 1].ageMinMonths);
    }
  });
  it('first tier starts at 0 months', () => {
    expect(AGE_PARAMS[0].ageMinMonths).toBe(0);
  });
  it('last tier ends at 36 months', () => {
    expect(AGE_PARAMS[AGE_PARAMS.length - 1].ageMaxMonths).toBe(36);
  });
  it('every tier has required fields', () => {
    for (const t of AGE_PARAMS) {
      expect(typeof t.label).toBe('string');
      expect(typeof t.naps).toBe('number');
      expect(typeof t.awakeWindowMin).toBe('number');
      expect(typeof t.beforeBedWindowMin).toBe('number');
      expect(typeof t.nightSleepH).toBe('number');
      expect(typeof t.daySleepH).toBe('number');
    }
  });
});

describe('paramsForAge', () => {
  it('returns 0-3 mois for 0', () => {
    expect(paramsForAge(0).label).toBe('0-3 mois');
  });
  it('returns 6-9 mois for 6', () => {
    expect(paramsForAge(6).label).toBe('6-9 mois');
  });
  it('returns 6-9 mois for 8 (within tier)', () => {
    expect(paramsForAge(8).label).toBe('6-9 mois');
  });
  it('clamps to first tier for negative input', () => {
    expect(paramsForAge(-3).label).toBe('0-3 mois');
  });
  it('clamps to last tier for input >= 36', () => {
    expect(paramsForAge(36).label).toBe('2-3 ans');
    expect(paramsForAge(60).label).toBe('2-3 ans');
  });
  it('returns the right tier at the boundary (Sheets parity: ascending match-≤)', () => {
    // 12 should match 12-18 (boundary inclusive on min, like VLOOKUP TRUE)
    expect(paramsForAge(12).label).toBe('12-18 mois');
  });
});
