import { isValidHHMM, parseHHMM, formatHHMM } from '$lib/time';

export type TimerInput = {
  wakeTime: string;
  naps: Array<{ start: string; end: string }>;
  bedtime: string;
  awakeWindowMin: number;
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
