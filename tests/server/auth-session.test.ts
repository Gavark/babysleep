import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import {
  createSession,
  getSessionWithUser,
  refreshSessionIfStale,
  deleteSession,
  deleteOtherSessionsForUser,
  purgeExpiredSessions,
  SESSION_TTL_SEC,
  SESSION_HARD_CAP_SEC
} from '../../src/lib/server/auth/session';

function now() {
  return Math.floor(Date.now() / 1000);
}

async function makeUser(db: ReturnType<typeof makeTestDb>) {
  const { sqlite } = db;
  const stmt = sqlite.prepare(
    "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
  );
  const t = now();
  const info = stmt.run('alice@example.com', 'x', t, t);
  return Number(info.lastInsertRowid);
}

describe('sessions', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('creates a session and looks it up with the user', async () => {
    const uid = await makeUser(tdb);
    const sess = createSession(tdb.db, uid, 'curl/8');
    const found = getSessionWithUser(tdb.db, sess.id, now());
    expect(found?.user.id).toBe(uid);
    expect(found?.session.id).toBe(sess.id);
  });

  it('returns null for unknown session id', () => {
    expect(getSessionWithUser(tdb.db, 'nonexistent', now())).toBeNull();
  });

  it('returns null for expired session', async () => {
    const uid = await makeUser(tdb);
    const sess = createSession(tdb.db, uid, 'x');
    expect(getSessionWithUser(tdb.db, sess.id, now() + SESSION_TTL_SEC + 10)).toBeNull();
  });

  it('refreshSessionIfStale extends a session older than 24h', async () => {
    const uid = await makeUser(tdb);
    const t0 = now() - 25 * 3600;
    tdb.sqlite.prepare(
      "INSERT INTO sessions (id, user_id, expires_at, last_used_at, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run('abc', uid, t0 + SESSION_TTL_SEC, t0, 'x', t0);
    refreshSessionIfStale(tdb.db, 'abc', now());
    const row = tdb.sqlite.prepare('SELECT * FROM sessions WHERE id = ?').get('abc') as any;
    expect(row.expires_at).toBeGreaterThan(now() + SESSION_TTL_SEC - 60);
  });

  it('refreshSessionIfStale revokes session past hard cap', async () => {
    const uid = await makeUser(tdb);
    const t0 = now() - SESSION_HARD_CAP_SEC - 10;
    tdb.sqlite.prepare(
      "INSERT INTO sessions (id, user_id, expires_at, last_used_at, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run('abc', uid, now() + 1000, now() - 1000, 'x', t0);
    refreshSessionIfStale(tdb.db, 'abc', now());
    expect(getSessionWithUser(tdb.db, 'abc', now())).toBeNull();
  });

  it('deleteSession removes a single row', async () => {
    const uid = await makeUser(tdb);
    const sess = createSession(tdb.db, uid, 'x');
    deleteSession(tdb.db, sess.id);
    expect(getSessionWithUser(tdb.db, sess.id, now())).toBeNull();
  });

  it('deleteOtherSessionsForUser keeps current, deletes the rest', async () => {
    const uid = await makeUser(tdb);
    const a = createSession(tdb.db, uid, 'a');
    const b = createSession(tdb.db, uid, 'b');
    deleteOtherSessionsForUser(tdb.db, uid, a.id);
    expect(getSessionWithUser(tdb.db, a.id, now())).not.toBeNull();
    expect(getSessionWithUser(tdb.db, b.id, now())).toBeNull();
  });

  it('purgeExpiredSessions removes only expired', async () => {
    const uid = await makeUser(tdb);
    const live = createSession(tdb.db, uid, 'x');
    tdb.sqlite.prepare(
      "INSERT INTO sessions (id, user_id, expires_at, last_used_at, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run('dead', uid, now() - 10, now() - 1000, 'x', now() - 2000);
    purgeExpiredSessions(tdb.db, now());
    expect(getSessionWithUser(tdb.db, live.id, now())).not.toBeNull();
    expect(getSessionWithUser(tdb.db, 'dead', now())).toBeNull();
  });
});
