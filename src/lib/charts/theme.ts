/**
 * The single place that reads design tokens for charts and reacts to theme
 * changes. Everything here is DOM-bound and therefore untested (vitest runs
 * with environment 'node'); the pure part, withAlpha, is covered.
 */

export type ChartTheme = {
  text: string;
  textMuted: string;
  grid: string;
  tooltipBg: string;
  series: { wake: string; bedtime: string; night: string; nap: string };
  napRanks: string[];
};

/** 0.18 → '2e'. Returns the input untouched if it is not a 6-digit hex. */
export function withAlpha(hex: string, alpha: number): string {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}

const NAP_RANKS = 8;

function token(styles: CSSStyleDeclaration, name: string): string {
  return styles.getPropertyValue(name).trim();
}

export function readChartTheme(): ChartTheme {
  const s = getComputedStyle(document.documentElement);
  return {
    text: token(s, '--c-text'),
    textMuted: token(s, '--c-text-muted'),
    grid: token(s, '--c-border'),
    tooltipBg: token(s, '--c-bg-card'),
    series: {
      wake: token(s, '--c-primary'),
      bedtime: token(s, '--c-danger'),
      night: token(s, '--c-accent-sage'),
      nap: token(s, '--c-accent-honey')
    },
    napRanks: Array.from({ length: NAP_RANKS }, (_, i) => token(s, `--c-nap-${i + 1}`))
  };
}

/**
 * Fires whenever the effective theme changes, via either route:
 *  - ThemeToggle setting/removing data-theme on <html> (explicit light/dark)
 *  - the OS flipping while the toggle sits on 'auto'
 *
 * One observer and one media listener are shared across all subscribers and
 * torn down when the last one leaves.
 */
type Listener = () => void;
const listeners = new Set<Listener>();
let observer: MutationObserver | null = null;
let media: MediaQueryList | null = null;

const fanOut = () => listeners.forEach((cb) => cb());

export function onChartThemeChange(cb: Listener): () => void {
  listeners.add(cb);
  if (listeners.size === 1) {
    observer = new MutationObserver(fanOut);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', fanOut);
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) {
      observer?.disconnect();
      observer = null;
      media?.removeEventListener('change', fanOut);
      media = null;
    }
  };
}
