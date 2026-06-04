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

export type ResolveInput = {
  urlLang: string | null;
  cookieLocale: string | null;
  userLocale: string | null;
  acceptLanguage: string | null;
};

function asSupported(v: string | null | undefined): Locale | null {
  if (!v) return null;
  return (SUPPORTED_LOCALES as readonly string[]).includes(v) ? (v as Locale) : null;
}

/**
 * 5-step fallback chain — first match wins:
 *   1. ?lang= URL param (one-shot override, useful for sharing/testing)
 *   2. users.locale (authoritative when logged in)
 *   3. `locale` cookie (set by the switcher)
 *   4. Accept-Language header
 *   5. 'fr' fallback
 *
 * Order rationale: user.locale comes BEFORE cookie so a logged-in
 * user's server-side preference can't be silently overridden by a
 * stale cookie from another browser or session. The caller is
 * responsible for re-setting the cookie when the resolved locale
 * doesn't match what's already there.
 */
export function resolveLocale(input: ResolveInput): Locale {
  return (
    asSupported(input.urlLang) ??
    asSupported(input.userLocale) ??
    asSupported(input.cookieLocale) ??
    parseAcceptLanguage(input.acceptLanguage, SUPPORTED_LOCALES, 'fr')
  );
}
