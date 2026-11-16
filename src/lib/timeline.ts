/**
 * Pure model of the Today page timeline: ordered rows (wake, naps, bedtime)
 * with their state and suggestions, and where the "now" card goes.
 */
import type { AgeParams } from './age-params';
import { napPairs, type DayFields } from './day-form';
import { idealBedtime, suggestedBedtime, suggestNapEnd, suggestNextNap } from './sleep-calc';
import { isValidHHMM, parseHHMM } from './time';

export type TimelineRow =
  | { kind: 'wake'; state: 'done' | 'upcoming'; time: string }
  | {
      kind: 'nap';
      n: number;
      state: 'done' | 'progress' | 'upcoming';
      start: string;
      end: string;
      pauseMin: number;
      durationMin: number | null;
      suggestedStart: string;
      suggestedEnd: string;
    }
  | { kind: 'bedtime'; state: 'done' | 'upcoming'; time: string; suggested: string; ideal: string };

/** `nowAfter` is the index of the row the "now" card sits under; -1 = at the top. */
export type Timeline = { rows: TimelineRow[]; nowAfter: number };

const DAY_MIN = 24 * 60;

function napDuration(start: string, end: string, pauseMin: number): number {
  const span = (((parseHHMM(end) - parseHHMM(start)) % DAY_MIN) + DAY_MIN) % DAY_MIN;
  return Math.max(0, span - pauseMin);
}

export function buildTimeline(input: {
  fields: DayFields;
  napCount: number;
  ageParams: AgeParams;
  desiredWakeTime: string | null;
}): Timeline {
  const { fields, napCount, ageParams, desiredWakeTime } = input;
  const wake = fields.wake_time ?? '';
  const wakeValid = isValidHHMM(wake);
  const pairs = napPairs(fields);

  const rows: TimelineRow[] = [{ kind: 'wake', state: wakeValid ? 'done' : 'upcoming', time: wake }];

  for (let i = 0; i < napCount; i++) {
    const { start, end, pauseMin } = pairs[i];
    const startValid = isValidHHMM(start);
    const endValid = isValidHHMM(end);
    const state = startValid && endValid ? 'done' : startValid ? 'progress' : 'upcoming';

    const origin = i === 0 ? wake : pairs[i - 1].end;
    const window = i === 0 ? ageParams.firstAwakeWindowMin : ageParams.awakeWindowMin;

    rows.push({
      kind: 'nap',
      n: i + 1,
      state,
      start,
      end,
      pauseMin,
      durationMin: state === 'done' ? napDuration(start, end, pauseMin) : null,
      suggestedStart: isValidHHMM(origin) ? suggestNextNap(origin, window) : '',
      suggestedEnd: suggestNapEnd(i, start, pairs, ageParams) ?? ''
    });
  }

  const bedtime = fields.bedtime ?? '';
  const bedtimeValid = isValidHHMM(bedtime);
  const desiredValid = desiredWakeTime !== null && isValidHHMM(desiredWakeTime);
  const idealSource = desiredValid ? desiredWakeTime : wakeValid ? wake : '';
  rows.push({
    kind: 'bedtime',
    state: bedtimeValid ? 'done' : 'upcoming',
    time: bedtime,
    suggested: wakeValid ? (suggestedBedtime({ wake, naps: pairs }, ageParams) ?? '') : '',
    ideal: idealSource ? idealBedtime(idealSource, ageParams.nightSleepH) : ''
  });

  return { rows, nowAfter: nowAfterIndex(rows, wakeValid, bedtimeValid) };
}

function nowAfterIndex(rows: TimelineRow[], wakeValid: boolean, bedtimeValid: boolean): number {
  if (!wakeValid) return -1;
  const bedIdx = rows.length - 1;
  if (bedtimeValid) return bedIdx;
  const progress = rows.findIndex((r) => r.kind === 'nap' && r.state === 'progress');
  if (progress !== -1) return progress;
  for (let i = bedIdx - 1; i >= 0; i--) if (rows[i].state === 'done') return i;
  return -1;
}
