import { describe, it, expect } from 'vitest';
import { withAlpha } from '../../src/lib/charts/theme';

describe('withAlpha', () => {
  it('appends an 8-digit-hex alpha channel', () => {
    expect(withAlpha('#C97A5D', 1)).toBe('#C97A5Dff');
    expect(withAlpha('#C97A5D', 0)).toBe('#C97A5D00');
  });

  it('reproduces the 0.18 fill used by the existing charts', () => {
    expect(withAlpha('#C97A5D', 0.18)).toBe('#C97A5D2e');
  });

  it('clamps out-of-range alpha', () => {
    expect(withAlpha('#C97A5D', 5)).toBe('#C97A5Dff');
    expect(withAlpha('#C97A5D', -1)).toBe('#C97A5D00');
  });

  it('returns the input unchanged when it is not a 6-digit hex', () => {
    // Tokens are all 6-digit hex; anything else means a token was renamed or
    // is missing, and a silently mangled colour would be worse than an opaque one.
    expect(withAlpha('', 0.18)).toBe('');
    expect(withAlpha('#FFF', 0.18)).toBe('#FFF');
    expect(withAlpha('rgb(1,2,3)', 0.18)).toBe('rgb(1,2,3)');
  });
});
