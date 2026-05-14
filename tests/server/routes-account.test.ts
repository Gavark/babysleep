import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { hashPassword } from '../../src/lib/server/auth/password';
import { changePassword } from '../../src/routes/account/_logic';

async function makeUser(tdb: ReturnType<typeof makeTestDb>, pw: string) {
  const hash = await hashPassword(pw);
  const t = Math.floor(Date.now() / 1000);
  const info = tdb.sqlite.prepare(
    "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
  ).run('alice@x', hash, t, t);
  return Number(info.lastInsertRowid);
}

describe('changePassword', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('rejects wrong current password', async () => {
    const uid = await makeUser(tdb, 'helloworld1');
    const r = await changePassword(tdb.db, uid, 'current-session', {
      current: 'WRONG', next: '1234567890', confirm: '1234567890'
    });
    expect(r.ok).toBe(false);
  });

  it('rejects mismatched confirm', async () => {
    const uid = await makeUser(tdb, 'helloworld1');
    const r = await changePassword(tdb.db, uid, 'current-session', {
      current: 'helloworld1', next: 'AAAAAAAAAA', confirm: 'BBBBBBBBBB'
    });
    expect(r.ok).toBe(false);
  });

  it('rejects weak new password', async () => {
    const uid = await makeUser(tdb, 'helloworld1');
    const r = await changePassword(tdb.db, uid, 'current-session', {
      current: 'helloworld1', next: 'short', confirm: 'short'
    });
    expect(r.ok).toBe(false);
  });

  it('on success: updates hash + deletes other sessions, keeps current', async () => {
    const uid = await makeUser(tdb, 'helloworld1');
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO sessions (id, user_id, expires_at, last_used_at, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run('current', uid, t + 1000, t, 'a', t);
    tdb.sqlite.prepare(
      "INSERT INTO sessions (id, user_id, expires_at, last_used_at, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run('other', uid, t + 1000, t, 'b', t);
    const r = await changePassword(tdb.db, uid, 'current', {
      current: 'helloworld1', next: 'AAAAAAAAAA1', confirm: 'AAAAAAAAAA1'
    });
    expect(r.ok).toBe(true);
    const rows = tdb.sqlite.prepare('SELECT id FROM sessions WHERE user_id = ?').all(uid) as any[];
    expect(rows.map((r) => r.id)).toEqual(['current']);
  });
}, 60_000);
