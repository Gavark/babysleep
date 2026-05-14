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
  bedtime: string | null;
  notes: string | null;
};

function escape(v: string | null): string {
  if (v == null) return '';
  if (/[";\r\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function napCount(r: Row): number {
  return [r.nap1End, r.nap2End, r.nap3End, r.nap4End].filter(Boolean).length;
}

function napDur(start: string | null, end: string | null): string {
  if (!start || !end || !/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) return '';
  const dur = ((parseHHMM(end) - parseHHMM(start)) % 1440 + 1440) % 1440;
  return formatHHMM(dur);
}

function totalDaySleep(r: Row): string {
  let total = 0;
  let hasAny = false;
  const pairs: [string | null, string | null][] = [
    [r.nap1Start, r.nap1End],
    [r.nap2Start, r.nap2End],
    [r.nap3Start, r.nap3End],
    [r.nap4Start, r.nap4End]
  ];
  for (const [s, e] of pairs) {
    if (s && e && /^\d{2}:\d{2}$/.test(s) && /^\d{2}:\d{2}$/.test(e)) {
      total += ((parseHHMM(e) - parseHHMM(s)) % 1440 + 1440) % 1440;
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
    'S1 début', 'S1 fin', 'S1 durée',
    'S2 début', 'S2 fin', 'S2 durée',
    'S3 début', 'S3 fin', 'S3 durée',
    'S4 début', 'S4 fin', 'S4 durée',
    'Coucher', 'Nb siestes', 'Durée nuit préc.', 'Durée jour', 'Notes'
  ].join(';'));
  for (let i = 0; i < sortedDesc.length; i++) {
    const cur = sortedDesc[i];
    const prev = sortedDesc[i + 1] ?? opts.priorEntry ?? null; // older date
    lines.push([
      escape(cur.date),
      escape(cur.wakeTime),
      escape(cur.nap1Start), escape(cur.nap1End), napDur(cur.nap1Start, cur.nap1End),
      escape(cur.nap2Start), escape(cur.nap2End), napDur(cur.nap2Start, cur.nap2End),
      escape(cur.nap3Start), escape(cur.nap3End), napDur(cur.nap3Start, cur.nap3End),
      escape(cur.nap4Start), escape(cur.nap4End), napDur(cur.nap4Start, cur.nap4End),
      escape(cur.bedtime),
      String(napCount(cur)),
      durationPrevNight(cur, prev),
      totalDaySleep(cur),
      escape(cur.notes)
    ].join(';'));
  }
  return '﻿' + lines.join('\r\n') + '\r\n';
}
