import { and, eq, gte, lte, lt, desc } from 'drizzle-orm';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './db/schema';
import { parseHHMM, formatHHMM } from '$lib/time';
import { recomputeNextPush } from './push/schedule';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export type NightRating = 'good' | 'medium' | 'bad';

export type EntryPatch = Partial<{
  wakeTime: string | null;
  nap1Start: string | null;
  nap1End: string | null;
  nap2Start: string | null;
  nap2End: string | null;
  nap3Start: string | null;
  nap3End: string | null;
  nap4Start: string | null;
  nap4End: string | null;
  nap5Start: string | null;
  nap5End: string | null;
  nap6Start: string | null;
  nap6End: string | null;
  nap7Start: string | null;
  nap7End: string | null;
  nap8Start: string | null;
  nap8End: string | null;
  nap1PauseMin: number | null;
  nap2PauseMin: number | null;
  nap3PauseMin: number | null;
  nap4PauseMin: number | null;
  nap5PauseMin: number | null;
  nap6PauseMin: number | null;
  nap7PauseMin: number | null;
  nap8PauseMin: number | null;
  bedtime: string | null;
  notes: string | null;
  timezone: string | null;
  nightRating: NightRating | null;
}>;

export function upsertEntry(db: DB, babyId: number, date: string, patch: EntryPatch) {
  const existing = getEntryForBabyDate(db, babyId, date);
  const t = Math.floor(Date.now() / 1000);
  if (!existing) {
    db.insert(schema.sleepEntries).values({
      babyId, date,
      wakeTime: patch.wakeTime ?? null,
      nap1Start: patch.nap1Start ?? null,
      nap1End: patch.nap1End ?? null,
      nap2Start: patch.nap2Start ?? null,
      nap2End: patch.nap2End ?? null,
      nap3Start: patch.nap3Start ?? null,
      nap3End: patch.nap3End ?? null,
      nap4Start: patch.nap4Start ?? null,
      nap4End: patch.nap4End ?? null,
      nap5Start: patch.nap5Start ?? null,
      nap5End: patch.nap5End ?? null,
      nap6Start: patch.nap6Start ?? null,
      nap6End: patch.nap6End ?? null,
      nap7Start: patch.nap7Start ?? null,
      nap7End: patch.nap7End ?? null,
      nap8Start: patch.nap8Start ?? null,
      nap8End: patch.nap8End ?? null,
      nap1PauseMin: patch.nap1PauseMin ?? null,
      nap2PauseMin: patch.nap2PauseMin ?? null,
      nap3PauseMin: patch.nap3PauseMin ?? null,
      nap4PauseMin: patch.nap4PauseMin ?? null,
      nap5PauseMin: patch.nap5PauseMin ?? null,
      nap6PauseMin: patch.nap6PauseMin ?? null,
      nap7PauseMin: patch.nap7PauseMin ?? null,
      nap8PauseMin: patch.nap8PauseMin ?? null,
      bedtime: patch.bedtime ?? null,
      notes: patch.notes ?? null,
      timezone: patch.timezone ?? null,
      nightRating: patch.nightRating ?? null,
      createdAt: t, updatedAt: t
    }).run();
  } else {
    db.update(schema.sleepEntries).set({ ...patch, updatedAt: t })
      .where(eq(schema.sleepEntries.id, existing.id)).run();
  }
  // Reconcile the push queue after any write. recomputeNextPush is idempotent
  // and inexpensive (single SELECT + at most 2 writes), so calling it on
  // every upsert (including night_rating changes that don't affect the
  // timer) is acceptable.
  recomputeNextPush(db, babyId, date);
}

export function deleteEntry(db: DB, entryId: number) {
  db.delete(schema.sleepEntries).where(eq(schema.sleepEntries.id, entryId)).run();
}

/** Set or clear the manual night-quality rating for a (baby, date). Creates the entry if missing. */
export function setNightRating(db: DB, babyId: number, date: string, rating: NightRating | null) {
  upsertEntry(db, babyId, date, { nightRating: rating });
}

/** Add `deltaMin` minutes of pause to nap `napIdx` (1..8) for (baby, date). Cumulative. */
export function addNapPause(
  db: DB,
  babyId: number,
  date: string,
  napIdx: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
  deltaMin: number
) {
  const existing = getEntryForBabyDate(db, babyId, date);
  const key = (`nap${napIdx}PauseMin`) as
    | 'nap1PauseMin' | 'nap2PauseMin' | 'nap3PauseMin' | 'nap4PauseMin'
    | 'nap5PauseMin' | 'nap6PauseMin' | 'nap7PauseMin' | 'nap8PauseMin';
  const current = existing?.[key] ?? 0;
  upsertEntry(db, babyId, date, { [key]: current + deltaMin });
}

export function getEntryForBabyDate(db: DB, babyId: number, date: string) {
  return db.select().from(schema.sleepEntries)
    .where(and(eq(schema.sleepEntries.babyId, babyId), eq(schema.sleepEntries.date, date)))
    .all()[0] ?? null;
}

export function getMostRecentEntryBefore(db: DB, babyId: number, date: string) {
  return db.select().from(schema.sleepEntries)
    .where(and(eq(schema.sleepEntries.babyId, babyId), lt(schema.sleepEntries.date, date)))
    .orderBy(desc(schema.sleepEntries.date))
    .limit(1)
    .all()[0] ?? null;
}

export function listEntriesInRange(db: DB, babyId: number, from: string, to: string) {
  return db.select().from(schema.sleepEntries)
    .where(and(
      eq(schema.sleepEntries.babyId, babyId),
      gte(schema.sleepEntries.date, from),
      lte(schema.sleepEntries.date, to)
    ))
    .orderBy(desc(schema.sleepEntries.date))
    .all();
}

export function summariesForBaby(db: DB, babyId: number, from: string, to: string) {
  const rows = listEntriesInRange(db, babyId, from, to);
  const wakes = rows.map((r) => r.wakeTime).filter((s): s is string => !!s);
  const beds = rows.map((r) => r.bedtime).filter((s): s is string => !!s);
  const napCounts = rows.map((r) =>
    [r.nap1End, r.nap2End, r.nap3End, r.nap4End, r.nap5End, r.nap6End, r.nap7End, r.nap8End]
      .filter(Boolean).length
  );

  const mean = (arr: string[]) => {
    if (arr.length === 0) return '';
    let sx = 0, sy = 0;
    for (const t of arr) {
      const ang = (parseHHMM(t) / 1440) * 2 * Math.PI;
      sx += Math.cos(ang);
      sy += Math.sin(ang);
    }
    let a = Math.atan2(sy / arr.length, sx / arr.length);
    if (a < 0) a += 2 * Math.PI;
    return formatHHMM(Math.round((a / (2 * Math.PI)) * 1440));
  };

  let totalPrevNightMin = 0;
  let prevNightCount = 0;
  for (let i = 0; i < rows.length - 1; i++) {
    const cur = rows[i];
    const prev = rows[i + 1];
    if (
      cur.wakeTime && prev.bedtime &&
      /^\d{4}-\d{2}-\d{2}$/.test(cur.date) &&
      /^\d{4}-\d{2}-\d{2}$/.test(prev.date)
    ) {
      const [cy, cm, cd] = cur.date.split('-').map(Number);
      const [py, pm, pd] = prev.date.split('-').map(Number);
      const dayDiff = (Date.UTC(cy, cm - 1, cd) - Date.UTC(py, pm - 1, pd)) / 86400000;
      if (dayDiff === 1) {
        const dur = ((parseHHMM(cur.wakeTime) - parseHHMM(prev.bedtime)) % 1440 + 1440) % 1440;
        totalPrevNightMin += dur;
        prevNightCount += 1;
      }
    }
  }

  let totalDaySleepMin = 0;
  let daysWithDaySleep = 0;
  for (const r of rows) {
    let dayTotal = 0;
    let hasAny = false;
    const pairs: [string | null, string | null, number | null][] = [
      [r.nap1Start, r.nap1End, r.nap1PauseMin],
      [r.nap2Start, r.nap2End, r.nap2PauseMin],
      [r.nap3Start, r.nap3End, r.nap3PauseMin],
      [r.nap4Start, r.nap4End, r.nap4PauseMin],
      [r.nap5Start, r.nap5End, r.nap5PauseMin],
      [r.nap6Start, r.nap6End, r.nap6PauseMin],
      [r.nap7Start, r.nap7End, r.nap7PauseMin],
      [r.nap8Start, r.nap8End, r.nap8PauseMin]
    ];
    for (const [s, e, pause] of pairs) {
      if (s && e && /^\d{2}:\d{2}$/.test(s) && /^\d{2}:\d{2}$/.test(e)) {
        const dur = ((parseHHMM(e) - parseHHMM(s)) % 1440 + 1440) % 1440;
        dayTotal += Math.max(0, dur - (pause ?? 0));
        hasAny = true;
      }
    }
    if (hasAny) {
      totalDaySleepMin += dayTotal;
      daysWithDaySleep += 1;
    }
  }
  const meanDaySleepHHMM = daysWithDaySleep
    ? formatHHMM(Math.round(totalDaySleepMin / daysWithDaySleep))
    : '';

  return {
    entryCount: rows.length,
    meanWakeHHMM: mean(wakes),
    meanBedtimeHHMM: mean(beds),
    meanNaps: napCounts.length
      ? Math.round((napCounts.reduce((a, b) => a + b, 0) / napCounts.length) * 10) / 10
      : 0,
    meanPrevNightHHMM: prevNightCount ? formatHHMM(Math.round(totalPrevNightMin / prevNightCount)) : '',
    meanDaySleepHHMM
  };
}
