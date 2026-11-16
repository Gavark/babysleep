import { isValidHHMM } from '$lib/time';
import { isValidTimezone } from '$lib/tz';

export type EntryPatchResult =
  | { ok: true; patch: Record<string, string | number | null>; droppedNulls: number; explicitClears: number; entryTz: string | null | undefined }
  | { ok: false; kind: 'time' | 'pause'; field: string; value: string };

const FIELDS = ['wake_time',
  'nap1_start', 'nap1_end',
  'nap2_start', 'nap2_end',
  'nap3_start', 'nap3_end',
  'nap4_start', 'nap4_end',
  'nap5_start', 'nap5_end',
  'nap6_start', 'nap6_end',
  'nap7_start', 'nap7_end',
  'nap8_start', 'nap8_end',
  'bedtime'] as const;

const PAUSE_FIELDS = [
  'nap1_pause_min', 'nap2_pause_min', 'nap3_pause_min', 'nap4_pause_min',
  'nap5_pause_min', 'nap6_pause_min', 'nap7_pause_min', 'nap8_pause_min'
] as const;

function camel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/** Builds the upsert patch from the save form. Pure: no DB, no i18n. */
export function buildEntryPatch(form: FormData): EntryPatchResult {
  const patch: Record<string, string | number | null> = {};
  for (const f of FIELDS) {
    const v = String(form.get(f) ?? '').trim();
    if (v === '') patch[camel(f)] = null;
    else if (!isValidHHMM(v)) return { ok: false, kind: 'time', field: f, value: v };
    else patch[camel(f)] = v;
  }
  for (const f of PAUSE_FIELDS) {
    const raw = String(form.get(f) ?? '').trim();
    if (raw === '') { patch[camel(f)] = null; continue; }
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0 || n > 600) return { ok: false, kind: 'pause', field: f, value: raw };
    patch[camel(f)] = Math.round(n) || null;
  }

  // HOTFIX v0.5.5: drop null values from time/nap fields so a stale form
  // (e.g. another device just wrote nap1_start that this device hasn't
  // re-loaded yet) doesn't erase the freshly-written value. An empty input
  // would otherwise become null in DB and clobber a concurrent edit.
  let droppedNulls = 0;
  for (const k of Object.keys(patch)) {
    if (patch[k] === null) { droppedNulls++; delete patch[k]; }
  }

  // Explicit "clear this field" requests from the client: re-adds null for
  // each field the user explicitly asked to clear. `clear` entries are
  // snake_case field names (matching FIELDS and PAUSE_FIELDS).
  const timeFieldSet = new Set<string>([...FIELDS, ...PAUSE_FIELDS] as readonly string[]);
  let explicitClears = 0;
  for (const raw of form.getAll('clear')) {
    const name = typeof raw === 'string' ? raw : '';
    if (timeFieldSet.has(name)) {
      patch[camel(name)] = null;
      explicitClears++;
    }
  }

  // notes + timezone are only written when posted, so a time-only autosave
  // never touches them. Posted-but-empty means null.
  if (form.has('notes')) {
    patch.notes = String(form.get('notes') ?? '').trim() || null;
  }
  let entryTz: string | null | undefined;
  if (form.has('timezone')) {
    const tzRaw = String(form.get('timezone') ?? '').trim();
    entryTz = tzRaw && isValidTimezone(tzRaw) ? tzRaw : null;
    patch.timezone = entryTz;
  }

  return { ok: true, patch, droppedNulls, explicitClears, entryTz };
}
