import { parseHHMM, formatHHMM } from '$lib/time';

type Row = {
  date: string;
  wakeTime: string | null;
  nap1End: string | null;
  nap2End: string | null;
  nap3End: string | null;
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

function durationPrevNight(curr: Row, prev: Row | null): string {
  if (!prev || !curr.wakeTime || !prev.bedtime) return '';
  const [y1, m1, d1] = curr.date.split('-').map(Number);
  const [y2, m2, d2] = prev.date.split('-').map(Number);
  const dayDiff = (Date.UTC(y1, m1 - 1, d1) - Date.UTC(y2, m2 - 1, d2)) / 86400000;
  if (dayDiff !== 1) return '';
  const dur = ((parseHHMM(curr.wakeTime) - parseHHMM(prev.bedtime)) % 1440 + 1440) % 1440;
  return formatHHMM(dur);
}

export function buildSleepCsv(rows: Row[], _babyName: string): string {
  const sortedDesc = [...rows].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const lines: string[] = [];
  lines.push([
    'Date', 'Réveil', 'Sieste 1', 'Sieste 2', 'Sieste 3', 'Sieste 4',
    'Coucher', 'Nb siestes', 'Durée nuit préc.', 'Notes'
  ].join(';'));
  for (let i = 0; i < sortedDesc.length; i++) {
    const cur = sortedDesc[i];
    const prev = sortedDesc[i + 1] ?? null; // older date
    lines.push([
      escape(cur.date),
      escape(cur.wakeTime),
      escape(cur.nap1End),
      escape(cur.nap2End),
      escape(cur.nap3End),
      escape(cur.nap4End),
      escape(cur.bedtime),
      String(napCount(cur)),
      durationPrevNight(cur, prev),
      escape(cur.notes)
    ].join(';'));
  }
  return '﻿' + lines.join('\r\n') + '\r\n';
}
