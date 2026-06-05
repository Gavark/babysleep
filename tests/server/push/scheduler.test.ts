import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeTestDb } from '../../helpers/db';

// Mock web-push BEFORE importing scheduler/sendOne. Mock provides both
// `generateVAPIDKeys` (used by vapid.ts) and `sendNotification` (used by
// sendOne). Vitest hoists vi.mock to the top automatically.
vi.mock('web-push', () => ({
  default: {
    generateVAPIDKeys: () => ({ publicKey: 'PUB', privateKey: 'PRIV' }),
    sendNotification: vi.fn()
  }
}));

import webpush from 'web-push';
import { scanAndFire, purgeStaleScheduledPushes } from '../../../src/lib/server/push/scheduler';
import { registerSubscription } from '../../../src/lib/server/push/subscribe';
import * as schema from '../../../src/lib/server/db/schema';

function seedBabyAndUser(tdb: ReturnType<typeof makeTestDb>) {
  const t = Math.floor(Date.now() / 1000);
  const u = Number(tdb.sqlite.prepare("INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)").run('u' + Math.random() + '@x', 'x', t, t).lastInsertRowid);
  const b = Number(tdb.sqlite.prepare("INSERT INTO babies (user_id, name, birth_date, created_at, updated_at) VALUES (?, 'Léo', '2025-12-05', ?, ?)").run(u, t, t).lastInsertRowid);
  return { userId: u, babyId: b };
}

function seedDuePush(tdb: ReturnType<typeof makeTestDb>, babyId: number, fireAtSec: number) {
  const t = Math.floor(Date.now() / 1000);
  tdb.sqlite.prepare("INSERT INTO scheduled_pushes (baby_id, kind, fire_at, created_at) VALUES (?, 'wake_window_exceeded', ?, ?)").run(babyId, fireAtSec, t);
}

describe('scanAndFire', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  let userId: number;
  let babyId: number;
  beforeEach(() => {
    tdb = makeTestDb();
    ({ userId, babyId } = seedBabyAndUser(tdb));
    vi.mocked(webpush.sendNotification).mockReset();
  });

  it('fires due rows and marks fired_at even when there are zero subscriptions', async () => {
    const now = Math.floor(Date.now() / 1000);
    seedDuePush(tdb, babyId, now - 10);
    await scanAndFire(tdb.db);
    expect(webpush.sendNotification).not.toHaveBeenCalled();
    const row = tdb.db.select().from(schema.scheduledPushes).all()[0];
    expect(row.firedAt).toBeGreaterThan(0);
  });

  it('fires once per subscription when 2 exist for the user', async () => {
    const now = Math.floor(Date.now() / 1000);
    registerSubscription(tdb.db, userId, { endpoint: 'https://push.example/a', p256dh: 'P1', auth: 'A1', userAgent: null });
    registerSubscription(tdb.db, userId, { endpoint: 'https://push.example/b', p256dh: 'P2', auth: 'A2', userAgent: null });
    seedDuePush(tdb, babyId, now - 10);
    vi.mocked(webpush.sendNotification).mockResolvedValue(undefined as any);

    await scanAndFire(tdb.db);
    expect(webpush.sendNotification).toHaveBeenCalledTimes(2);
    const row = tdb.db.select().from(schema.scheduledPushes).all()[0];
    expect(row.firedAt).toBeGreaterThan(0);
  });

  it('does not fire rows whose fire_at is in the future', async () => {
    const now = Math.floor(Date.now() / 1000);
    registerSubscription(tdb.db, userId, { endpoint: 'https://push.example/a', p256dh: 'P', auth: 'A', userAgent: null });
    seedDuePush(tdb, babyId, now + 600); // 10 min future
    await scanAndFire(tdb.db);
    expect(webpush.sendNotification).not.toHaveBeenCalled();
    const row = tdb.db.select().from(schema.scheduledPushes).all()[0];
    expect(row.firedAt).toBeNull();
  });

  it('skips stale rows (fire_at older than 5 minutes ago)', async () => {
    const now = Math.floor(Date.now() / 1000);
    registerSubscription(tdb.db, userId, { endpoint: 'https://push.example/a', p256dh: 'P', auth: 'A', userAgent: null });
    seedDuePush(tdb, babyId, now - 600); // 10 min stale
    await scanAndFire(tdb.db);
    expect(webpush.sendNotification).not.toHaveBeenCalled();
    const row = tdb.db.select().from(schema.scheduledPushes).all()[0];
    expect(row.firedAt).toBeNull();
  });

  it('deletes subscription when push service returns 410', async () => {
    const now = Math.floor(Date.now() / 1000);
    registerSubscription(tdb.db, userId, { endpoint: 'https://push.example/dead', p256dh: 'P', auth: 'A', userAgent: null });
    seedDuePush(tdb, babyId, now - 10);
    const err: any = new Error('Gone'); err.statusCode = 410;
    vi.mocked(webpush.sendNotification).mockRejectedValue(err);

    await scanAndFire(tdb.db);

    const subs = tdb.db.select().from(schema.pushSubscriptions).all();
    expect(subs.length).toBe(0);
  });

  it('keeps subscription when push service returns 500', async () => {
    const now = Math.floor(Date.now() / 1000);
    registerSubscription(tdb.db, userId, { endpoint: 'https://push.example/transient', p256dh: 'P', auth: 'A', userAgent: null });
    seedDuePush(tdb, babyId, now - 10);
    const err: any = new Error('Server Error'); err.statusCode = 500;
    vi.mocked(webpush.sendNotification).mockRejectedValue(err);

    await scanAndFire(tdb.db);

    const subs = tdb.db.select().from(schema.pushSubscriptions).all();
    expect(subs.length).toBe(1);
    const row = tdb.db.select().from(schema.scheduledPushes).all()[0];
    expect(row.firedAt).toBeGreaterThan(0);
  });
});

describe('purgeStaleScheduledPushes', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('drops rows older than 30 days that are fired_at or cancelled_at', () => {
    const t = Math.floor(Date.now() / 1000);
    const old = t - 31 * 86400;
    const fresh = t - 1 * 86400;
    const { babyId } = seedBabyAndUser(tdb);

    tdb.sqlite.prepare("INSERT INTO scheduled_pushes (baby_id, kind, fire_at, fired_at, created_at) VALUES (?, 'wake_window_exceeded', ?, ?, ?)").run(babyId, old, old, old);
    tdb.sqlite.prepare("INSERT INTO scheduled_pushes (baby_id, kind, fire_at, cancelled_at, created_at) VALUES (?, 'wake_window_exceeded', ?, ?, ?)").run(babyId, fresh, fresh, fresh);
    tdb.sqlite.prepare("INSERT INTO scheduled_pushes (baby_id, kind, fire_at, created_at) VALUES (?, 'wake_window_exceeded', ?, ?)").run(babyId, t + 600, t);

    purgeStaleScheduledPushes(tdb.db);

    const remaining = tdb.db.select().from(schema.scheduledPushes).all();
    expect(remaining.length).toBe(2); // fresh cancelled + future pending
  });
});
