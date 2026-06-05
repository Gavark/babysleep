import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../../helpers/db';
import {
  registerSubscription,
  listSubscriptionsForUser,
  revokeSubscription,
  deleteSubscriptionByEndpoint
} from '../../../src/lib/server/push/subscribe';

function seedUser(tdb: ReturnType<typeof makeTestDb>): number {
  const t = Math.floor(Date.now() / 1000);
  return Number(tdb.sqlite.prepare("INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)").run('u' + Math.random() + '@x', 'x', t, t).lastInsertRowid);
}

describe('push subscription service', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  let userId: number;
  beforeEach(() => { tdb = makeTestDb(); userId = seedUser(tdb); });

  it('registerSubscription inserts a row', () => {
    registerSubscription(tdb.db, userId, {
      endpoint: 'https://push.example/abc',
      p256dh: 'PK1',
      auth: 'A1',
      userAgent: 'TestUA/1.0'
    });
    const rows = listSubscriptionsForUser(tdb.db, userId);
    expect(rows.length).toBe(1);
    expect(rows[0].endpoint).toBe('https://push.example/abc');
    expect(rows[0].userAgent).toBe('TestUA/1.0');
  });

  it('registerSubscription is idempotent on same endpoint (updates last_seen, no duplicate)', () => {
    registerSubscription(tdb.db, userId, { endpoint: 'https://push.example/abc', p256dh: 'PK1', auth: 'A1', userAgent: 'UA' });
    registerSubscription(tdb.db, userId, { endpoint: 'https://push.example/abc', p256dh: 'PK2', auth: 'A2', userAgent: 'UA-updated' });
    const rows = listSubscriptionsForUser(tdb.db, userId);
    expect(rows.length).toBe(1);
    expect(rows[0].p256dh).toBe('PK2');
    expect(rows[0].auth).toBe('A2');
    expect(rows[0].userAgent).toBe('UA-updated');
  });

  it('revokeSubscription deletes by id only when it belongs to the user', () => {
    const otherUser = seedUser(tdb);
    registerSubscription(tdb.db, userId, { endpoint: 'https://push.example/a', p256dh: 'P', auth: 'A', userAgent: null });
    registerSubscription(tdb.db, otherUser, { endpoint: 'https://push.example/b', p256dh: 'P', auth: 'A', userAgent: null });

    const mine = listSubscriptionsForUser(tdb.db, userId)[0];
    const theirs = listSubscriptionsForUser(tdb.db, otherUser)[0];

    expect(revokeSubscription(tdb.db, userId, theirs.id)).toBe(false);
    expect(revokeSubscription(tdb.db, userId, mine.id)).toBe(true);

    expect(listSubscriptionsForUser(tdb.db, userId).length).toBe(0);
    expect(listSubscriptionsForUser(tdb.db, otherUser).length).toBe(1);
  });

  it('deleteSubscriptionByEndpoint removes regardless of owner (used by push delivery cleanup)', () => {
    registerSubscription(tdb.db, userId, { endpoint: 'https://push.example/a', p256dh: 'P', auth: 'A', userAgent: null });
    deleteSubscriptionByEndpoint(tdb.db, 'https://push.example/a');
    expect(listSubscriptionsForUser(tdb.db, userId).length).toBe(0);
  });
});
