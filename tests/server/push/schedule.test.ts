import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../../helpers/db';
import { recomputeNextPush } from '../../../src/lib/server/push/schedule';
import { upsertEntry } from '../../../src/lib/server/sleep-entries';
import { isNull, and, eq } from 'drizzle-orm';
import * as schema from '../../../src/lib/server/db/schema';

function seed(tdb: ReturnType<typeof makeTestDb>) {
  const t = Math.floor(Date.now() / 1000);
  const u = Number(tdb.sqlite.prepare("INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES ('a@x', 'x', 0, ?, ?)").run(t, t).lastInsertRowid);
  // birth date such that the baby is in the 6-9 month bracket TODAY:
  // 6 months ago = today - 180 days approx
  const birth = new Date(Date.now() - 200 * 86_400_000).toISOString().slice(0, 10);
  const b = Number(tdb.sqlite.prepare("INSERT INTO babies (user_id, name, birth_date, created_at, updated_at) VALUES (?, 'L', ?, ?, ?)").run(u, birth, t, t).lastInsertRowid);
  return { userId: u, babyId: b };
}

function pendingFor(tdb: ReturnType<typeof makeTestDb>, babyId: number) {
  return tdb.db.select().from(schema.scheduledPushes)
    .where(and(
      eq(schema.scheduledPushes.babyId, babyId),
      isNull(schema.scheduledPushes.firedAt),
      isNull(schema.scheduledPushes.cancelledAt)
    ))
    .all();
}

function allFor(tdb: ReturnType<typeof makeTestDb>, babyId: number) {
  return tdb.db.select().from(schema.scheduledPushes)
    .where(eq(schema.scheduledPushes.babyId, babyId))
    .all();
}

describe('recomputeNextPush', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  let babyId: number;
  beforeEach(() => {
    tdb = makeTestDb();
    babyId = seed(tdb).babyId;
  });

  // Use a wake_time that's "now-ish" so fire_at is in the future for today.
  // Picking 23:50 of today is risky around midnight, so we use a date that's
  // strictly the future from "fire_at calculation" perspective.
  it('inserts a pending row when wake_time is the only event', () => {
    const today = new Date().toISOString().slice(0, 10);
    // Set wake to one minute from now, so fire_at = now + 1 + 135 min = ~2h16 in the future
    const now = new Date();
    const wakeMin = now.getHours() * 60 + now.getMinutes() + 1;
    const hh = String(Math.floor(wakeMin / 60) % 24).padStart(2, '0');
    const mm = String(wakeMin % 60).padStart(2, '0');
    const wakeTime = `${hh}:${mm}`;

    upsertEntry(tdb.db, babyId, today, { wakeTime });
    recomputeNextPush(tdb.db, babyId, today);

    const pending = pendingFor(tdb, babyId);
    expect(pending.length).toBe(1);
    expect(pending[0].kind).toBe('wake_window_exceeded');
    expect(pending[0].fireAt).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('cancels prior pending and inserts new one when nap1 ends', () => {
    const today = new Date().toISOString().slice(0, 10);
    // Use times that produce a future fire_at: nap1End at now+1min → fire = now+1+165
    const now = new Date();
    const wakeMin = now.getHours() * 60 + now.getMinutes() - 60; // wake an hour ago
    const wakeHH = String(Math.max(0, Math.floor(wakeMin / 60)) % 24).padStart(2, '0');
    const wakeMM = String(((wakeMin % 60) + 60) % 60).padStart(2, '0');
    const nap1Min = now.getHours() * 60 + now.getMinutes() + 1;
    const nap1EndHH = String(Math.floor(nap1Min / 60) % 24).padStart(2, '0');
    const nap1EndMM = String(nap1Min % 60).padStart(2, '0');

    upsertEntry(tdb.db, babyId, today, { wakeTime: `${wakeHH}:${wakeMM}` });
    recomputeNextPush(tdb.db, babyId, today);

    upsertEntry(tdb.db, babyId, today, { nap1Start: '08:00', nap1End: `${nap1EndHH}:${nap1EndMM}` });
    recomputeNextPush(tdb.db, babyId, today);

    expect(pendingFor(tdb, babyId).length).toBe(1); // at most one active
    const cancelled = allFor(tdb, babyId).filter(r => r.cancelledAt !== null);
    expect(cancelled.length).toBeGreaterThanOrEqual(1);
  });

  it('cancels pending when nap is in progress (no end yet)', () => {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const wakeMin = now.getHours() * 60 + now.getMinutes() + 1;
    const wakeHH = String(Math.floor(wakeMin / 60) % 24).padStart(2, '0');
    const wakeMM = String(wakeMin % 60).padStart(2, '0');

    upsertEntry(tdb.db, babyId, today, { wakeTime: `${wakeHH}:${wakeMM}` });
    recomputeNextPush(tdb.db, babyId, today);

    upsertEntry(tdb.db, babyId, today, { nap1Start: '09:00' });
    recomputeNextPush(tdb.db, babyId, today);

    expect(pendingFor(tdb, babyId).length).toBe(0);
  });

  it('cancels pending when bedtime is saved', () => {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const nap1Min = now.getHours() * 60 + now.getMinutes() + 1;
    const nap1EndHH = String(Math.floor(nap1Min / 60) % 24).padStart(2, '0');
    const nap1EndMM = String(nap1Min % 60).padStart(2, '0');

    upsertEntry(tdb.db, babyId, today, { wakeTime: '07:00', nap1Start: '08:00', nap1End: `${nap1EndHH}:${nap1EndMM}` });
    recomputeNextPush(tdb.db, babyId, today);
    expect(pendingFor(tdb, babyId).length).toBe(1);

    upsertEntry(tdb.db, babyId, today, { bedtime: '20:00' });
    recomputeNextPush(tdb.db, babyId, today);

    expect(pendingFor(tdb, babyId).length).toBe(0);
  });

  it('does not insert when fire_at is in the past (editing yesterday)', () => {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    upsertEntry(tdb.db, babyId, yesterday, { wakeTime: '07:00' });
    recomputeNextPush(tdb.db, babyId, yesterday);

    expect(pendingFor(tdb, babyId).length).toBe(0);
  });

  it('produces at most one pending row across multiple successive recomputes', () => {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const wakeMin = now.getHours() * 60 + now.getMinutes() + 1;
    const wakeHH = String(Math.floor(wakeMin / 60) % 24).padStart(2, '0');
    const wakeMM = String(wakeMin % 60).padStart(2, '0');

    upsertEntry(tdb.db, babyId, today, { wakeTime: `${wakeHH}:${wakeMM}` });
    recomputeNextPush(tdb.db, babyId, today);
    recomputeNextPush(tdb.db, babyId, today);
    recomputeNextPush(tdb.db, babyId, today);
    expect(pendingFor(tdb, babyId).length).toBe(1);
  });
});
