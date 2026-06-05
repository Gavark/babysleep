import webpush from 'web-push';
import { eq } from 'drizzle-orm';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import * as schema from '../db/schema';

type DB = BaseSQLiteDatabase<'sync', unknown, typeof schema>;

const KEY_PUBLIC = 'vapid_public_key';
const KEY_PRIVATE = 'vapid_private_key';

export type VapidKeys = { publicKey: string; privateKey: string };

/**
 * Read VAPID keypair from `app_config`. Lazy-generate on first call.
 * Subsequent calls return the persisted values byte-for-byte — the same
 * subscriptions stay valid across server restarts (and across restores from
 * the nightly SQLite backup).
 */
export async function getVapidKeys(db: DB): Promise<VapidKeys> {
  const pubRow = db.select().from(schema.appConfig)
    .where(eq(schema.appConfig.key, KEY_PUBLIC))
    .all()[0];
  if (pubRow) {
    const privRow = db.select().from(schema.appConfig)
      .where(eq(schema.appConfig.key, KEY_PRIVATE))
      .all()[0];
    if (privRow) return { publicKey: pubRow.value, privateKey: privRow.value };
  }

  // First-time generation.
  const generated = webpush.generateVAPIDKeys();
  const t = Math.floor(Date.now() / 1000);
  db.insert(schema.appConfig).values([
    { key: KEY_PUBLIC, value: generated.publicKey, updatedAt: t },
    { key: KEY_PRIVATE, value: generated.privateKey, updatedAt: t }
  ]).onConflictDoNothing().run();
  return generated;
}

/** Compose the `vapidDetails` object expected by `web-push.sendNotification`. */
export function vapidDetails(keys: VapidKeys, subject?: string) {
  return {
    subject: subject || defaultSubject(),
    publicKey: keys.publicKey,
    privateKey: keys.privateKey
  };
}

function defaultSubject(): string {
  const explicit = process.env.VAPID_SUBJECT;
  if (explicit && explicit.startsWith('mailto:')) return explicit;
  const origin = process.env.ORIGIN;
  if (origin) {
    try {
      const host = new URL(origin).hostname;
      return `mailto:admin@${host}`;
    } catch { /* fall through */ }
  }
  return 'mailto:admin@example.invalid';
}
