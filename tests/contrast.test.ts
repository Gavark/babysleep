import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

/**
 * WCAG 2.x contrast guard for the design tokens.
 *
 * The accent (--c-primary) was used as link text and measured 3.09:1 on the
 * light app background, below the 4.5:1 required for body copy. These tests
 * read the real values out of tokens.css so the thresholds cannot drift away
 * from what ships.
 */

const CSS = readFileSync('src/lib/styles/tokens.css', 'utf8');

/** Slice out one theme block so light and dark values don't get mixed up. */
function block(theme: 'light' | 'dark'): string {
  if (theme === 'light') return CSS.slice(CSS.indexOf(':root {'), CSS.indexOf('@media'));
  return CSS.slice(CSS.indexOf(':root[data-theme="dark"]'));
}

function token(theme: 'light' | 'dark', name: string): string {
  for (const line of block(theme).split('\n')) {
    const [key, value] = line.split(':');
    if (key?.trim() === `--${name}`) {
      const hex = value?.trim().replace(/;.*$/, '');
      if (hex?.startsWith('#')) return hex.toUpperCase();
    }
  }
  throw new Error(`token --${name} not found in ${theme} block`);
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

function contrast(fg: string, bg: string): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

/** WCAG AA: 4.5:1 for body text, 3:1 for large text and UI components. */
const AA_BODY = 4.5;
const AA_LARGE = 3;

// [description, foreground token, background tokens, threshold]
const CASES: Array<[string, string, string[], number]> = [
  // Links, tab labels and nav pills all render at body size.
  ['link text', 'c-link', ['c-bg-app', 'c-bg-card', 'c-bg-muted'], AA_BODY],
  ['link hover', 'c-link-hover', ['c-bg-app', 'c-bg-card', 'c-bg-muted'], AA_BODY],
  // .key-box .key-value is 22px bold, which counts as large text.
  ['key value', 'c-link', ['c-bg-soft'], AA_LARGE],
  // No terracotta dark enough for 4.5:1 on the tinted surfaces still reads as
  // the brand accent, so those fall back to the text colour.
  ['strong on soft', 'c-text', ['c-bg-soft'], AA_BODY],
  [
    'calendar day total',
    'c-text',
    ['c-cal-heat-good', 'c-cal-heat-ok', 'c-cal-heat-meh', 'c-cal-heat-bad', 'c-cal-heat-none'],
    AA_BODY
  ],
  // Muted secondary copy.
  ['muted text', 'c-text-muted', ['c-bg-app', 'c-bg-card'], AA_BODY],
  // Primary is a button fill and a border, never body text.
  ['primary as UI component', 'c-primary', ['c-bg-app', 'c-bg-card'], AA_LARGE]
];

describe.each(['light', 'dark'] as const)('token contrast (%s)', (theme) => {
  for (const [label, fg, backgrounds, threshold] of CASES) {
    for (const bg of backgrounds) {
      it(`${label}: --${fg} on --${bg} meets ${threshold}:1`, () => {
        const ratio = contrast(token(theme, fg), token(theme, bg));
        expect(
          ratio,
          `--${fg} (${token(theme, fg)}) on --${bg} (${token(theme, bg)}) = ${ratio.toFixed(2)}:1`
        ).toBeGreaterThanOrEqual(threshold);
      });
    }
  }
});

describe('regression guard', () => {
  it('keeps link text distinct from the button fill in light mode', () => {
    // If someone "simplifies" --c-link back to --c-primary, the link contrast
    // silently drops to 3.09:1. Fail loudly instead.
    expect(token('light', 'c-link')).not.toBe(token('light', 'c-primary'));
  });

  // Known gap, deliberately out of scope for the link fix: filled controls
  // (.btn-primary, .tab.active, .nav-pill.active, .badge-*) put `color: white`
  // on an accent background. At 15px/600 those labels are body text and need
  // 4.5:1; they measure 3.27:1 in light mode and 2.29:1 in dark, where the
  // accent lightens to #E89876. Fixing it means either darkening the fills or
  // switching the labels to dark ink, which changes how every button in the
  // app looks. That is a design call, not a token tweak.
  it.todo('filled controls: white labels should meet AA on the accent fill');
});
