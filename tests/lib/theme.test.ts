import { describe, it, expect } from 'vitest';
import { themeFromAttr } from '../../src/lib/theme';

describe('themeFromAttr', () => {
  it('reads an explicit light or dark attribute', () => {
    expect(themeFromAttr('light')).toBe('light');
    expect(themeFromAttr('dark')).toBe('dark');
  });
  it.each([null, undefined, '', 'auto', 'DARK', 'sepia'])('treats %s as auto', (raw) => {
    expect(themeFromAttr(raw)).toBe('auto');
  });
});
