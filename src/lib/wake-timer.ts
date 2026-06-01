import { isValidHHMM, parseHHMM, formatHHMM } from '$lib/time';

export type TimerInput = {
  wakeTime: string;
  naps: Array<{ start: string; end: string }>;
  bedtime: string;
  firstAwakeWindowMin: number;   // applied when no nap has ended yet (origin = wakeTime)
  awakeWindowMin: number;        // applied between naps
};

export type TimerState =
  | { kind: 'empty' }
  | { kind: 'awake'; elapsedMin: number; remainingMin: number; nextNapAt: string; overWindow: boolean }
  | { kind: 'napping'; napIdx: number; elapsedMin: number }
  | { kind: 'bedtime'; bedtime: string };

/** Returns 0..3 for the first empty slot (start is ''), or null if all 4 are filled. */
export function nextEmptyNapSlot(naps: TimerInput['naps']): number | null {
  for (let i = 0; i < naps.length; i++) {
    if (!naps[i].start) return i;
  }
  return null;
}

/** Returns 0..3 for the first slot with start filled but end empty, or null. */
export function inProgressNapSlot(naps: TimerInput['naps']): number | null {
  for (let i = 0; i < naps.length; i++) {
    if (isValidHHMM(naps[i].start) && !naps[i].end) return i;
  }
  return null;
}

/**
 * Convert a HH:MM string into a Date on the same calendar day as `now`,
 * with local hours/minutes set. Used for computing elapsed minutes against
 * `now`. Does NOT handle midnight rollover — the timer is used during the
 * day (06:00–22:00 typically).
 */
function hhmmOnSameDay(hhmm: string, now: Date): Date {
  const m = parseHHMM(hhmm); // minutes since midnight
  const d = new Date(now);
  d.setHours(Math.floor(m / 60), m % 60, 0, 0);
  return d;
}

function minutesBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / 60_000);
}

export function deriveTimerState(input: TimerInput, now: Date): TimerState {
  // 1. bedtime overrides everything else
  if (isValidHHMM(input.bedtime)) {
    return { kind: 'bedtime', bedtime: input.bedtime };
  }

  // 2. napping if a nap has a valid start without an end
  const inProgress = inProgressNapSlot(input.naps);
  if (inProgress !== null) {
    const startStr = input.naps[inProgress].start;
    const elapsed = minutesBetween(hhmmOnSameDay(startStr, now), now);
    return {
      kind: 'napping',
      napIdx: inProgress,
      elapsedMin: Math.max(0, elapsed)
    };
  }

  // 3. awake if wakeTime is valid
  if (!isValidHHMM(input.wakeTime)) {
    return { kind: 'empty' };
  }

  // origin = latest of wakeTime and all valid napEnd values
  const candidates: string[] = [input.wakeTime];
  let hasAnyNapEnd = false;
  for (const nap of input.naps) {
    if (isValidHHMM(nap.end)) {
      candidates.push(nap.end);
      hasAnyNapEnd = true;
    }
  }
  const originStr = candidates.reduce((acc, cur) => (parseHHMM(cur) > parseHHMM(acc) ? cur : acc));
  // When no nap has finished yet, origin is the morning wake — the next nap is
  // the FIRST nap of the day, which uses the (typically shorter) first window.
  const window = hasAnyNapEnd ? input.awakeWindowMin : input.firstAwakeWindowMin;
  const origin = hhmmOnSameDay(originStr, now);
  const elapsedMin = Math.max(0, minutesBetween(origin, now));
  const remainingMin = window - elapsedMin;
  const overWindow = elapsedMin > window;
  const nextNapAt = formatHHMM(parseHHMM(originStr) + window);

  return { kind: 'awake', elapsedMin, remainingMin, nextNapAt, overWindow };
}
