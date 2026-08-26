import type { Locale } from './server/auth/locale';
import type { AgeParams } from './age-params';
import * as m from '$paraglide/messages';

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

/**
 * Render an age bracket in the active locale.
 *
 * AgeParams.key is an identity, not a label. It used to be a French string
 * ('0-3 mois') that got rendered directly, so the English UI showed French
 * brackets next to translated nap counts.
 */
export function formatAgeBracket(p: Pick<AgeParams, 'ageMinMonths' | 'ageMaxMonths'>): string {
  // Only the last bracket spans whole years; below that, months read better.
  if (p.ageMinMonths >= 24 && p.ageMinMonths % 12 === 0 && p.ageMaxMonths % 12 === 0) {
    return m.age_bracket_years({ from: p.ageMinMonths / 12, to: p.ageMaxMonths / 12 });
  }
  return m.age_bracket_months({ from: p.ageMinMonths, to: p.ageMaxMonths });
}
