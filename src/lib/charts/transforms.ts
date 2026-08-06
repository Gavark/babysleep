/**
 * Pure chart maths. No DOM, no Chart.js — vitest runs with environment 'node'
 * and jsdom is not installed, so everything here must stay computable.
 */

/**
 * Maps a time-of-day (fractional hours) onto a night-continuous axis: values
 * before noon are pushed past 24, so 00:30 becomes 24.5 and plots ABOVE 23:30
 * instead of collapsing to the bottom of the axis.
 *
 * Only meaningful for bedtimes. The wake-time chart, whose values are all in
 * the morning, must not use this.
 */
export function toNightHours(h: number): number {
  return h < 12 ? h + 24 : h;
}

const finiteOnly = (values: (number | null)[]): number[] =>
  values.filter((v): v is number => typeof v === 'number' && Number.isFinite(v));

/**
 * Axis bounds fitted to the data: padded by 30 min and rounded outward to whole
 * hours, with a minimum 2-hour span so a flat series still gets a readable
 * plot area. Falls back to a full day when there is nothing to fit.
 */
export function axisRange(values: (number | null)[]): { min: number; max: number } {
  const finite = finiteOnly(values);
  if (finite.length === 0) return { min: 0, max: 24 };
  let min = Math.floor(Math.min(...finite) - 0.5);
  let max = Math.ceil(Math.max(...finite) + 0.5);
  if (max - min < 2) {
    min -= 1;
    max += 1;
  }
  return { min, max };
}

export function tickStep(min: number, max: number): number {
  return max - min <= 6 ? 1 : 2;
}

/**
 * Centred rolling mean. Nulls are SKIPPED, never counted as zero — a day with
 * no third nap is missing data, and averaging it as 0 would turn a gap in
 * data entry into an apparent sleep regression.
 *
 * A window with fewer than `minSamples` present values yields null, so the
 * line shows a gap rather than a mean invented from one point.
 */
export function rollingMean(
  values: (number | null)[],
  window: number,
  minSamples: number
): (number | null)[] {
  const half = Math.floor(window / 2);
  return values.map((_, i) => {
    let sum = 0;
    let n = 0;
    for (let j = Math.max(0, i - half); j <= Math.min(values.length - 1, i + half); j++) {
      const v = values[j];
      if (typeof v !== 'number' || !Number.isFinite(v)) continue;
      sum += v;
      n++;
    }
    return n >= minSamples ? sum / n : null;
  });
}

export function seriesStats(
  values: (number | null)[]
): { min: number; max: number; avg: number } | null {
  const finite = finiteOnly(values);
  if (finite.length === 0) return null;
  const sum = finite.reduce((a, b) => a + b, 0);
  return { min: Math.min(...finite), max: Math.max(...finite), avg: sum / finite.length };
}

/**
 * Date formatting anchored to UTC on both sides (Date.UTC + timeZone: 'UTC').
 * Building the Date with local-time components would shift the rendered day
 * depending on the process timezone.
 */
function utcDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function formatDayMonth(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC'
  }).format(utcDate(iso));
}

export function formatFullDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(utcDate(iso));
}

/** 'YYYY-MM' → 'août 2026' / 'Aug 2026', UTC-anchored like every date here. */
export function formatMonth(monthKey: string, locale: string): string {
  const [y, m] = monthKey.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(y, m - 1, 1)));
}
