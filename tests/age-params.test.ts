import { describe, it, expect } from 'vitest';
import { AGE_PARAMS, paramsForAge, findCurrentBracketIdx } from '$lib/age-params';

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
      expect(typeof t.key).toBe('string');
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
    expect(paramsForAge(0).key).toBe('0-3m');
  });
  it('returns 6-9 mois for 6', () => {
    expect(paramsForAge(6).key).toBe('6-9m');
  });
  it('returns 6-9 mois for 8 (within tier)', () => {
    expect(paramsForAge(8).key).toBe('6-9m');
  });
  it('clamps to first tier for negative input', () => {
    expect(paramsForAge(-3).key).toBe('0-3m');
  });
  it('clamps to last tier for input >= 36', () => {
    expect(paramsForAge(36).key).toBe('2-3y');
    expect(paramsForAge(60).key).toBe('2-3y');
  });
  it('returns the right tier at the boundary (Sheets parity: ascending match-≤)', () => {
    // 12 should match 12-18 (boundary inclusive on min, like VLOOKUP TRUE)
    expect(paramsForAge(12).key).toBe('12-18m');
  });
});

describe('findCurrentBracketIdx', () => {
  it('returns 0 for newborn (0 months)', () => {
    expect(findCurrentBracketIdx(0)).toBe(0);
  });

  it('returns the 4-6 bracket index for 5 months', () => {
    const idx = findCurrentBracketIdx(5);
    expect(AGE_PARAMS[idx].key).toBe('4-6m');
  });

  it('returns the 9-12 bracket index for 10 months', () => {
    const idx = findCurrentBracketIdx(10);
    expect(AGE_PARAMS[idx].key).toBe('9-12m');
  });

  it('returns the last bracket index for ages past the table (e.g. 100 months)', () => {
    const idx = findCurrentBracketIdx(100);
    expect(idx).toBe(AGE_PARAMS.length - 1);
  });

  it('matches the bracket returned by paramsForAge', () => {
    for (const months of [0, 2, 5, 10, 15, 24, 36, 60]) {
      const idx = findCurrentBracketIdx(months);
      expect(AGE_PARAMS[idx]).toBe(paramsForAge(months));
    }
  });
});
