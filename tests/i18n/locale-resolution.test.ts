import { describe, it, expect } from 'vitest';
import { parseAcceptLanguage } from '../../src/lib/server/auth/locale';

const SUPPORTED = ['fr', 'en'] as const;

describe('parseAcceptLanguage', () => {
  it('returns the first supported tag in header order', () => {
    expect(parseAcceptLanguage('en-US,en;q=0.9,fr;q=0.8', SUPPORTED, 'fr')).toBe('en');
    expect(parseAcceptLanguage('fr-FR,fr;q=0.9,en;q=0.7', SUPPORTED, 'fr')).toBe('fr');
  });
  it('matches the primary subtag for regional variants', () => {
    expect(parseAcceptLanguage('en-GB', SUPPORTED, 'fr')).toBe('en');
    expect(parseAcceptLanguage('fr-CA', SUPPORTED, 'fr')).toBe('fr');
  });
  it('ignores unsupported tags and continues looking', () => {
    expect(parseAcceptLanguage('de-DE,it;q=0.9,en;q=0.5', SUPPORTED, 'fr')).toBe('en');
  });
  it('falls back when no supported tag is present', () => {
    expect(parseAcceptLanguage('de-DE,it;q=0.9', SUPPORTED, 'fr')).toBe('fr');
    expect(parseAcceptLanguage('', SUPPORTED, 'fr')).toBe('fr');
    expect(parseAcceptLanguage(null, SUPPORTED, 'fr')).toBe('fr');
  });
  it('tolerates malformed q-values and extra whitespace', () => {
    expect(parseAcceptLanguage(' en ; q=abc , fr ', SUPPORTED, 'fr')).toBe('en');
  });
});
