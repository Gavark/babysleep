import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { hashPassword } from '../../src/lib/server/auth/password';
import { attemptLogin, LOGIN_MAX_FAILURES } from '../../src/routes/login/_logic';

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

// The failure counter lives in a module-level map that outlives each test's
// database, so every test uses its own email address.
describe('attemptLogin per-account rate limit', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  async function addUser(email: string) {
    const hash = await hashPassword('hello world!');
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
    ).run(email, hash, t, t);
  }
  const login = (email: string, password: string) =>
    attemptLogin(tdb.db, { email, password }, 'curl');
  async function failTimes(email: string, n: number) {
    for (let i = 0; i < n; i++) {
      const res = await login(email, 'wrong wrong wrong');
      expect(res).toEqual({ ok: false, reason: 'invalid' });
    }
  }

  it('refuses even the right password after too many failures', async () => {
    await addUser('locked@x');
    await failTimes('locked@x', LOGIN_MAX_FAILURES);
    expect(await login('locked@x', 'hello world!')).toEqual({ ok: false, reason: 'rate_limited' });
  });

  it('caps a burst of concurrent attempts at the limit', async () => {
    await addUser('burst@x');
    const results = await Promise.all(
      Array.from({ length: LOGIN_MAX_FAILURES + 3 }, () => login('burst@x', 'wrong wrong wrong'))
    );
    const reasons = results.map((r) => (r.ok ? 'ok' : r.reason));
    expect(reasons.filter((r) => r === 'invalid')).toHaveLength(LOGIN_MAX_FAILURES);
    expect(reasons.filter((r) => r === 'rate_limited')).toHaveLength(3);
  });

  it('only locks the account that failed', async () => {
    await addUser('target@x');
    await addUser('bystander@x');
    await failTimes('target@x', LOGIN_MAX_FAILURES);
    expect((await login('bystander@x', 'hello world!')).ok).toBe(true);
  });

  it('counts failures on unknown emails too, without revealing them', async () => {
    await failTimes('ghost@x', LOGIN_MAX_FAILURES);
    expect(await login('ghost@x', 'anything at all')).toEqual({ ok: false, reason: 'rate_limited' });
  });

  it('shares the counter across email casing', async () => {
    await addUser('casey@x');
    await failTimes('CASEY@X', LOGIN_MAX_FAILURES);
    expect(await login('casey@x', 'hello world!')).toEqual({ ok: false, reason: 'rate_limited' });
  });

  it('resets the counter after a successful login', async () => {
    await addUser('reset@x');
    await failTimes('reset@x', LOGIN_MAX_FAILURES - 1);
    expect((await login('reset@x', 'hello world!')).ok).toBe(true);
    await failTimes('reset@x', LOGIN_MAX_FAILURES - 1);
    expect((await login('reset@x', 'hello world!')).ok).toBe(true);
  });

  it('does not count successful logins', async () => {
    await addUser('busy@x');
    for (let i = 0; i < LOGIN_MAX_FAILURES + 2; i++) {
      expect((await login('busy@x', 'hello world!')).ok).toBe(true);
    }
  });
}, 60_000);
