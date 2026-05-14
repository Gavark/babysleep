import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { buildSleepCsv } from '../../src/lib/server/csv';
import { listEntriesInRange, upsertEntry } from '../../src/lib/server/sleep-entries';

describe('CSV export pipeline', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('produces a non-empty CSV for one entry', () => {
    const t = Math.floor(Date.now() / 1000);
    const u = Number(tdb.sqlite.prepare("INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES ('a@x', 'x', 0, ?, ?)").run(t, t).lastInsertRowid);
    const b = Number(tdb.sqlite.prepare("INSERT INTO babies (user_id, name, birth_date, created_at, updated_at) VALUES (?, 'Léa', '2025-01-15', ?, ?)").run(u, t, t).lastInsertRowid);
    upsertEntry(tdb.db, b, '2025-07-15', { wakeTime: '07:00', bedtime: '20:00' });
    const rows = listEntriesInRange(tdb.db, b, '2025-07-01', '2025-07-31');
    const csv = buildSleepCsv(rows, 'Léa');
    expect(csv).toContain('2025-07-15');
    expect(csv).toContain('07:00');
  });
});
