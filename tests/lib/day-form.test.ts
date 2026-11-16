import { describe, it, expect } from 'vitest';
import {
  FIELD_NAMES,
  buildSaveBody,
  fieldsFromEntry,
  mergeServer,
  napPairs,
  restoreEmptied,
  visibleNapCount,
  type DayFields
} from '../../src/lib/day-form';

const empty = (): DayFields => fieldsFromEntry(null);

describe('FIELD_NAMES', () => {
  it('has 28 unique names', () => {
    expect(FIELD_NAMES).toHaveLength(28);
    expect(new Set(FIELD_NAMES).size).toBe(28);
  });
});

describe('fieldsFromEntry', () => {
  it('gives empty strings for a missing entry', () => {
    const f = fieldsFromEntry(null);
    for (const name of FIELD_NAMES) expect(f[name]).toBe('');
  });
  it('maps camelCase entry keys to snake_case fields', () => {
    const f = fieldsFromEntry({
      wakeTime: '06:40',
      nap1PauseMin: 10,
      nap2PauseMin: 0,
      notes: null,
      timezone: 'Europe/Paris'
    });
    expect(f.wake_time).toBe('06:40');
    expect(f.nap1_pause_min).toBe('10');
    expect(f.nap2_pause_min).toBe('');
    expect(f.notes).toBe('');
    expect(f.timezone).toBe('Europe/Paris');
  });
});

describe('mergeServer', () => {
  it('takes server values except for kept fields', () => {
    const merged = mergeServer(
      { ...empty(), wake_time: '06:30', notes: 'local' },
      { ...empty(), wake_time: '06:40', notes: 'serveur', bedtime: '20:00' },
      new Set(['notes'])
    );
    expect(merged.wake_time).toBe('06:40');
    expect(merged.notes).toBe('local');
    expect(merged.bedtime).toBe('20:00');
  });
});

describe('napPairs', () => {
  it('always returns 8 pairs with numeric pauses', () => {
    const pairs = napPairs({ ...empty(), nap1_pause_min: '15', nap2_start: '10:00' });
    expect(pairs).toHaveLength(8);
    expect(pairs[0].pauseMin).toBe(15);
    expect(pairs[1]).toEqual({ start: '10:00', end: '', pauseMin: 0 });
  });
});

describe('visibleNapCount', () => {
  it('uses expected on an empty day', () => {
    expect(visibleNapCount(empty(), 3)).toBe(3);
  });
  it('covers the highest filled nap', () => {
    expect(visibleNapCount({ ...empty(), nap5_start: '14:00' }, 3)).toBe(5);
  });
  it('clamps to 1..8', () => {
    expect(visibleNapCount(empty(), 0)).toBe(1);
    expect(visibleNapCount(empty(), 12)).toBe(8);
  });
});

describe('restoreEmptied', () => {
  it('puts back the server value of a sent field emptied with the keyboard', () => {
    const restored = restoreEmptied(
      { ...empty(), bedtime: '', wake_time: '06:50' },
      { ...empty(), bedtime: '20:00', wake_time: '06:50' },
      ['bedtime', 'wake_time'],
      new Set()
    );
    expect(restored.bedtime).toBe('20:00');
    expect(restored.wake_time).toBe('06:50');
  });
  it('leaves a field cleared with the cross empty', () => {
    const restored = restoreEmptied(
      { ...empty(), bedtime: '' },
      { ...empty(), bedtime: '20:00' },
      ['bedtime'],
      new Set(['bedtime'])
    );
    expect(restored.bedtime).toBe('');
  });
  it('ignores fields that were not sent or are not empty', () => {
    const restored = restoreEmptied(
      { ...empty(), bedtime: '', nap1_start: '09:30' },
      { ...empty(), bedtime: '20:00', nap1_start: '09:10' },
      ['nap1_start'],
      new Set()
    );
    expect(restored.bedtime).toBe('');
    expect(restored.nap1_start).toBe('09:30');
  });
});

describe('buildSaveBody', () => {
  const fields = { ...empty(), wake_time: '06:40', bedtime: '', nap1_pause_min: '15', notes: 'n' };
  it('always posts the date', () => {
    const body = buildSaveBody(fields, [], new Set(), '2026-11-16');
    expect(body.get('date')).toBe('2026-11-16');
    expect([...body.keys()]).toEqual(['date']);
  });
  it('posts the value of a requested field', () => {
    const body = buildSaveBody(fields, ['wake_time', 'nap1_pause_min'], new Set(), '2026-11-16');
    expect(body.get('wake_time')).toBe('06:40');
    expect(body.get('nap1_pause_min')).toBe('15');
    expect(body.getAll('clear')).toEqual([]);
  });
  it('posts only a clear entry for a cleared field', () => {
    const body = buildSaveBody(fields, ['bedtime', 'wake_time'], new Set(['bedtime']), '2026-11-16');
    expect(body.has('bedtime')).toBe(false);
    expect(body.getAll('clear')).toEqual(['bedtime']);
    expect(body.get('wake_time')).toBe('06:40');
  });
  it('leaves out fields that were not requested, even cleared ones', () => {
    const body = buildSaveBody(fields, ['wake_time'], new Set(['bedtime']), '2026-11-16');
    expect(body.has('notes')).toBe(false);
    expect(body.has('bedtime')).toBe(false);
    expect(body.getAll('clear')).toEqual([]);
  });
  it('posts an empty string for a requested field emptied without a clear', () => {
    const body = buildSaveBody(fields, ['bedtime'], new Set(), '2026-11-16');
    expect(body.get('bedtime')).toBe('');
  });
});
