import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime } from '../src/lib/format';

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
