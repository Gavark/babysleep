import { describe, it, expect } from 'vitest';
import { AGE_PARAMS } from '$lib/age-params';

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
