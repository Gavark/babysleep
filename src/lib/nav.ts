export type NavTab = 'today' | 'history' | 'calendar' | 'stats';

const TAB_PATH = /^\/app\/babies\/\d+\/(today|history|calendar|stats)\/?$/;

/** The bottom-bar tab a path belongs to; null for pages outside the bar. */
export function activeNavTab(pathname: string): NavTab | null {
  return (TAB_PATH.exec(pathname)?.[1] as NavTab | undefined) ?? null;
}
