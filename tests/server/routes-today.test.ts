import { describe, it, expect } from 'vitest';
import { buildEntryPatch, isValidISODate } from '../../src/routes/app/babies/[id]/today/_logic';

function fd(entries: Record<string, string | string[]>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) for (const x of [v].flat()) f.append(k, x);
  return f;
}

describe('buildEntryPatch', () => {
  it('keeps only the posted, non-empty time fields', () => {
    const r = buildEntryPatch(fd({ nap1_end: '10:25', nap2_start: '' }));
    expect(r).toMatchObject({ ok: true, patch: { nap1End: '10:25' } });
    if (r.ok) expect(Object.keys(r.patch)).toEqual(['nap1End']);
  });
  it('leaves notes and timezone untouched when they are not posted', () => {
    const r = buildEntryPatch(fd({ wake_time: '06:40' }));
    if (!r.ok) throw new Error('expected ok');
    expect('notes' in r.patch).toBe(false);
    expect('timezone' in r.patch).toBe(false);
    expect(r.entryTz).toBeUndefined();
  });
  it('writes notes and timezone when posted, empty meaning null', () => {
    const r = buildEntryPatch(fd({ notes: '  ', timezone: 'Europe/London' }));
    expect(r).toMatchObject({ ok: true, patch: { notes: null, timezone: 'Europe/London' }, entryTz: 'Europe/London' });
  });
  it('treats an invalid posted timezone as null', () => {
    expect(buildEntryPatch(fd({ timezone: 'Mars/Phobos' }))).toMatchObject({ ok: true, patch: { timezone: null }, entryTz: null });
  });
  it('honours explicit clears, including a pause', () => {
    const r = buildEntryPatch(fd({ clear: ['nap1_end', 'nap1_pause_min', 'bogus'] }));
    expect(r).toMatchObject({ ok: true, patch: { nap1End: null, nap1PauseMin: null }, explicitClears: 2 });
  });
  it('rejects an invalid time and an out-of-range pause', () => {
    expect(buildEntryPatch(fd({ wake_time: '25:00' }))).toEqual({ ok: false, kind: 'time', field: 'wake_time', value: '25:00' });
    expect(buildEntryPatch(fd({ nap1_pause_min: '601' }))).toEqual({ ok: false, kind: 'pause', field: 'nap1_pause_min', value: '601' });
  });
});

describe('isValidISODate', () => {
  it('accepts a real calendar date in YYYY-MM-DD form', () => {
    expect(isValidISODate('2026-11-16')).toBe(true);
    expect(isValidISODate('2024-02-29')).toBe(true);
  });
  it('rejects other shapes', () => {
    for (const s of ['', 'undefined', 'null', '2026-1-16', '2026-11-16T00:00', ' 2026-11-16', '20261116', '2026/11/16']) {
      expect(isValidISODate(s)).toBe(false);
    }
  });
  it('rejects dates that do not exist', () => {
    for (const s of ['2026-02-29', '2026-13-01', '2026-00-10', '2026-04-31', '2026-11-00']) {
      expect(isValidISODate(s)).toBe(false);
    }
  });
});
