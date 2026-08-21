import { isValidHHMM, parseHHMM, formatHHMM } from '$lib/time';

export type TimerInput = {
  wakeTime: string;
  naps: Array<{ start: string; end: string; pauseMin?: number | null }>;
  bedtime: string;
  firstAwakeWindowMin: number;   // applied when no nap has ended yet (origin = wakeTime)
  awakeWindowMin: number;        // applied between naps
};

export type TimerState =
  | { kind: 'empty' }
  | { kind: 'awake'; elapsedMin: number; remainingMin: number; nextNapAt: string; overWindow: boolean }
  | { kind: 'napping'; napIdx: number; elapsedMin: number; pauseMin: number }
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
 * Minutes since midnight of `now`, read on the wall clock of `tz`.
 *
 * Every HH:MM stored on an entry is wall-clock time in the baby's effective
 * timezone, so `now` has to be read in that same zone before the two can be
 * subtracted. Reading it in the browser's zone instead skews every elapsed
 * value by the offset between the two, which silently clamped the wake
 * window to 0 for anyone whose device was not in the baby's timezone.
 *
 * Falls back to the host's local clock when no timezone is supplied, which
 * keeps the single-timezone case (and existing callers) unchanged.
 */
function nowMinutesOfDay(now: Date, tz?: string): number {
  if (!tz) return now.getHours() * 60 + now.getMinutes();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
  const min = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
  return h * 60 + min;
}

/**
 * `tz` is the baby's effective IANA timezone. Elapsed values do NOT handle
 * midnight rollover — the timer is used during the day (06:00–22:00
 * typically), and a negative difference is clamped to 0.
 */
export function deriveTimerState(input: TimerInput, now: Date, tz?: string): TimerState {
  const nowMin = nowMinutesOfDay(now, tz);
  // 1. bedtime overrides everything else
  if (isValidHHMM(input.bedtime)) {
    return { kind: 'bedtime', bedtime: input.bedtime };
  }

  // 2. napping if a nap has a valid start without an end
  const inProgress = inProgressNapSlot(input.naps);
  if (inProgress !== null) {
    const startStr = input.naps[inProgress].start;
    const elapsed = nowMin - parseHHMM(startStr);
    return {
      kind: 'napping',
      napIdx: inProgress,
      elapsedMin: Math.max(0, elapsed),
      pauseMin: Math.max(0, input.naps[inProgress].pauseMin ?? 0)
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
  const elapsedMin = Math.max(0, nowMin - parseHHMM(originStr));
  const remainingMin = window - elapsedMin;
  const overWindow = elapsedMin > window;
  const nextNapAt = formatHHMM(parseHHMM(originStr) + window);

  return { kind: 'awake', elapsedMin, remainingMin, nextNapAt, overWindow };
}
