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
  isComplete: boolean;           // bedtime saisi
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
