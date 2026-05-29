import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { hasNoUsers, createFirstAdmin } from '../../src/lib/server/auth/bootstrap';

describe('hasNoUsers', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('returns true on a fresh database', () => {
    expect(hasNoUsers(tdb.db)).toBe(true);
  });

  it('returns false after any user row is inserted', () => {
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
    ).run('seed@x.test', 'x', t, t);
    expect(hasNoUsers(tdb.db)).toBe(false);
  });
});

describe('createFirstAdmin', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('creates an admin (isAdmin=1) on a fresh database', async () => {
    const r = await createFirstAdmin(tdb.db, { email: 'admin@x.test', password: '1234567890' });
    expect(r.ok).toBe(true);
    const u = tdb.sqlite.prepare('SELECT email, is_admin FROM users WHERE email = ?').get('admin@x.test') as any;
    expect(u).toBeTruthy();
    expect(u.is_admin).toBe(1);
  });

  it('rejects when a user already exists (already-setup)', async () => {
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES ('seed@x.test', 'x', 0, ?, ?)"
    ).run(t, t);
    const r = await createFirstAdmin(tdb.db, { email: 'admin@x.test', password: '1234567890' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('already-setup');
  });

  it('is idempotent — a second call after success returns already-setup', async () => {
    const r1 = await createFirstAdmin(tdb.db, { email: 'admin@x.test', password: '1234567890' });
    expect(r1.ok).toBe(true);
    const r2 = await createFirstAdmin(tdb.db, { email: 'other@x.test', password: '1234567890' });
    expect(r2.ok).toBe(false);
    if (!r2.ok) expect(r2.reason).toBe('already-setup');
    const count = (tdb.sqlite.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number }).n;
    expect(count).toBe(1);
  });

  it('rejects invalid email shapes', async () => {
    const cases = ['nodomain', '@onlydomain.test', 'noTLD@x', '', 'with space@x.test'];
    for (const email of cases) {
      tdb = makeTestDb(); // fresh DB so already-setup doesn't kick in
      const r = await createFirstAdmin(tdb.db, { email, password: '1234567890' });
      expect(r.ok, `expected reject for ${JSON.stringify(email)}`).toBe(false);
      if (!r.ok) expect(r.reason).toBe('invalid-email');
    }
  });

  it('rejects weak password (< 10 chars)', async () => {
    const r = await createFirstAdmin(tdb.db, { email: 'admin@x.test', password: 'short' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('weak-password');
    expect(hasNoUsers(tdb.db)).toBe(true); // no row created
  });

  it('normalises email to lowercase', async () => {
    const r = await createFirstAdmin(tdb.db, { email: 'Mixed@X.Test', password: '1234567890' });
    expect(r.ok).toBe(true);
    const u = tdb.sqlite.prepare('SELECT email FROM users').get() as any;
    expect(u.email).toBe('mixed@x.test');
  });
}, 30_000);
