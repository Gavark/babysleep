/**
 * Phone navigation trial: 'bottom' (compact header + bottom tab bar, the
 * default) or 'classic' (the original stacked rows). Stored per device in the
 * `nav` cookie and mirrored as `data-nav="classic"` on <html>.
 */
export type NavMode = 'bottom' | 'classic';

export function parseNavMode(raw: string | null | undefined): NavMode {
  return raw === 'classic' ? 'classic' : 'bottom';
}

export type NavTab = 'today' | 'history' | 'calendar' | 'stats';

const TAB_PATH = /^\/app\/babies\/\d+\/(today|history|calendar|stats)\/?$/;

/** The bottom-bar tab a path belongs to; null for pages outside the bar. */
export function activeNavTab(pathname: string): NavTab | null {
  return (TAB_PATH.exec(pathname)?.[1] as NavTab | undefined) ?? null;
}
