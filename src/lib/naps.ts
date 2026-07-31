import { parseHHMM } from '$lib/time';

/**
 * A stored sleep entry, as returned by the DB layer. Only the nap columns are
 * read here, and they are read by name (`nap1Start` … `nap8PauseMin`), so this
 * stays a loose record rather than coupling to the Drizzle row type.
 */
export type NapEntry = Record<string, unknown>;

export type RankStat = { rank: number; avgMin: number; days: number };

const HHMM = /^\d{2}:\d{2}$/;
const SLOTS = 8;

type Nap = { startMin: number; durationMin: number };

/**
 * Naps live in eight POSITIONAL slots; nothing guarantees slot N holds the
 * Nth nap of the day. Sorting by start time is what makes "nap 2" mean the
 * same thing across days. Naps are daytime events, so no midnight wrap.
 */
function collectNaps(e: NapEntry): Nap[] {
  const naps: Nap[] = [];
  for (let i = 1; i <= SLOTS; i++) {
    const start = e[`nap${i}Start`];
    const end = e[`nap${i}End`];
    if (typeof start !== 'string' || typeof end !== 'string') continue;
    if (!HHMM.test(start) || !HHMM.test(end)) continue;
    const rawPause = e[`nap${i}PauseMin`];
    const pause = typeof rawPause === 'number' && Number.isFinite(rawPause) ? rawPause : 0;
    const span = (((parseHHMM(end) - parseHHMM(start)) % 1440) + 1440) % 1440;
    naps.push({ startMin: parseHHMM(start), durationMin: Math.max(0, span - pause) });
  }
  return naps.sort((a, b) => a.startMin - b.startMin);
}

/** Net nap durations for one day, ordered first-nap-first. */
export function napDurationsByRank(e: NapEntry): number[] {
  return collectNaps(e).map((n) => n.durationMin);
}

/** Total daytime sleep in minutes, or null if nothing was recorded. */
export function dayNapMinutes(e: NapEntry): number | null {
  const naps = collectNaps(e);
  if (naps.length === 0) return null;
  return naps.reduce((sum, n) => sum + n.durationMin, 0);
}

/**
 * Counts recorded END times. Intentionally looser than collectNaps(): a nap
 * with an end but no start is still a nap that happened. Kept identical to the
 * previous inline implementation so the existing chart's values do not move.
 */
export function napCount(e: NapEntry): number {
  let n = 0;
  for (let i = 1; i <= SLOTS; i++) if (e[`nap${i}End`]) n++;
  return n;
}

/** Highest number of naps recorded on any single day of the period. */
export function maxNapRank(entries: NapEntry[]): number {
  return entries.reduce((max, e) => Math.max(max, napDurationsByRank(e).length), 0);
}

/**
 * Mean duration per rank, with the number of days each rank actually occurred.
 * The day count is what keeps the chart honest when the period spans a change
 * of rhythm — a rank averaged over 4 days is not a peer of one averaged over 90.
 */
export function aggregateByRank(entries: NapEntry[]): RankStat[] {
  const sums: number[] = [];
  const days: number[] = [];
  for (const e of entries) {
    napDurationsByRank(e).forEach((d, i) => {
      sums[i] = (sums[i] ?? 0) + d;
      days[i] = (days[i] ?? 0) + 1;
    });
  }
  return days.map((count, i) => ({ rank: i + 1, avgMin: sums[i] / count, days: count }));
}

/**
 * One value per entry for a given 1-based rank. A day without that rank is
 * null, never 0 — an absent nap is missing data, not a zero-minute nap.
 */
export function napSeriesByRank(entries: NapEntry[], rank: number): (number | null)[] {
  return entries.map((e) => napDurationsByRank(e)[rank - 1] ?? null);
}
