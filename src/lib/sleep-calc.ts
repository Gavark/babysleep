import { parseHHMM, formatHHMM } from './time';

export function ageInMonths(birthDateISO: string, override?: number | null, today: Date = new Date()): number {
  if (override != null) return Math.max(0, Math.floor(override));
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDateISO);
  if (!m) throw new Error(`Invalid birth date: ${birthDateISO}`);
  const by = Number(m[1]);
  const bm = Number(m[2]);
  const bd = Number(m[3]);
  const birth = new Date(Date.UTC(by, bm - 1, bd));
  const ref = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  if (birth.getTime() > ref.getTime()) throw new Error('Birth date is in the future');
  let months = (ref.getUTCFullYear() - by) * 12 + (ref.getUTCMonth() - (bm - 1));
  if (ref.getUTCDate() < bd) months -= 1;
  return Math.max(0, months);
}

export function idealBedtime(wakeHHMM: string, nightSleepHours: number): string {
  const wakeMin = parseHHMM(wakeHHMM);
  const totalMin = wakeMin - Math.round(nightSleepHours * 60);
  return formatHHMM(totalMin);
}
