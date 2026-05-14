import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { createInvitation } from '../../src/lib/server/auth/invitations';
import { signupWithToken } from '../../src/routes/signup/_logic';

function makeAdmin(tdb: ReturnType<typeof makeTestDb>) {
  const t = Math.floor(Date.now() / 1000);
  const info = tdb.sqlite.prepare(
    "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 1, ?, ?)"
  ).run('admin@x', 'x', t, t);
  return Number(info.lastInsertRowid);
}

describe('signupWithToken', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('rejects unknown token', async () => {
    const r = await signupWithToken(tdb.db, { token: 'nope', email: 'b@x', password: '1234567890' });
    expect(r.ok).toBe(false);
  });

  it('creates user and marks invitation used on success', async () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    const r = await signupWithToken(tdb.db, { token: inv.token, email: 'b@x', password: '1234567890' });
    expect(r.ok).toBe(true);
    const u = tdb.sqlite.prepare('SELECT * FROM users WHERE email = ?').get('b@x') as any;
    expect(u).toBeTruthy();
    const used = tdb.sqlite.prepare('SELECT * FROM invitations WHERE id = ?').get(inv.id) as any;
    expect(used.used_at).not.toBeNull();
  });

  it('rejects already-used token', async () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    await signupWithToken(tdb.db, { token: inv.token, email: 'b@x', password: '1234567890' });
    const r2 = await signupWithToken(tdb.db, { token: inv.token, email: 'c@x', password: '1234567890' });
    expect(r2.ok).toBe(false);
  });

  it('rejects weak password', async () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    const r = await signupWithToken(tdb.db, { token: inv.token, email: 'b@x', password: 'short' });
    expect(r.ok).toBe(false);
  });

  it('rejects duplicate email', async () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    await signupWithToken(tdb.db, { token: inv.token, email: 'b@x', password: '1234567890' });
    const inv2 = createInvitation(tdb.db, adminId);
    const r2 = await signupWithToken(tdb.db, { token: inv2.token, email: 'b@x', password: '1234567890' });
    expect(r2.ok).toBe(false);
  });
}, 30_000);
