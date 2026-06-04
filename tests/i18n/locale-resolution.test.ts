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
  it('treats wildcard "*" as unsupported and falls back', () => {
    // RFC 9110 §12.5.4 says `*` means "any language acceptable", but we
    // prefer the caller's explicit fallback over picking a supported one
    // arbitrarily — pinned here so the choice is intentional and stable.
    expect(parseAcceptLanguage('*', SUPPORTED, 'fr')).toBe('fr');
    expect(parseAcceptLanguage('de,*;q=0.5', SUPPORTED, 'fr')).toBe('fr');
    expect(parseAcceptLanguage('*,en', SUPPORTED, 'fr')).toBe('en');
  });
  it('skips semicolon-only entries without crashing', () => {
    expect(parseAcceptLanguage(';q=0.9,en', SUPPORTED, 'fr')).toBe('en');
  });
});

import { resolveLocale } from '../../src/lib/server/auth/locale';

type Input = {
  urlLang?: string | null;
  cookie?: string | null;
  userLocale?: string | null;
  acceptLanguage?: string | null;
};

function r(input: Input) {
  return resolveLocale({
    urlLang: input.urlLang ?? null,
    cookieLocale: input.cookie ?? null,
    userLocale: input.userLocale ?? null,
    acceptLanguage: input.acceptLanguage ?? null
  });
}

describe('resolveLocale fallback chain', () => {
  it('URL ?lang wins over everything', () => {
    expect(r({ urlLang: 'en', cookie: 'fr', userLocale: 'fr', acceptLanguage: 'fr' })).toBe('en');
  });
  it('user.locale wins over cookie when both differ', () => {
    expect(r({ cookie: 'fr', userLocale: 'en' })).toBe('en');
  });
  it('cookie used when user.locale is null', () => {
    expect(r({ cookie: 'en', userLocale: null })).toBe('en');
  });
  it('Accept-Language used when no cookie and no user.locale', () => {
    expect(r({ acceptLanguage: 'en-US,en;q=0.9,fr;q=0.7' })).toBe('en');
  });
  it('fr fallback when nothing matches', () => {
    expect(r({ acceptLanguage: 'de-DE' })).toBe('fr');
    expect(r({})).toBe('fr');
  });
  it('ignores unsupported values in any layer', () => {
    expect(r({ urlLang: 'zh', cookie: 'fr' })).toBe('fr');
    expect(r({ userLocale: 'pt-BR', cookie: 'en' })).toBe('en');
  });
});
