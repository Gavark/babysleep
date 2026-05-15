import { parseHHMM, formatHHMM, isValidHHMM } from './time';

export function ageInMonths(birthDateISO: string, override?: number | null, today: Date = new Date()): number {
  if (override != null) return Math.max(0, Math.floor(override));
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDateISO);
  if (!m) throw new Error(`Invalid birth date: ${birthDateISO}`);
  const by = Number(m[1]);
  const bm = Number(m[2]);
  const bd = Number(m[3]);
  const birth = new Date(Date.UTC(by, bm - 1, bd));
  const ref = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  if (birth.getTime() > ref.getTime()) throw new Error('Birth date is in the future');
  let months = (ref.getUTCFullYear() - by) * 12 + (ref.getUTCMonth() - (bm - 1));
  if (ref.getUTCDate() < bd) months -= 1;
  return Math.max(0, months);
}

export function idealBedtime(wakeHHMM: string, nightSleepHours: number): string {
  const wakeMin = parseHHMM(wakeHHMM);
  const totalMin = wakeMin - Math.round(nightSleepHours * 60);
  return formatHHMM(totalMin);
}

export function suggestNextNap(lastEndHHMM: string, awakeWindowMin: number): string {
  return formatHHMM(parseHHMM(lastEndHHMM) + awakeWindowMin);
}

export type DayEvents = {
  wake?: string | null;
  napEnds: (string | null | undefined)[];
};

export function suggestedBedtime(
  events: DayEvents,
  params: { beforeBedWindowMin: number; nightSleepH: number }
): string | null {
  const valid = events.napEnds.filter((s): s is string => !!s && /^\d{2}:\d{2}$/.test(s));
  if (valid.length === 0) {
    if (!events.wake) return null;
    return idealBedtime(events.wake, params.nightSleepH);
  }
  const candidates = events.wake ? [events.wake, ...valid] : valid;
  let bestMin = -1;
  for (const t of candidates) {
    const m = parseHHMM(t);
    if (m > bestMin) bestMin = m;
  }
  return formatHHMM(bestMin + params.beforeBedWindowMin);
}

/**
 * Pattern weights for typical nap distributions per age tier.
 * Based on standard guidance: morning short / midday long / late-day short.
 * Indexed by total nap count (1..4). Each array sums to 1.0.
 */
export const NAP_WEIGHTS: Record<number, number[]> = {
  1: [1.0],
  2: [0.40, 0.60],
  3: [0.27, 0.55, 0.18],
  4: [0.27, 0.32, 0.27, 0.14]
};

export type NapPair = { start?: string | null; end?: string | null };

/**
 * Suggest the end time of nap N given:
 * - napIndex (0-based)
 * - napStart (HH:MM)
 * - allNaps: array of all nap pairs in the day (we read those at index < napIndex for completed time)
 * - ageParams with `naps` (count) and `daySleepH` (budget in hours)
 *
 * Returns null if no useful suggestion (budget exhausted, invalid input, etc.).
 */
export function suggestNapEnd(
  napIndex: number,
  napStart: string,
  allNaps: NapPair[],
  ageParams: { naps: number; daySleepH: number }
): string | null {
  if (!isValidHHMM(napStart)) return null;
  if (napIndex < 0 || napIndex >= ageParams.naps) return null;

  // 1. Compute minutes already slept in earlier naps (both start AND end filled and valid)
  let completedMin = 0;
  for (let i = 0; i < napIndex; i++) {
    const p = allNaps[i];
    if (p?.start && p?.end && isValidHHMM(p.start) && isValidHHMM(p.end)) {
      const dur = ((parseHHMM(p.end) - parseHHMM(p.start)) % 1440 + 1440) % 1440;
      completedMin += dur;
    }
  }

  // 2. Remaining budget
  const totalBudgetMin = Math.round(ageParams.daySleepH * 60);
  const remainingMin = totalBudgetMin - completedMin;
  if (remainingMin <= 0) return null;

  // 3. Pattern weights: fallback to uniform if count is unusual
  const weights = NAP_WEIGHTS[ageParams.naps] ?? Array(ageParams.naps).fill(1 / ageParams.naps);
  if (napIndex >= weights.length) return null;

  const remainingWeight = weights.slice(napIndex).reduce((s, w) => s + w, 0);
  const myWeight = weights[napIndex];
  if (remainingWeight <= 0 || myWeight <= 0) return null;

  // 4. Suggested duration with caps (10 min ≤ dur ≤ 180 min for safety)
  let suggestedMin = Math.round(remainingMin * (myWeight / remainingWeight));
  suggestedMin = Math.max(10, Math.min(180, suggestedMin));

  return formatHHMM(parseHHMM(napStart) + suggestedMin);
}
