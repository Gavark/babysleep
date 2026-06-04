export type Locale = 'fr' | 'en';
export const SUPPORTED_LOCALES = ['fr', 'en'] as const satisfies readonly Locale[];

/**
 * Pick the first supported locale present in an Accept-Language header.
 * Region tags (en-GB, fr-CA) match on their primary subtag.
 * Header order is preserved — we do NOT re-sort by q-value (browsers
 * already emit entries in priority order). Malformed entries are skipped.
 */
export function parseAcceptLanguage<L extends string>(
  header: string | null | undefined,
  supported: readonly L[],
  fallback: L
): L {
  if (!header) return fallback;
  const entries = header.split(',');
  for (const raw of entries) {
    const tag = raw.split(';')[0]?.trim().toLowerCase();
    if (!tag) continue;
    const primary = tag.split('-')[0];
    const match = supported.find((s) => s === primary);
    if (match) return match;
  }
  return fallback;
}
