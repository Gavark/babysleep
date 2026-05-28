import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { createInvitation } from '../../src/lib/server/auth/invitations';
import { signupWithToken } from '../../src/routes/signup/_logic';

function makeAdmin(tdb: ReturnType<typeof makeTestDb>) {
  const t = Math.floor(Date.now() / 1000);
  const info = tdb.sqlite.prepare(
    "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 1, ?, ?)"
  ).run('admin@x.test', 'x', t, t);
  return Number(info.lastInsertRowid);
}

describe('signupWithToken', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('rejects unknown token', async () => {
    const r = await signupWithToken(tdb.db, { token: 'nope', email: 'b@x.test', password: '1234567890' });
    expect(r.ok).toBe(false);
  });

  it('creates user and marks invitation used on success', async () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    const r = await signupWithToken(tdb.db, { token: inv.token, email: 'b@x.test', password: '1234567890' });
    expect(r.ok).toBe(true);
    const u = tdb.sqlite.prepare('SELECT * FROM users WHERE email = ?').get('b@x.test') as any;
    expect(u).toBeTruthy();
    const used = tdb.sqlite.prepare('SELECT * FROM invitations WHERE id = ?').get(inv.id) as any;
    expect(used.used_at).not.toBeNull();
  });

  it('rejects already-used token', async () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    await signupWithToken(tdb.db, { token: inv.token, email: 'b@x.test', password: '1234567890' });
    const r2 = await signupWithToken(tdb.db, { token: inv.token, email: 'c@x.test', password: '1234567890' });
    expect(r2.ok).toBe(false);
    if (!r2.ok) expect(r2.reason).toBe('bad-token');
    const userCount = (tdb.sqlite.prepare('SELECT COUNT(*) AS n FROM users WHERE is_admin = 0').get() as { n: number }).n;
    expect(userCount).toBe(1); // second attempt did not create a second user
  });

  it('rejects weak password', async () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    const r = await signupWithToken(tdb.db, { token: inv.token, email: 'b@x.test', password: 'short' });
    expect(r.ok).toBe(false);
  });

  it('rejects duplicate email', async () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    await signupWithToken(tdb.db, { token: inv.token, email: 'b@x.test', password: '1234567890' });
    const inv2 = createInvitation(tdb.db, adminId);
    const r2 = await signupWithToken(tdb.db, { token: inv2.token, email: 'b@x.test', password: '1234567890' });
    expect(r2.ok).toBe(false);
  });

  it('rejects invalid email shapes (no @, no dot, whitespace)', async () => {
    const adminId = makeAdmin(tdb);
    const cases = ['nodomain', '@onlydomain.test', 'no-at-sign.test', 'with space@x.test', 'noTLD@x', ''];
    for (const email of cases) {
      const inv = createInvitation(tdb.db, adminId);
      const r = await signupWithToken(tdb.db, { token: inv.token, email, password: '1234567890' });
      expect(r.ok, `expected reject for ${JSON.stringify(email)}`).toBe(false);
      if (!r.ok) expect(r.reason).toBe('invalid-email');
    }
  });

  it('normalises email case before lookup (uppercase form not allowed twice)', async () => {
    const adminId = makeAdmin(tdb);
    const inv1 = createInvitation(tdb.db, adminId);
    await signupWithToken(tdb.db, { token: inv1.token, email: 'Mixed@x.test', password: '1234567890' });
    const inv2 = createInvitation(tdb.db, adminId);
    const r2 = await signupWithToken(tdb.db, { token: inv2.token, email: 'mixed@x.test', password: '1234567890' });
    expect(r2.ok).toBe(false);
    if (!r2.ok) expect(r2.reason).toBe('duplicate-email');
  });
}, 30_000);
