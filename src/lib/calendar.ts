import { parseHHMM, isValidHHMM } from '$lib/time';
import { ageInMonths } from '$lib/sleep-calc';
import { paramsForAge } from '$lib/age-params';

export type TimelineSegment = {
  kind: 'nap' | 'night';
  startMin: number;  // 0..1440
  endMin: number;    // 0..1440
};

export type HeatLevel = 'good' | 'ok' | 'meh' | 'bad' | 'partial' | 'none';

export type DayMetrics = {
  date: string;                  // YYYY-MM-DD
  inMonth: boolean;
  isToday: boolean;
  hasAnyData: boolean;
  isComplete: boolean;           // bedtime + wakeTime saisis
  totalSleepMin: number;
  recommendedMin: number;
  ratio: number;                 // 0..N (may exceed 1)
  heatLevel: HeatLevel;
  segments: TimelineSegment[];
  wakeTime: string | null;
  bedtime: string | null;
  napCount: number;
};

export type GridCell = { readonly date: string; readonly inMonth: boolean };

/**
 * Calendar-facing structural subset of a baby. Defined locally to avoid
 * pulling in $lib/server/* paths from this pure module.
 */
export type CalendarBaby = {
  birthDate: string;            // YYYY-MM-DD
  ageOverrideMonths: number | null;
};

/**
 * Calendar-facing structural subset of a sleep entry. Defined locally to avoid
 * pulling in $lib/server/* paths from this pure module.
 */
export type CalendarEntry = {
  wakeTime: string | null;
  nap1Start: string | null;
  nap1End: string | null;
  nap2Start: string | null;
  nap2End: string | null;
  nap3Start: string | null;
  nap3End: string | null;
  nap4Start: string | null;
  nap4End: string | null;
  bedtime: string | null;
};

function isoDate(y: number, m1to12: number, d: number): string {
  return `${y}-${String(m1to12).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function addDaysISO(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return isoDate(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

/**
 * dayOfWeekISOMonZero: Monday=0..Sunday=6 for a YYYY-MM-DD date (UTC).
 */
function dayOfWeekISOMonZero(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  const jsDow = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // Sun=0..Sat=6
  return (jsDow + 6) % 7; // shift so Mon=0..Sun=6
}

export function buildTimelineSegments(entry: CalendarEntry | undefined): TimelineSegment[] {
  if (!entry) return [];
  const segs: TimelineSegment[] = [];

  if (entry.wakeTime && isValidHHMM(entry.wakeTime)) {
    const wakeMin = parseHHMM(entry.wakeTime);
    if (wakeMin > 0) segs.push({ kind: 'night', startMin: 0, endMin: wakeMin });
  }

  const napPairs: [string | null, string | null][] = [
    [entry.nap1Start, entry.nap1End],
    [entry.nap2Start, entry.nap2End],
    [entry.nap3Start, entry.nap3End],
    [entry.nap4Start, entry.nap4End]
  ];
  for (const [s, e] of napPairs) {
    if (s && e && isValidHHMM(s) && isValidHHMM(e)) {
      const sm = parseHHMM(s);
      const em = parseHHMM(e);
      if (em > sm) segs.push({ kind: 'nap', startMin: sm, endMin: em });
    }
  }

  if (entry.bedtime && isValidHHMM(entry.bedtime)) {
    const bedMin = parseHHMM(entry.bedtime);
    if (bedMin < 1440) segs.push({ kind: 'night', startMin: bedMin, endMin: 1440 });
  }

  segs.sort((a, b) => a.startMin - b.startMin);
  return segs;
}

export function buildMonthGrid(year: number, month1to12: number): GridCell[] {
  const firstOfMonth = isoDate(year, month1to12, 1);
  const dowFirst = dayOfWeekISOMonZero(firstOfMonth); // 0..6
  const gridStart = addDaysISO(firstOfMonth, -dowFirst);

  // last day of month: go to the first of next month, then -1 day
  const nextMonthFirst =
    month1to12 === 12 ? isoDate(year + 1, 1, 1) : isoDate(year, month1to12 + 1, 1);
  const lastOfMonth = addDaysISO(nextMonthFirst, -1);
  const dowLast = dayOfWeekISOMonZero(lastOfMonth);
  const gridEnd = addDaysISO(lastOfMonth, 6 - dowLast);

  const monthKey = isoDate(year, month1to12, 1).slice(0, 7);
  const out: GridCell[] = [];
  let cur = gridStart;
  while (cur <= gridEnd) {
    out.push({ date: cur, inMonth: cur.slice(0, 7) === monthKey });
    cur = addDaysISO(cur, 1);
  }
  return out;
}

export function heatmapClass(level: HeatLevel): string {
  return `heat-${level}`;
}

/**
 * Compute display metrics for one calendar day. `inMonth` is hardcoded to `true`
 * in the returned object — callers MUST override it using the matching
 * GridCell.inMonth value from `buildMonthGrid` (padding days fall outside the
 * displayed month).
 */
export function computeDayMetrics(
  date: string,
  entry: CalendarEntry | undefined,
  baby: CalendarBaby,
  todayISO: string
): DayMetrics {
  const refDate = new Date(date + 'T12:00:00Z');
  const months = ageInMonths(baby.birthDate, baby.ageOverrideMonths ?? undefined, refDate);
  const ageParams = paramsForAge(months);
  const recommendedMin = Math.round((ageParams.daySleepH + ageParams.nightSleepH) * 60);

  const segments = buildTimelineSegments(entry);
  const totalSleepMin = segments.reduce((acc, s) => acc + (s.endMin - s.startMin), 0);

  const hasAnyData = !!entry && segments.length > 0;
  const isComplete = !!entry?.bedtime && !!entry?.wakeTime;

  const napCount = entry
    ? [entry.nap1End, entry.nap2End, entry.nap3End, entry.nap4End].filter(Boolean).length
    : 0;

  const ratio = recommendedMin > 0 ? totalSleepMin / recommendedMin : 0;

  let heatLevel: HeatLevel;
  if (!hasAnyData) {
    heatLevel = 'none';
  } else if (!isComplete) {
    heatLevel = 'partial';
  } else if (ratio >= 0.90) {
    heatLevel = 'good';
  } else if (ratio >= 0.70) {
    heatLevel = 'ok';
  } else if (ratio >= 0.50) {
    heatLevel = 'meh';
  } else {
    heatLevel = 'bad';
  }

  return {
    date,
    inMonth: true,
    isToday: date === todayISO,
    hasAnyData,
    isComplete,
    totalSleepMin,
    recommendedMin,
    ratio,
    heatLevel,
    segments,
    wakeTime: entry?.wakeTime ?? null,
    bedtime: entry?.bedtime ?? null,
    napCount
  };
}
