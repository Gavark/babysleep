import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, formatAgeBracket } from '../src/lib/format';
import { AGE_PARAMS } from '../src/lib/age-params';

describe('formatDate', () => {
  // 2026-06-04 chosen because June 4 is unambiguous (4 < 12, both DD/MM and MM/DD render distinctly).
  const d = new Date(Date.UTC(2026, 5, 4, 12, 0, 0));

  it('renders DD/MM/YYYY for fr (fr-FR)', () => {
    expect(formatDate(d, 'fr')).toBe('04/06/2026');
  });
  it('renders DD/MM/YYYY for en (en-GB — Anglo-European default)', () => {
    expect(formatDate(d, 'en')).toBe('04/06/2026');
  });
  it('passes options through to Intl.DateTimeFormat', () => {
    const long = formatDate(d, 'fr', { day: 'numeric', month: 'long', year: 'numeric' });
    expect(long).toBe('4 juin 2026');
    const longEn = formatDate(d, 'en', { day: 'numeric', month: 'long', year: 'numeric' });
    expect(longEn).toBe('4 June 2026');
  });
});

describe('formatDateTime', () => {
  it('renders date + 24h time, locale aware', () => {
    // Local-time constructor so the host TZ doesn't shift the hour:
    // Intl.DateTimeFormat (no timeZone option) renders in host TZ, so the
    // assertion must compare against the same wall-clock instant.
    const d = new Date(2026, 5, 4, 14, 30, 0);
    expect(formatDateTime(d, 'fr')).toMatch(/04\/06\/2026.+14:30/);
    expect(formatDateTime(d, 'en')).toMatch(/04\/06\/2026.+14:30/);
  });
});

describe('formatAgeBracket', () => {
  // The bracket used to be rendered straight from AgeParams.key, which was a
  // French string, so the English UI showed "0-3 mois" next to "4 naps".
  it('renders every bracket through a message, never the raw key', () => {
    for (const p of AGE_PARAMS) {
      const rendered = formatAgeBracket(p);
      expect(rendered).not.toBe(p.key);
      expect(rendered).toContain(String(p.ageMinMonths >= 24 ? p.ageMinMonths / 12 : p.ageMinMonths));
    }
  });

  it('switches to years for the 24-36 month bracket', () => {
    const last = AGE_PARAMS[AGE_PARAMS.length - 1];
    expect(formatAgeBracket(last)).toMatch(/^2-3 /);
    expect(formatAgeBracket(last)).not.toMatch(/24|36/);
  });

  it('keeps months below two years', () => {
    expect(formatAgeBracket({ ageMinMonths: 4, ageMaxMonths: 6 })).toMatch(/^4-6 /);
  });
});
