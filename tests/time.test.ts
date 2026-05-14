import { describe, it, expect } from 'vitest';
import { parseHHMM, formatHHMM, isValidHHMM, diffMinutesMod, addMinutesMod } from '$lib/time';

describe('parseHHMM', () => {
  it('parses 07:00 to 420 minutes', () => {
    expect(parseHHMM('07:00')).toBe(7 * 60);
  });
  it('parses 00:00 to 0', () => {
    expect(parseHHMM('00:00')).toBe(0);
  });
  it('parses 23:59 to 1439', () => {
    expect(parseHHMM('23:59')).toBe(23 * 60 + 59);
  });
  it('throws on invalid input', () => {
    expect(() => parseHHMM('25:00')).toThrow();
    expect(() => parseHHMM('7:00')).toThrow();
    expect(() => parseHHMM('xx:00')).toThrow();
    expect(() => parseHHMM('')).toThrow();
  });
});

describe('formatHHMM', () => {
  it('formats 420 to 07:00', () => {
    expect(formatHHMM(420)).toBe('07:00');
  });
  it('formats 0 to 00:00', () => {
    expect(formatHHMM(0)).toBe('00:00');
  });
  it('wraps values >= 1440 with mod', () => {
    expect(formatHHMM(1440)).toBe('00:00');
    expect(formatHHMM(1500)).toBe('01:00');
  });
  it('wraps negatives', () => {
    expect(formatHHMM(-60)).toBe('23:00');
  });
});

describe('isValidHHMM', () => {
  it('accepts valid HH:MM', () => {
    expect(isValidHHMM('07:00')).toBe(true);
    expect(isValidHHMM('23:59')).toBe(true);
  });
  it('rejects invalid', () => {
    expect(isValidHHMM('7:00')).toBe(false);
    expect(isValidHHMM('24:00')).toBe(false);
    expect(isValidHHMM('07:60')).toBe(false);
    expect(isValidHHMM('abc')).toBe(false);
    expect(isValidHHMM('')).toBe(false);
  });
});

describe('diffMinutesMod', () => {
  it('returns 360 between 19:00 (prev) and 01:00 (next) crossing midnight', () => {
    expect(diffMinutesMod('19:00', '01:00')).toBe(6 * 60);
  });
  it('returns 60 within the same day', () => {
    expect(diffMinutesMod('07:00', '08:00')).toBe(60);
  });
  it('returns 0 when equal', () => {
    expect(diffMinutesMod('12:00', '12:00')).toBe(0);
  });
  it('returns positive duration always', () => {
    expect(diffMinutesMod('22:00', '21:00')).toBe(23 * 60);
  });
});

describe('addMinutesMod', () => {
  it('adds minutes within a day', () => {
    expect(addMinutesMod('07:00', 90)).toBe('08:30');
  });
  it('wraps past midnight', () => {
    expect(addMinutesMod('23:00', 90)).toBe('00:30');
  });
  it('subtracts (negative minutes) past midnight', () => {
    expect(addMinutesMod('00:30', -60)).toBe('23:30');
  });
});
