import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { upsertEntry } from '../../src/lib/server/sleep-entries';

let globalTdb: ReturnType<typeof makeTestDb>;

vi.mock('$lib/server/db', () => ({
  getDb: () => globalTdb
}));

async function loadRoute() {
  return await import('../../src/routes/app/babies/[id]/calendar/+page.server');
}

function setup(tdb: ReturnType<typeof makeTestDb>) {
  const t = Math.floor(Date.now() / 1000);
  const userId = Number(
    tdb.sqlite
      .prepare(
        "INSERT INTO users (email, password_hash, is_admin, timezone, created_at, updated_at) VALUES ('a@x', 'x', 0, 'Europe/Paris', ?, ?)"
      )
      .run(t, t).lastInsertRowid
  );
  const babyId = Number(
    tdb.sqlite
      .prepare(
        "INSERT INTO babies (user_id, name, birth_date, created_at, updated_at) VALUES (?, 'Milo', '2025-11-13', ?, ?)"
      )
      .run(userId, t, t).lastInsertRowid
  );
  return { userId, babyId };
}

describe('calendar load', () => {
  beforeEach(() => { globalTdb = makeTestDb(); });

  it('redirects to /login if no user', async () => {
    const { load } = await loadRoute();
    const event = {
      locals: {},
      params: { id: '1' },
      url: new URL('http://test/app/babies/1/calendar')
    } as any;
    await expect(async () => { await (load as any)(event); }).rejects.toMatchObject({ status: 303, location: '/login' });
  });

  it('404s if baby does not belong to user', async () => {
    setup(globalTdb);
    const { load } = await loadRoute();
    const event = {
      locals: { user: { id: 999, timezone: 'Europe/Paris' } },
      params: { id: '1' },
      url: new URL('http://test/app/babies/1/calendar')
    } as any;
    await expect(async () => { await (load as any)(event); }).rejects.toMatchObject({ status: 404 });
  });

  it('returns month grid cells with entries for the requested month', async () => {
    const { userId, babyId } = setup(globalTdb);
    upsertEntry(globalTdb.db, babyId, '2026-05-13', { wakeTime: '07:00', bedtime: '20:00' });
    const { load } = await loadRoute();
    const event = {
      locals: { user: { id: userId, timezone: 'Europe/Paris' } },
      params: { id: String(babyId) },
      url: new URL(`http://test/app/babies/${babyId}/calendar?month=2026-05`)
    } as any;
    const data = (await (load as any)(event)) as any;
    expect(data.baby.id).toBe(babyId);
    expect(data.year).toBe(2026);
    expect(data.month).toBe(5);
    expect(data.cells.length % 7).toBe(0);
    const may13 = data.cells.find((c: any) => c.date === '2026-05-13');
    expect(may13).toBeTruthy();
    expect(may13.hasAnyData).toBe(true);
    expect(may13.wakeTime).toBe('07:00');
    expect(may13.inMonth).toBe(true);
  });

  it('falls back to current month when ?month is missing or invalid', async () => {
    const { userId, babyId } = setup(globalTdb);
    const { load } = await loadRoute();
    const event = {
      locals: { user: { id: userId, timezone: 'Europe/Paris' } },
      params: { id: String(babyId) },
      url: new URL(`http://test/app/babies/${babyId}/calendar?month=invalid`)
    } as any;
    const data = (await (load as any)(event)) as any;
    expect(data.year).toBeGreaterThanOrEqual(2024);
    expect(data.month).toBeGreaterThanOrEqual(1);
    expect(data.month).toBeLessThanOrEqual(12);
  });
});
