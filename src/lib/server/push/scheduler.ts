import { eq, and, isNull, lte, gte, lt, or, isNotNull } from 'drizzle-orm';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import * as schema from '../db/schema';
import { sendOne, type PushPayload } from './send';
import * as m from '$paraglide/messages';

type DB = BaseSQLiteDatabase<'sync', unknown, typeof schema>;

const STALE_GRACE_SEC = 5 * 60;     // skip rows whose fire_at is > 5 min in the past
const PURGE_HORIZON_SEC = 30 * 86_400;

/**
 * Scan for due rows and fire each. Called from setInterval(30 s) in
 * hooks.server.ts. Async because sendOne awaits the push service.
 */
export async function scanAndFire(db: DB): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const due = db.select().from(schema.scheduledPushes)
    .where(and(
      isNull(schema.scheduledPushes.firedAt),
      isNull(schema.scheduledPushes.cancelledAt),
      lte(schema.scheduledPushes.fireAt, now),
      gte(schema.scheduledPushes.fireAt, now - STALE_GRACE_SEC)
    ))
    .all();

  for (const row of due) {
    await fireOne(db, row);
  }
}

async function fireOne(db: DB, row: typeof schema.scheduledPushes.$inferSelect): Promise<void> {
  const baby = db.select().from(schema.babies).where(eq(schema.babies.id, row.babyId)).all()[0];
  if (!baby) {
    db.update(schema.scheduledPushes).set({ firedAt: Math.floor(Date.now() / 1000) }).where(eq(schema.scheduledPushes.id, row.id)).run();
    return;
  }
  const user = db.select().from(schema.users).where(eq(schema.users.id, baby.userId)).all()[0];
  if (!user) {
    db.update(schema.scheduledPushes).set({ firedAt: Math.floor(Date.now() / 1000) }).where(eq(schema.scheduledPushes.id, row.id)).run();
    return;
  }
  const subs = db.select().from(schema.pushSubscriptions).where(eq(schema.pushSubscriptions.userId, user.id)).all();

  const localeNarrow: 'fr' | 'en' = user.locale === 'en' ? 'en' : 'fr';
  const payload: PushPayload = {
    kind: 'wake_window_exceeded',
    babyId: baby.id,
    babyName: baby.name,
    locale: localeNarrow,
    title: m.push_payload_title({ name: baby.name }, { locale: localeNarrow }),
    body: m.push_payload_body({ name: baby.name }, { locale: localeNarrow }),
    url: `/app/babies/${baby.id}/today`
  };

  await Promise.allSettled(subs.map(s => sendOne(db, s, payload)));

  db.update(schema.scheduledPushes)
    .set({ firedAt: Math.floor(Date.now() / 1000) })
    .where(eq(schema.scheduledPushes.id, row.id))
    .run();
}

/**
 * Purge rows older than 30 days that are no longer relevant (fired or
 * cancelled). Pending future rows are never purged.
 */
export function purgeStaleScheduledPushes(db: DB, now: number = Math.floor(Date.now() / 1000)): void {
  const cutoff = now - PURGE_HORIZON_SEC;
  db.delete(schema.scheduledPushes)
    .where(and(
      lt(schema.scheduledPushes.createdAt, cutoff),
      or(
        isNotNull(schema.scheduledPushes.firedAt),
        isNotNull(schema.scheduledPushes.cancelledAt)
      )
    ))
    .run();
}
