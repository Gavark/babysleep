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
