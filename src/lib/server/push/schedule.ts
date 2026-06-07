import { eq, and, isNull } from 'drizzle-orm';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import * as schema from '../db/schema';
// Intentionally NOT importing getEntryForBabyDate from '../sleep-entries':
// sleep-entries.ts will call recomputeNextPush from upsertEntry (Task 6),
// so importing back from this module would create a circular dependency.
// We query the entry directly via Drizzle instead.
import { ageInMonths } from '../../sleep-calc';
import { paramsForAge } from '../../age-params';
import { parseHHMM, isValidHHMM } from '../../time';
import { resolveTimezone, localHHMMToEpoch } from '../../tz';

type DB = BaseSQLiteDatabase<'sync', unknown, typeof schema>;

/**
 * Cancel any pending push for this baby (table invariant: at most one
 * active pending row per baby). Always safe to call.
 */
function cancelAllPending(db: DB, babyId: number): void {
  const t = Math.floor(Date.now() / 1000);
  db.update(schema.scheduledPushes)
    .set({ cancelledAt: t })
    .where(and(
      eq(schema.scheduledPushes.babyId, babyId),
      isNull(schema.scheduledPushes.firedAt),
      isNull(schema.scheduledPushes.cancelledAt)
    ))
    .run();
}

/**
 * After every sleep_entries write, recompute "when should the next push
 * fire for this baby on this date?" and reconcile the queue.
 *
 * Rules:
 *  - if no wakeTime → no pending
 *  - if a nap is in progress → no pending (parent knows)
 *  - if bedtime → no pending (day done)
 *  - if all expected naps taken → no pending
 *  - otherwise compute fire_at = lastEventTime + awakeWindow, insert iff fire_at > now
 */
export function recomputeNextPush(db: DB, babyId: number, date: string): void {
  cancelAllPending(db, babyId);

  const baby = db.select().from(schema.babies)
    .where(eq(schema.babies.id, babyId))
    .all()[0];
  if (!baby) return;

  const entry = db.select().from(schema.sleepEntries)
    .where(and(
      eq(schema.sleepEntries.babyId, babyId),
      eq(schema.sleepEntries.date, date)
    ))
    .all()[0];
  if (!entry || !entry.wakeTime || !isValidHHMM(entry.wakeTime)) return;

  if (entry.bedtime && isValidHHMM(entry.bedtime)) return;

  const refDate = new Date(date + 'T12:00:00Z');
  const months = ageInMonths(baby.birthDate, baby.ageOverrideMonths ?? undefined, refDate);
  const ageParams = paramsForAge(months);

  type Pair = { start: string | null; end: string | null };
  const pairs: Pair[] = [
    { start: entry.nap1Start, end: entry.nap1End },
    { start: entry.nap2Start, end: entry.nap2End },
    { start: entry.nap3Start, end: entry.nap3End },
    { start: entry.nap4Start, end: entry.nap4End }
  ];
  let lastEventMinutes = parseHHMM(entry.wakeTime);
  let lastEventIndex = -1; // -1 = wake, 0..3 = after nap i

  for (let i = 0; i < pairs.length; i++) {
    const p = pairs[i];
    if (p.start && isValidHHMM(p.start) && (!p.end || !isValidHHMM(p.end))) {
      // Nap in progress.
      return;
    }
    if (p.start && p.end && isValidHHMM(p.start) && isValidHHMM(p.end)) {
      lastEventMinutes = parseHHMM(p.end);
      lastEventIndex = i;
    }
  }

  // Next available nap slot (first empty).
  const nextNapIdx = pairs.findIndex(p => !p.start);
  if (nextNapIdx === -1) return;
  if (nextNapIdx >= ageParams.naps) return; // all expected naps taken

  const windowMin = lastEventIndex === -1 ? ageParams.firstAwakeWindowMin : ageParams.awakeWindowMin;
  const fireAtLocalMinutes = lastEventMinutes + windowMin;

  // Resolve the baby's wall-clock timezone (entry override → baby default →
  // user default → Europe/Paris fallback). Without this, fire_at would be
  // computed in the process TZ and silently land in the past for any baby
  // outside the container's zone.
  const user = db.select().from(schema.users)
    .where(eq(schema.users.id, baby.userId))
    .all()[0];
  const effectiveTz = resolveTimezone(entry.timezone, baby.timezone, user?.timezone ?? null);
  const hh = Math.floor(fireAtLocalMinutes / 60);
  const mm = fireAtLocalMinutes % 60;
  const fireAtHHMM = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  const fireAt = localHHMMToEpoch(date, fireAtHHMM, effectiveTz);

  const now = Math.floor(Date.now() / 1000);
  if (fireAt <= now) return; // already past

  db.insert(schema.scheduledPushes).values({
    babyId,
    kind: 'wake_window_exceeded',
    fireAt,
    createdAt: now
  }).run();
}
