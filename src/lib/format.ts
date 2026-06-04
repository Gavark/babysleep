import type { Locale } from './server/auth/locale';

/**
 * Both locales render dates as DD/MM/YYYY by default:
 *   - fr → 'fr-FR'
 *   - en → 'en-GB' (matches our Anglo-European target audience)
 * Switching to en-US (MM/DD/YYYY) would be an opt-in per-user setting,
 * not introduced here.
 */
function tagFor(locale: Locale): string {
  return locale === 'fr' ? 'fr-FR' : 'en-GB';
}

export function formatDate(
  d: Date | number,
  locale: Locale,
  opts?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(tagFor(locale), opts).format(d);
}

export function formatDateTime(
  d: Date | number,
  locale: Locale,
  opts?: Intl.DateTimeFormatOptions
): string {
  const merged: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...opts
  };
  return new Intl.DateTimeFormat(tagFor(locale), merged).format(d);
}

export function formatNumber(n: number, locale: Locale, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(tagFor(locale), opts).format(n);
}
