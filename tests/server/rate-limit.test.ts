import { describe, it, expect } from 'vitest';
import {
  rateLimit,
  clearRateLimit,
  purgeExpiredBuckets,
  _bucketCount
} from '../../src/lib/server/rate-limit';

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

describe('clearRateLimit', () => {
  it('resets a key so it can be used again', () => {
    const k = `clear-${Math.random()}`;
    rateLimit(k, 1, 60);
    expect(rateLimit(k, 1, 60)).toBe(false);
    clearRateLimit(k);
    expect(rateLimit(k, 1, 60)).toBe(true);
  });
  it('leaves other keys alone', () => {
    const a = `clear-a-${Math.random()}`;
    const b = `clear-b-${Math.random()}`;
    rateLimit(a, 1, 60);
    rateLimit(b, 1, 60);
    clearRateLimit(a);
    expect(rateLimit(b, 1, 60)).toBe(false);
  });
});

describe('purgeExpiredBuckets', () => {
  it('drops every bucket whose window has elapsed', () => {
    // Don't assume the map is empty — earlier tests may have left buckets.
    // Add two known buckets, then purge with a "now" far in the future so
    // every existing bucket (theirs and ours) becomes expired. The map
    // should be empty afterwards.
    rateLimit(`a-${Math.random()}`, 5, 60);
    rateLimit(`b-${Math.random()}`, 5, 60);
    expect(_bucketCount()).toBeGreaterThanOrEqual(2);
    purgeExpiredBuckets(Math.floor(Date.now() / 1000) + 3600);
    expect(_bucketCount()).toBe(0);
  });
  it('keeps buckets whose window is still open', () => {
    const k = `keep-${Math.floor(Math.random() * 1e9)}`;
    rateLimit(k, 5, 60);
    purgeExpiredBuckets(Math.floor(Date.now() / 1000)); // "now" — bucket still live
    // Bucket should still be there with count=1; 4 more hits should pass, 6th denied.
    for (let i = 0; i < 4; i++) expect(rateLimit(k, 5, 60)).toBe(true);
    expect(rateLimit(k, 5, 60)).toBe(false);
  });
});
