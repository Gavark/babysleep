import { describe, it, expect } from 'vitest';
import { rateLimit } from '../../src/lib/server/rate-limit';

describe('rateLimit', () => {
  it('allows up to limit then denies', () => {
    const key = 'k1';
    for (let i = 0; i < 5; i++) expect(rateLimit(key, 5, 60)).toBe(true);
    expect(rateLimit(key, 5, 60)).toBe(false);
  });
  it('separate keys independent', () => {
    expect(rateLimit('a', 1, 60)).toBe(true);
    expect(rateLimit('a', 1, 60)).toBe(false);
    expect(rateLimit('b', 1, 60)).toBe(true);
  });
});
