/**
 * The single place that reads design tokens for charts and reacts to theme
 * changes. Everything here is DOM-bound and therefore untested (vitest runs
 * with environment 'node'); the pure part, withAlpha, is covered.
 */

export type ChartTheme = {
  text: string;
  textMuted: string;
  grid: string;
  /**
   * null when `--c-bg-card` does not resolve. Consumers must then leave the
   * tooltip entirely to Chart.js rather than theme it half-way: a themed text
   * colour over an unthemed background (or the reverse) can render the tooltip
   * unreadable, whereas Chart.js's own defaults are at least consistent with
   * each other.
   */
  tooltipBg: string | null;
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

// A missing/renamed custom property makes getPropertyValue return '', and
// withAlpha('') passes that straight through — Chart.js then falls back to
// its own default (black) for the stroke. `fallback` gives every call site
// an explicit, already-resolved token to use instead, so no lookup can ever
// bottom out at an empty string.
function token(styles: CSSStyleDeclaration, name: string, fallback: string): string {
  const value = styles.getPropertyValue(name).trim();
  return value === '' ? fallback : value;
}

/**
 * For colours that have no safe substitute. Returns null rather than guessing,
 * leaving the caller to skip that piece of theming altogether.
 */
function optionalToken(styles: CSSStyleDeclaration, name: string): string | null {
  const value = styles.getPropertyValue(name).trim();
  return value === '' ? null : value;
}

export function readChartTheme(): ChartTheme {
  const s = getComputedStyle(document.documentElement);
  // getComputedStyle(...).color is the browser's already-resolved computed
  // text color (the CSS `color` property, not a custom property) — CSS
  // guarantees it is never an empty string, so it anchors the fallback
  // chain below without introducing a colour literal of our own.
  const text = token(s, '--c-text', s.color);
  const textMuted = token(s, '--c-text-muted', text);
  const grid = token(s, '--c-border', textMuted);
  // Deliberately NOT falling back to a text-role colour: that would paint the
  // tooltip's background the same colour as its own text.
  const tooltipBg = optionalToken(s, '--c-bg-card');
  const wake = token(s, '--c-primary', text);
  const bedtime = token(s, '--c-danger', wake);
  const night = token(s, '--c-accent-sage', wake);
  const nap = token(s, '--c-accent-honey', wake);
  return {
    text,
    textMuted,
    grid,
    tooltipBg,
    series: { wake, bedtime, night, nap },
    napRanks: Array.from({ length: NAP_RANKS }, (_, i) => token(s, `--c-nap-${i + 1}`, wake))
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
