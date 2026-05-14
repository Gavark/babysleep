import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import {
  upsertEntry,
  getEntryForBabyDate,
  listEntriesInRange,
  summariesForBaby
} from '../../src/lib/server/sleep-entries';

function setup(tdb: ReturnType<typeof makeTestDb>) {
  const t = Math.floor(Date.now() / 1000);
  const u = Number(tdb.sqlite.prepare("INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES ('a@x', 'x', 0, ?, ?)").run(t, t).lastInsertRowid);
  const b = Number(tdb.sqlite.prepare("INSERT INTO babies (user_id, name, birth_date, created_at, updated_at) VALUES (?, 'L', '2025-01-15', ?, ?)").run(u, t, t).lastInsertRowid);
  return { userId: u, babyId: b };
}

describe('sleep-entries', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('upsertEntry inserts then updates the same (baby, date)', () => {
    const { babyId } = setup(tdb);
    upsertEntry(tdb.db, babyId, '2025-07-15', { wakeTime: '07:00', notes: 'ok' });
    upsertEntry(tdb.db, babyId, '2025-07-15', { wakeTime: '07:30' });
    const row = getEntryForBabyDate(tdb.db, babyId, '2025-07-15');
    expect(row?.wakeTime).toBe('07:30');
    expect(row?.notes).toBe('ok');
  });

  it('listEntriesInRange returns entries between from..to inclusive desc', () => {
    const { babyId } = setup(tdb);
    upsertEntry(tdb.db, babyId, '2025-07-15', { wakeTime: '07:00' });
    upsertEntry(tdb.db, babyId, '2025-07-16', { wakeTime: '07:30' });
    upsertEntry(tdb.db, babyId, '2025-07-20', { wakeTime: '08:00' });
    const r = listEntriesInRange(tdb.db, babyId, '2025-07-15', '2025-07-17');
    expect(r.map((e) => e.date)).toEqual(['2025-07-16', '2025-07-15']);
  });

  it('summariesForBaby computes mean wake/bedtime in HH:MM', () => {
    const { babyId } = setup(tdb);
    upsertEntry(tdb.db, babyId, '2025-07-15', { wakeTime: '07:00', bedtime: '20:00' });
    upsertEntry(tdb.db, babyId, '2025-07-16', { wakeTime: '07:30', bedtime: '20:30' });
    const s = summariesForBaby(tdb.db, babyId, '2025-07-15', '2025-07-31');
    expect(s.entryCount).toBe(2);
    expect(s.meanWakeHHMM).toBe('07:15');
    expect(s.meanBedtimeHHMM).toBe('20:15');
  });

  it('handles bedtimes that cross midnight (circular mean)', () => {
    const { babyId } = setup(tdb);
    upsertEntry(tdb.db, babyId, '2025-07-15', { wakeTime: '07:00', bedtime: '23:30' });
    upsertEntry(tdb.db, babyId, '2025-07-16', { wakeTime: '07:00', bedtime: '00:30' });
    const s = summariesForBaby(tdb.db, babyId, '2025-07-15', '2025-07-31');
    expect(s.meanBedtimeHHMM).toBe('00:00');
  });

  it('summariesForBaby computes mean day-sleep duration from start/end pairs', () => {
    const { babyId } = setup(tdb);
    upsertEntry(tdb.db, babyId, '2026-05-12', {
      nap1Start: '09:00', nap1End: '10:00',
      nap2Start: '13:00', nap2End: '14:30'
    });
    upsertEntry(tdb.db, babyId, '2026-05-13', {
      nap1Start: '09:15', nap1End: '10:15',
      nap2Start: '13:15', nap2End: '14:15'
    });
    const s = summariesForBaby(tdb.db, babyId, '2026-05-01', '2026-05-31');
    // Day 1: 1h + 1h30 = 2h30 = 150 min. Day 2: 1h + 1h = 120 min. Mean = 135 min = 02:15.
    expect(s.meanDaySleepHHMM).toBe('02:15');
  });
});
