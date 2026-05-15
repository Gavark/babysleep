import { describe, it, expect } from 'vitest';
import { isValidTimezone, todayISOInTZ, resolveTimezone } from '$lib/tz';

describe('isValidTimezone', () => {
  it('accepts IANA names', () => {
    expect(isValidTimezone('Europe/Paris')).toBe(true);
    expect(isValidTimezone('America/Guadeloupe')).toBe(true);
    expect(isValidTimezone('UTC')).toBe(true);
  });
  it('rejects garbage', () => {
    expect(isValidTimezone('')).toBe(false);
    expect(isValidTimezone('Bogus/Place')).toBe(false);
  });
});

describe('todayISOInTZ', () => {
  it('Paris and Guadeloupe at 23:30 UTC differ by a day', () => {
    const utcNight = new Date('2026-05-14T23:30:00Z');
    expect(todayISOInTZ('Europe/Paris', utcNight)).toBe('2026-05-15');
    expect(todayISOInTZ('America/Guadeloupe', utcNight)).toBe('2026-05-14');
  });
  it('falls back to Europe/Paris on invalid', () => {
    const d = new Date('2026-05-14T23:30:00Z');
    expect(todayISOInTZ('Garbage/Place', d)).toBe('2026-05-15');
  });
});

describe('resolveTimezone', () => {
  it('prefers entry > baby > user', () => {
    expect(resolveTimezone('Asia/Tokyo', 'America/Guadeloupe', 'Europe/Paris')).toBe('Asia/Tokyo');
    expect(resolveTimezone(null, 'America/Guadeloupe', 'Europe/Paris')).toBe('America/Guadeloupe');
    expect(resolveTimezone(null, null, 'Europe/Paris')).toBe('Europe/Paris');
    expect(resolveTimezone(null, null, null)).toBe('Europe/Paris');
  });
  it('skips invalid in chain', () => {
    expect(resolveTimezone('Bogus', 'America/Guadeloupe', 'Europe/Paris')).toBe('America/Guadeloupe');
  });
});
