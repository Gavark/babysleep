import { describe, it, expect } from 'vitest';
import { nextEmptyNapSlot, inProgressNapSlot, deriveTimerState, type TimerInput } from '../src/lib/wake-timer';

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

function mkInput(patch: Partial<TimerInput>): TimerInput {
  return {
    wakeTime: '',
    naps: [
      { start: '', end: '' },
      { start: '', end: '' },
      { start: '', end: '' },
      { start: '', end: '' }
    ],
    bedtime: '',
    awakeWindowMin: 165,
    ...patch
  };
}

function at(hhmm: string): Date {
  // Build a Date for today at the given local HH:MM (used for `now` in tests)
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

describe('deriveTimerState', () => {
  it('returns empty when wakeTime is missing and all naps are empty', () => {
    const state = deriveTimerState(mkInput({}), at('09:00'));
    expect(state.kind).toBe('empty');
  });

  it('returns awake from wakeTime when no nap finished yet', () => {
    const state = deriveTimerState(mkInput({ wakeTime: '07:00' }), at('09:00'));
    expect(state).toEqual({
      kind: 'awake',
      elapsedMin: 120,
      remainingMin: 45,
      nextNapAt: '09:45',
      overWindow: false
    });
  });

  it('returns awake from latest napEnd when a nap has finished', () => {
    const state = deriveTimerState(
      mkInput({
        wakeTime: '07:00',
        naps: [
          { start: '09:00', end: '10:00' },
          { start: '', end: '' },
          { start: '', end: '' },
          { start: '', end: '' }
        ]
      }),
      at('11:00')
    );
    expect(state).toMatchObject({ kind: 'awake', elapsedMin: 60, remainingMin: 105 });
  });

  it('uses the most recent napEnd when several naps finished', () => {
    const state = deriveTimerState(
      mkInput({
        wakeTime: '07:00',
        naps: [
          { start: '09:00', end: '10:00' },
          { start: '12:00', end: '13:00' },
          { start: '', end: '' },
          { start: '', end: '' }
        ]
      }),
      at('14:00')
    );
    expect(state).toMatchObject({ kind: 'awake', elapsedMin: 60 });
  });

  it('marks overWindow when elapsed exceeds awakeWindowMin', () => {
    const state = deriveTimerState(
      mkInput({ wakeTime: '07:00', awakeWindowMin: 120 }),
      at('10:00')
    );
    expect(state).toMatchObject({ kind: 'awake', elapsedMin: 180, remainingMin: -60, overWindow: true });
  });

  it('formats nextNapAt with leading zeros', () => {
    const state = deriveTimerState(mkInput({ wakeTime: '07:00' }), at('07:05'));
    expect((state as { kind: 'awake'; nextNapAt: string }).nextNapAt).toBe('09:45');
  });

  it('returns napping when nap1Start is filled and nap1End is empty', () => {
    const state = deriveTimerState(
      mkInput({
        wakeTime: '07:00',
        naps: [
          { start: '09:00', end: '' },
          { start: '', end: '' },
          { start: '', end: '' },
          { start: '', end: '' }
        ]
      }),
      at('09:30')
    );
    expect(state).toEqual({ kind: 'napping', napIdx: 0, elapsedMin: 30 });
  });

  it('returns napping with napIdx=2 when only nap3 is in progress', () => {
    const state = deriveTimerState(
      mkInput({
        wakeTime: '07:00',
        naps: [
          { start: '09:00', end: '10:00' },
          { start: '12:00', end: '13:00' },
          { start: '15:00', end: '' },
          { start: '', end: '' }
        ]
      }),
      at('15:45')
    );
    expect(state).toEqual({ kind: 'napping', napIdx: 2, elapsedMin: 45 });
  });

  it('returns bedtime even when a nap is technically in progress', () => {
    const state = deriveTimerState(
      mkInput({
        wakeTime: '07:00',
        naps: [{ start: '09:00', end: '' }, { start: '', end: '' }, { start: '', end: '' }, { start: '', end: '' }],
        bedtime: '19:30'
      }),
      at('19:31')
    );
    expect(state).toEqual({ kind: 'bedtime', bedtime: '19:30' });
  });

  it('returns empty when wakeTime is invalid HH:MM', () => {
    const state = deriveTimerState(mkInput({ wakeTime: 'bogus' }), at('09:00'));
    expect(state.kind).toBe('empty');
  });

  it('clamps napping elapsedMin to 0 when nap start is in the future', () => {
    const state = deriveTimerState(
      mkInput({
        wakeTime: '07:00',
        naps: [{ start: '14:00', end: '' }, { start: '', end: '' }, { start: '', end: '' }, { start: '', end: '' }]
      }),
      at('13:00')
    );
    expect(state).toEqual({ kind: 'napping', napIdx: 0, elapsedMin: 0 });
  });
});
