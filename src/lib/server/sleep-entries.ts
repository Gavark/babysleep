import { and, eq, gte, lte, desc } from 'drizzle-orm';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './db/schema';
import { parseHHMM, formatHHMM } from '$lib/time';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export type EntryPatch = Partial<{
  wakeTime: string | null;
  nap1End: string | null;
  nap2End: string | null;
  nap3End: string | null;
  nap4End: string | null;
  bedtime: string | null;
  notes: string | null;
}>;

export function upsertEntry(db: DB, babyId: number, date: string, patch: EntryPatch) {
  const existing = getEntryForBabyDate(db, babyId, date);
  const t = Math.floor(Date.now() / 1000);
  if (!existing) {
    db.insert(schema.sleepEntries).values({
      babyId, date,
      wakeTime: patch.wakeTime ?? null,
      nap1End: patch.nap1End ?? null,
      nap2End: patch.nap2End ?? null,
      nap3End: patch.nap3End ?? null,
      nap4End: patch.nap4End ?? null,
      bedtime: patch.bedtime ?? null,
      notes: patch.notes ?? null,
      createdAt: t, updatedAt: t
    }).run();
  } else {
    db.update(schema.sleepEntries).set({ ...patch, updatedAt: t })
      .where(eq(schema.sleepEntries.id, existing.id)).run();
  }
}

export function getEntryForBabyDate(db: DB, babyId: number, date: string) {
  return db.select().from(schema.sleepEntries)
    .where(and(eq(schema.sleepEntries.babyId, babyId), eq(schema.sleepEntries.date, date)))
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
  const napCounts = rows.map((r) => [r.nap1End, r.nap2End, r.nap3End, r.nap4End].filter(Boolean).length);

  const mean = (arr: string[]) =>
    arr.length ? formatHHMM(Math.round(arr.map(parseHHMM).reduce((a, b) => a + b, 0) / arr.length)) : '';

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

  return {
    entryCount: rows.length,
    meanWakeHHMM: mean(wakes),
    meanBedtimeHHMM: mean(beds),
    meanNaps: napCounts.length
      ? Math.round((napCounts.reduce((a, b) => a + b, 0) / napCounts.length) * 10) / 10
      : 0,
    meanPrevNightHHMM: prevNightCount ? formatHHMM(Math.round(totalPrevNightMin / prevNightCount)) : ''
  };
}
