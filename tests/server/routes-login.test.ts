import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { hashPassword } from '../../src/lib/server/auth/password';
import { attemptLogin } from '../../src/routes/login/_logic';

describe('attemptLogin', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('returns the user + new session id on correct creds', async () => {
    const hash = await hashPassword('hello world!');
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
    ).run('alice@x', hash, t, t);
    const res = await attemptLogin(tdb.db, { email: 'alice@x', password: 'hello world!' }, 'curl');
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.session.id.length).toBeGreaterThan(20);
  });

  it('returns error on unknown email', async () => {
    const res = await attemptLogin(tdb.db, { email: 'nope@x', password: 'whatever' }, 'curl');
    expect(res.ok).toBe(false);
  });

  it('returns error on wrong password', async () => {
    const hash = await hashPassword('hello world!');
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
    ).run('alice@x', hash, t, t);
    const res = await attemptLogin(tdb.db, { email: 'alice@x', password: 'wrong wrong wrong' }, 'curl');
    expect(res.ok).toBe(false);
  });

  it('email is case-insensitive', async () => {
    const hash = await hashPassword('hello world!');
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
    ).run('alice@x', hash, t, t);
    const res = await attemptLogin(tdb.db, { email: 'ALICE@X', password: 'hello world!' }, 'curl');
    expect(res.ok).toBe(true);
  });
}, 30_000);
