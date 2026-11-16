/**
 * Field model of the Today page form: snake_case form field names, all values
 * held as strings, plus helpers to map from a `sleep_entries` row.
 */

const NAP_INDEXES = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const MAX_NAPS = NAP_INDEXES.length;

export const TIME_FIELDS: readonly string[] = [
  'wake_time',
  ...NAP_INDEXES.flatMap((i) => [`nap${i}_start`, `nap${i}_end`]),
  'bedtime'
];

export const PAUSE_FIELDS: readonly string[] = NAP_INDEXES.map((i) => `nap${i}_pause_min`);

export type FieldName = string;

export const FIELD_NAMES: readonly FieldName[] = [
  ...TIME_FIELDS,
  ...PAUSE_FIELDS,
  'notes',
  'timezone'
];

/** Pause fields hold '' or a positive integer as text. */
export type DayFields = Record<FieldName, string>;

/** 'nap1_pause_min' -> 'nap1PauseMin', 'wake_time' -> 'wakeTime'. */
function toCamel(field: string): string {
  return field.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function fieldsFromEntry(entry: Record<string, unknown> | null | undefined): DayFields {
  const fields: DayFields = {};
  for (const name of FIELD_NAMES) {
    const value = entry?.[toCamel(name)];
    if (value === null || value === undefined) fields[name] = '';
    else if (PAUSE_FIELDS.includes(name)) {
      const n = Number(value);
      fields[name] = n > 0 ? String(n) : '';
    } else fields[name] = String(value);
  }
  return fields;
}

/** Server values win, except for the fields in `keep` (being edited locally). */
export function mergeServer(
  local: DayFields,
  server: DayFields,
  keep: ReadonlySet<FieldName>
): DayFields {
  const merged: DayFields = { ...server };
  for (const name of keep) if (name in local) merged[name] = local[name];
  return merged;
}

/**
 * After a successful save: a sent field left empty without a `clear` was not
 * erased by the server (only ✕ erases), so show the server value again.
 */
export function restoreEmptied(
  local: DayFields,
  server: DayFields,
  sent: readonly FieldName[],
  cleared: ReadonlySet<FieldName>
): DayFields {
  const restored: DayFields = { ...local };
  for (const name of sent) {
    if (restored[name] === '' && !cleared.has(name) && name in server) restored[name] = server[name];
  }
  return restored;
}

export function napPairs(fields: DayFields): Array<{ start: string; end: string; pauseMin: number }> {
  return NAP_INDEXES.map((i) => ({
    start: fields[`nap${i}_start`] ?? '',
    end: fields[`nap${i}_end`] ?? '',
    pauseMin: Number(fields[`nap${i}_pause_min`]) || 0
  }));
}

/** How many nap rows to show: the expected count, extended to the last filled nap, within 1..8. */
export function visibleNapCount(fields: DayFields, expected: number): number {
  let lastFilled = 0;
  napPairs(fields).forEach((p, idx) => {
    if (p.start || p.end || p.pauseMin) lastFilled = idx + 1;
  });
  return Math.min(MAX_NAPS, Math.max(1, expected, lastFilled));
}
