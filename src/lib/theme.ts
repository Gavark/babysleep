export type ThemeValue = 'auto' | 'light' | 'dark';

/**
 * The theme carried by <html data-theme>: the attribute is the single source
 * of truth on the client (absent = auto), so every toggle on the page reads
 * the same value however many of them are mounted.
 */
export function themeFromAttr(raw: string | null | undefined): ThemeValue {
  return raw === 'light' || raw === 'dark' ? raw : 'auto';
}
