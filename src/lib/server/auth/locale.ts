export const SUPPORTED_LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Pick the first supported locale present in an Accept-Language header.
 *
 * - Case-insensitive (the header is lowercased before matching).
 * - Region tags (en-GB, fr-CA) match on their primary subtag (en, fr).
 * - Header order is preserved — we do NOT re-sort by q-value. Browsers
 *   already emit entries in priority order, and skipping the q-parser
 *   keeps the function tiny and the attack surface minimal.
 * - Wildcards (`*`) are treated as "unsupported" and skipped — the
 *   caller's explicit `fallback` is more meaningful than picking an
 *   arbitrary supported locale just because the client said "anything".
 * - Empty / null / undefined header → `fallback` immediately.
 * - Malformed entries (semicolon-only, empty after split) are skipped.
 */
export function parseAcceptLanguage<L extends string>(
  header: string | null | undefined,
  supported: readonly L[],
  fallback: L
): L {
  if (!header) return fallback;
  for (const raw of header.split(',')) {
    const tag = raw.split(';')[0]?.trim().toLowerCase();
    if (!tag) continue;
    const primary = tag.split('-')[0] as L;
    if (supported.includes(primary)) return primary;
  }
  return fallback;
}
