import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { createBaby, listBabies, getBabyForUser, updateBaby, deleteBaby } from '../../src/lib/server/babies';

function mkUser(tdb: ReturnType<typeof makeTestDb>, email = 'a@x'): number {
  const t = Math.floor(Date.now() / 1000);
  return Number(tdb.sqlite.prepare(
    "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, 'x', 0, ?, ?)"
  ).run(email, t, t).lastInsertRowid);
}

describe('babies', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('creates and lists babies scoped per user', () => {
    const u1 = mkUser(tdb, 'a@x');
    const u2 = mkUser(tdb, 'b@x');
    createBaby(tdb.db, u1, { name: 'Léa', birthDate: '2025-01-15', ageOverrideMonths: null });
    createBaby(tdb.db, u1, { name: 'Tom', birthDate: '2023-06-01', ageOverrideMonths: null });
    createBaby(tdb.db, u2, { name: 'Mia', birthDate: '2024-09-09', ageOverrideMonths: 6 });
    expect(listBabies(tdb.db, u1).map((b) => b.name).sort()).toEqual(['Léa', 'Tom']);
    expect(listBabies(tdb.db, u2).map((b) => b.name)).toEqual(['Mia']);
  });

  it('getBabyForUser returns null if owned by another user', () => {
    const u1 = mkUser(tdb, 'a@x');
    const u2 = mkUser(tdb, 'b@x');
    const b = createBaby(tdb.db, u1, { name: 'L', birthDate: '2025-01-15', ageOverrideMonths: null });
    expect(getBabyForUser(tdb.db, u1, b.id)).not.toBeNull();
    expect(getBabyForUser(tdb.db, u2, b.id)).toBeNull();
  });

  it('rejects invalid birth date', () => {
    const u = mkUser(tdb);
    expect(() => createBaby(tdb.db, u, { name: 'X', birthDate: 'pas-une-date', ageOverrideMonths: null })).toThrow();
  });

  it('updateBaby only succeeds for owner', () => {
    const u1 = mkUser(tdb, 'a@x');
    const u2 = mkUser(tdb, 'b@x');
    const b = createBaby(tdb.db, u1, { name: 'A', birthDate: '2025-01-15', ageOverrideMonths: null });
    expect(updateBaby(tdb.db, u2, b.id, { name: 'B' })).toBe(false);
    expect(updateBaby(tdb.db, u1, b.id, { name: 'B' })).toBe(true);
    expect(getBabyForUser(tdb.db, u1, b.id)?.name).toBe('B');
  });

  it('deleteBaby cascades to sleep_entries', () => {
    const u = mkUser(tdb);
    const b = createBaby(tdb.db, u, { name: 'X', birthDate: '2025-01-15', ageOverrideMonths: null });
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO sleep_entries (baby_id, date, created_at, updated_at) VALUES (?, '2025-07-15', ?, ?)"
    ).run(b.id, t, t);
    deleteBaby(tdb.db, u, b.id);
    const n = (tdb.sqlite.prepare('SELECT COUNT(*) AS n FROM sleep_entries WHERE baby_id = ?').get(b.id) as any).n;
    expect(n).toBe(0);
  });
});
