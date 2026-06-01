import { describe, it, expect, beforeAll } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { attemptLogin } from '../../src/routes/login/_logic';
import { hashPassword } from '../../src/lib/server/auth/password';

// argon2id is intentionally slow — first init can pay an extra cost while it
// builds the dummy hash. Warm up once so the per-test budget stays predictable.
beforeAll(async () => {
  // Trigger lazy dummy-hash init by attempting an unrelated login.
  const tdb = makeTestDb();
  await attemptLogin(tdb.db, { email: 'warmup@example.test', password: 'whatever123' }, null);
});

describe('attemptLogin — timing-safe email enumeration defence', () => {
  it('returns the same invalid result for missing user and wrong password', async () => {
    const tdb = makeTestDb();
    const t = Math.floor(Date.now() / 1000);
    const hash = await hashPassword('real-password-real');
    tdb.sqlite
      .prepare("INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)")
      .run('alice@example.test', hash, t, t);

    const missing = await attemptLogin(tdb.db, { email: 'nobody@example.test', password: 'whatever123' }, null);
    const wrong = await attemptLogin(tdb.db, { email: 'alice@example.test', password: 'wrong-password' }, null);

    expect(missing).toEqual({ ok: false, reason: 'invalid' });
    expect(wrong).toEqual({ ok: false, reason: 'invalid' });
  });

  it('still succeeds for the correct email + password', async () => {
    const tdb = makeTestDb();
    const t = Math.floor(Date.now() / 1000);
    const hash = await hashPassword('correct-horse-battery');
    tdb.sqlite
      .prepare("INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)")
      .run('bob@example.test', hash, t, t);

    const r = await attemptLogin(tdb.db, { email: 'bob@example.test', password: 'correct-horse-battery' }, null);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.user.email).toBe('bob@example.test');
      expect(r.session.id).toMatch(/^[A-Za-z0-9_-]{40,}$/);
    }
  });

  it('spends comparable wall-clock time on missing-user vs wrong-password', async () => {
    // Smoke test for the timing-safe path. Runs N reps per case and asserts
    // the median ratio is within an order of magnitude. This is intentionally
    // loose: argon2 timing varies with system load; CI shouldn't flake.
    const tdb = makeTestDb();
    const t = Math.floor(Date.now() / 1000);
    const hash = await hashPassword('the-real-password-here');
    tdb.sqlite
      .prepare("INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)")
      .run('charlie@example.test', hash, t, t);

    async function time(fn: () => Promise<unknown>) {
      const start = performance.now();
      await fn();
      return performance.now() - start;
    }

    const N = 3;
    const tMissing: number[] = [];
    const tWrong: number[] = [];
    for (let i = 0; i < N; i++) {
      tMissing.push(await time(() => attemptLogin(tdb.db, { email: 'unknown@example.test', password: 'whatever123' }, null)));
      tWrong.push(await time(() => attemptLogin(tdb.db, { email: 'charlie@example.test', password: 'wrong-password' }, null)));
    }
    const median = (a: number[]) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
    const mMissing = median(tMissing);
    const mWrong = median(tWrong);

    // Pre-fix: missing was ~0ms while wrong was ~80-150ms — ratio > 50.
    // Post-fix: both should be in the same argon2 ballpark; allow 10x slack
    // for CI noise without losing the regression signal.
    const ratio = Math.max(mMissing, mWrong) / Math.max(1, Math.min(mMissing, mWrong));
    expect(ratio).toBeLessThan(10);
  });
});
