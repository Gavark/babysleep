import { describe, it, expect } from 'vitest';
import { buildEntryPatch } from '../../src/routes/app/babies/[id]/today/_logic';

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
