import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import {
  createInvitation,
  findUsableInvitation,
  markInvitationUsed,
  listInvitations,
  INVITATION_TTL_SEC
} from '../../src/lib/server/auth/invitations';

function makeAdmin(tdb: ReturnType<typeof makeTestDb>) {
  const t = Math.floor(Date.now() / 1000);
  const info = tdb.sqlite.prepare(
    "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 1, ?, ?)"
  ).run('admin@x', 'x', t, t);
  return Number(info.lastInsertRowid);
}

describe('invitations', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('createInvitation generates a unique token with 7-day expiry', () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    expect(inv.token.length).toBeGreaterThan(20);
    expect(inv.expiresAt - inv.createdAt).toBe(INVITATION_TTL_SEC);
  });

  it('findUsableInvitation returns it if not used and not expired', () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    expect(findUsableInvitation(tdb.db, inv.token)).not.toBeNull();
  });

  it('returns null for unknown token', () => {
    expect(findUsableInvitation(tdb.db, 'nope')).toBeNull();
  });

  it('returns null for expired token', () => {
    const adminId = makeAdmin(tdb);
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO invitations (token, created_by, expires_at, created_at) VALUES (?, ?, ?, ?)"
    ).run('xxx', adminId, t - 10, t - 1000);
    expect(findUsableInvitation(tdb.db, 'xxx')).toBeNull();
  });

  it('returns null for used token', () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    markInvitationUsed(tdb.db, inv.id, adminId);
    expect(findUsableInvitation(tdb.db, inv.token)).toBeNull();
  });

  it('listInvitations returns all, newest first', () => {
    const adminId = makeAdmin(tdb);
    const a = createInvitation(tdb.db, adminId);
    const b = createInvitation(tdb.db, adminId);
    const all = listInvitations(tdb.db);
    expect(all).toHaveLength(2);
    expect(all[0].id).toBe(b.id);
    expect(all[1].id).toBe(a.id);
  });
});
