import webpush from 'web-push';
import { eq } from 'drizzle-orm';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import * as schema from '../db/schema';
import { getVapidKeys, vapidDetails } from './vapid';
import { deleteSubscriptionByEndpoint } from './subscribe';

type DB = BaseSQLiteDatabase<'sync', unknown, typeof schema>;

export type PushPayload = {
  kind: 'wake_window_exceeded';
  babyId: number;
  babyName: string;
  locale: 'fr' | 'en';
  title: string;
  body: string;
  url: string;
};

type Subscription = typeof schema.pushSubscriptions.$inferSelect;

/**
 * Send one push to one subscription.
 * - 'ok'        → 2xx; lastSeenAt bumped
 * - 'dead'      → 404/410; subscription DELETEd from the DB (push service
 *                 says this endpoint is gone)
 * - 'transient' → anything else (5xx, timeout, network) — logged to stderr
 *                 but the row stays. No retry policy: the caller marks
 *                 firedAt regardless, accepting one missed push.
 *
 * Never throws. The caller's loop is expected to be plain async iteration
 * over subscriptions and to stay simple.
 */
export async function sendOne(
  db: DB,
  sub: Subscription,
  payload: PushPayload
): Promise<'ok' | 'dead' | 'transient'> {
  const keys = await getVapidKeys(db);
  try {
    await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth }
      },
      JSON.stringify(payload),
      { vapidDetails: vapidDetails(keys), TTL: 60 }
    );
    const t = Math.floor(Date.now() / 1000);
    db.update(schema.pushSubscriptions)
      .set({ lastSeenAt: t })
      .where(eq(schema.pushSubscriptions.id, sub.id))
      .run();
    return 'ok';
  } catch (e: any) {
    const status: number | undefined = e?.statusCode;
    if (status === 404 || status === 410) {
      deleteSubscriptionByEndpoint(db, sub.endpoint);
      return 'dead';
    }
    console.error('[push] sendOne failed', { endpoint: sub.endpoint, status, message: e?.message });
    return 'transient';
  }
}
