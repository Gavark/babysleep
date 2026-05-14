import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { bootstrapAdmin } from '../../src/lib/server/auth/bootstrap';

describe('bootstrapAdmin', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('creates admin if users table is empty', async () => {
    await bootstrapAdmin(tdb.db, { email: 'admin@x', password: '12345678ab' });
    const u = tdb.sqlite.prepare('SELECT * FROM users WHERE email = ?').get('admin@x') as any;
    expect(u.is_admin).toBe(1);
  });

  it('is a no-op if users table is not empty', async () => {
    tdb.sqlite.prepare(
      "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
    ).run('preexisting@x', 'x', 0, 0);
    await bootstrapAdmin(tdb.db, { email: 'admin@x', password: '12345678ab' });
    const count = tdb.sqlite.prepare('SELECT COUNT(*) AS n FROM users').get() as any;
    expect(count.n).toBe(1);
  });

  it('no-op if env vars are missing', async () => {
    await bootstrapAdmin(tdb.db, { email: undefined, password: undefined });
    const n = (tdb.sqlite.prepare('SELECT COUNT(*) AS n FROM users').get() as any).n;
    expect(n).toBe(0);
  });

  it('rejects weak password', async () => {
    await expect(bootstrapAdmin(tdb.db, { email: 'admin@x', password: 'short' })).rejects.toThrow();
  });
});
