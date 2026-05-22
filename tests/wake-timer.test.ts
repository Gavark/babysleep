import { describe, it, expect } from 'vitest';
import { nextEmptyNapSlot, inProgressNapSlot, type TimerInput } from '../src/lib/wake-timer';

function mkNaps(naps: Array<[string, string]>): TimerInput['naps'] {
  return naps.map(([s, e]) => ({ start: s, end: e }));
}

describe('nextEmptyNapSlot', () => {
  it('returns 0 when all four slots are empty', () => {
    expect(nextEmptyNapSlot(mkNaps([['', ''], ['', ''], ['', ''], ['', '']]))).toBe(0);
  });

  it('returns 1 when nap1 is filled (start only)', () => {
    expect(nextEmptyNapSlot(mkNaps([['09:00', ''], ['', ''], ['', ''], ['', '']]))).toBe(1);
  });

  it('returns 2 when nap1 and nap2 are filled', () => {
    expect(nextEmptyNapSlot(mkNaps([['09:00', '10:00'], ['12:00', ''], ['', ''], ['', '']]))).toBe(2);
  });

  it('returns null when all four slots have a start time', () => {
    expect(nextEmptyNapSlot(mkNaps([['09:00', '10:00'], ['12:00', '13:00'], ['15:00', '16:00'], ['17:00', '']]))).toBeNull();
  });
});

describe('inProgressNapSlot', () => {
  it('returns null when no slot is in progress', () => {
    expect(inProgressNapSlot(mkNaps([['09:00', '10:00'], ['', ''], ['', ''], ['', '']]))).toBeNull();
  });

  it('returns 0 when nap1 has start but no end', () => {
    expect(inProgressNapSlot(mkNaps([['09:00', ''], ['', ''], ['', ''], ['', '']]))).toBe(0);
  });

  it('returns 2 when nap1 and nap2 are complete and nap3 has start only', () => {
    expect(inProgressNapSlot(mkNaps([['09:00', '10:00'], ['12:00', '13:00'], ['15:00', ''], ['', '']]))).toBe(2);
  });

  it('returns null when all four slots are empty', () => {
    expect(inProgressNapSlot(mkNaps([['', ''], ['', ''], ['', ''], ['', '']]))).toBeNull();
  });
});
