const FALLBACK_TZ = 'Europe/Paris';

export function isValidTimezone(tz: string): boolean {
  if (typeof tz !== 'string' || !tz.trim()) return false;
  try {
    new Intl.DateTimeFormat('en-CA', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function todayISOInTZ(tz: string, now: Date = new Date()): string {
  const safe = isValidTimezone(tz) ? tz : FALLBACK_TZ;
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: safe,
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(now);
}

export function resolveTimezone(
  entryTz: string | null | undefined,
  babyTz: string | null | undefined,
  userTz: string | null | undefined
): string {
  if (entryTz && isValidTimezone(entryTz)) return entryTz;
  if (babyTz && isValidTimezone(babyTz)) return babyTz;
  if (userTz && isValidTimezone(userTz)) return userTz;
  return FALLBACK_TZ;
}

/**
 * Convert a (date, HH:MM, tz) wall-clock triple to a unix epoch (seconds).
 * Two iterations of "guess then correct" handle DST boundaries — the first
 * pass computes the offset at the UTC-guess instant, the second pass refines
 * it at the corrected instant (so a wall-clock that straddles a DST jump
 * lands on the right side).
 *
 * Falls back to Europe/Paris if `tz` is invalid.
 */
export function localHHMMToEpoch(date: string, hhmm: string, tz: string): number {
  const safe = isValidTimezone(tz) ? tz : FALLBACK_TZ;
  const [y, mo, d] = date.split('-').map(Number);
  const [hh, mm] = hhmm.split(':').map(Number);
  let utcMs = Date.UTC(y, mo - 1, d, hh, mm, 0);
  for (let i = 0; i < 2; i++) {
    const offsetMs = tzOffsetAt(safe, new Date(utcMs));
    utcMs = Date.UTC(y, mo - 1, d, hh, mm, 0) - offsetMs;
  }
  return Math.floor(utcMs / 1000);
}

function tzOffsetAt(tz: string, at: Date): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  const map: Record<string, string> = {};
  for (const p of dtf.formatToParts(at)) if (p.type !== 'literal') map[p.type] = p.value;
  // en-US sometimes formats midnight as "24" — normalise to "00".
  const hour = Number(map.hour) === 24 ? 0 : Number(map.hour);
  const wallAsUtc = Date.UTC(
    Number(map.year), Number(map.month) - 1, Number(map.day),
    hour, Number(map.minute), Number(map.second)
  );
  return wallAsUtc - at.getTime();
}

export const COMMON_TIMEZONES = [
  'Europe/Paris', 'Europe/London', 'Europe/Berlin', 'Europe/Madrid', 'Europe/Lisbon',
  'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'America/Toronto',
  'America/Guadeloupe', 'America/Martinique', 'America/Cayenne', 'America/Sao_Paulo',
  'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Dubai',
  'Australia/Sydney',
  'Africa/Casablanca',
  'Indian/Reunion', 'Pacific/Tahiti', 'Pacific/Honolulu',
  'UTC'
] as const;
