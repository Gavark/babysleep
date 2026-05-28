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
  wake: string;
  naps: NapPair[];
};

export type BedtimeParams = {
  naps: number;             // expected nap count for the age (1..4)
  awakeWindowMin: number;
  beforeBedWindowMin: number;
  nightSleepH: number;
  daySleepH: number;
};

/**
 * Suggest the night bedtime by combining two models:
 *  - idealBedtime(wake, nightSleepH): "11h before next wake" floor
 *  - projectDayBedtime: simulate the whole day forward (uses actual naps
 *    where known, projects the rest via NAP_WEIGHTS + awakeWindowMin),
 *    then bedtime = last (real or projected) nap end + beforeBedWindowMin
 * Returns the LATER of the two — projections that come out earlier than
 * the night anchor are ignored, projections that push the day later win.
 */
export function suggestedBedtime(events: DayEvents, params: BedtimeParams): string | null {
  if (!isValidHHMM(events.wake)) return null;

  const idealStr = idealBedtime(events.wake, params.nightSleepH);
  const projectedStr = projectDayBedtime(events, params);

  if (!projectedStr) return idealStr;

  const idealMin = parseHHMM(idealStr);
  const projectedMin = parseHHMM(projectedStr);
  return projectedMin > idealMin ? projectedStr : idealStr;
}

function projectDayBedtime(events: DayEvents, params: BedtimeParams): string | null {
  const expectedCount = params.naps;
  if (expectedCount <= 0) return null;

  const weights = NAP_WEIGHTS[expectedCount] ?? Array(expectedCount).fill(1 / expectedCount);
  const daySleepBudget = Math.round(params.daySleepH * 60);

  let lastEvent = events.wake;
  let lastNapEnd: string | null = null;
  let cumulativeNapMin = 0;

  function sumWeights(from: number): number {
    let s = 0;
    for (let i = from; i < weights.length; i++) s += weights[i];
    return s;
  }
  function clamp(v: number, lo: number, hi: number): number {
    return Math.max(lo, Math.min(hi, v));
  }
  function projectDuration(napIdx: number): number {
    const remaining = Math.max(0, daySleepBudget - cumulativeNapMin);
    const remainingWeight = sumWeights(napIdx);
    if (remainingWeight <= 0) return 10;
    return clamp(Math.round(remaining * weights[napIdx] / remainingWeight), 10, 180);
  }

  for (let i = 0; i < expectedCount; i++) {
    const pair = events.naps[i];
    if (pair?.start && pair?.end && isValidHHMM(pair.start) && isValidHHMM(pair.end)) {
      const dur = parseHHMM(pair.end) - parseHHMM(pair.start);
      if (dur > 0) {
        cumulativeNapMin += dur;
        lastNapEnd = pair.end;
        lastEvent = pair.end;
      }
    } else if (pair?.start && isValidHHMM(pair.start)) {
      const myDur = projectDuration(i);
      const endMin = parseHHMM(pair.start) + myDur;
      lastNapEnd = formatHHMM(endMin);
      lastEvent = lastNapEnd;
      cumulativeNapMin += myDur;
    } else {
      const startMin = parseHHMM(lastEvent) + params.awakeWindowMin;
      const myDur = projectDuration(i);
      const endMin = startMin + myDur;
      lastNapEnd = formatHHMM(endMin);
      lastEvent = lastNapEnd;
      cumulativeNapMin += myDur;
    }
  }

  // Account for extra actual naps beyond the expected count.
  for (let i = expectedCount; i < events.naps.length; i++) {
    const end = events.naps[i]?.end;
    if (end && isValidHHMM(end)) {
      if (lastNapEnd === null || parseHHMM(end) > parseHHMM(lastNapEnd)) {
        lastNapEnd = end;
      }
    }
  }

  if (lastNapEnd === null) return null;
  return formatHHMM(parseHHMM(lastNapEnd) + params.beforeBedWindowMin);
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

export type DaySleepBudget = {
  totalMin: number;       // recommended budget
  completedMin: number;   // sum of valid start/end pairs
  remainingMin: number;   // max(0, total - completed)
  ratio: number;          // 0..1 (or >1 if over budget)
};

export function computeDaySleepBudget(
  naps: NapPair[],
  ageParams: { daySleepH: number }
): DaySleepBudget {
  const totalMin = Math.round(ageParams.daySleepH * 60);
  let completedMin = 0;
  for (const n of naps) {
    if (n.start && n.end && isValidHHMM(n.start) && isValidHHMM(n.end)) {
      completedMin += ((parseHHMM(n.end) - parseHHMM(n.start)) % 1440 + 1440) % 1440;
    }
  }
  const remainingMin = Math.max(0, totalMin - completedMin);
  const ratio = totalMin > 0 ? completedMin / totalMin : 0;
  return { totalMin, completedMin, remainingMin, ratio };
}

/** Formats minutes as "Xh YY min" or "YY min" if < 60. */
export function formatDuration(min: number): string {
  if (min <= 0) return '0 min';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, '0')}`;
}
