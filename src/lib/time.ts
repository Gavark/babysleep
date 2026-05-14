const HHMM_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidHHMM(s: string): boolean {
  return typeof s === 'string' && HHMM_RE.test(s);
}

export function parseHHMM(s: string): number {
  const m = HHMM_RE.exec(s);
  if (!m) throw new Error(`Invalid HH:MM: ${JSON.stringify(s)}`);
  return Number(m[1]) * 60 + Number(m[2]);
}

export function formatHHMM(minutes: number): string {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return `${String(h).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export function diffMinutesMod(from: string, to: string): number {
  const a = parseHHMM(from);
  const b = parseHHMM(to);
  return ((b - a) % 1440 + 1440) % 1440;
}

export function addMinutesMod(time: string, deltaMin: number): string {
  return formatHHMM(parseHHMM(time) + deltaMin);
}
