import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { getEntryForBabyDate, upsertEntry } from '../../src/lib/server/sleep-entries';

let globalTdb: ReturnType<typeof makeTestDb>;

vi.mock('$lib/server/db', () => ({
  getDb: () => globalTdb
}));

function setup(tdb: ReturnType<typeof makeTestDb>) {
  const t = Math.floor(Date.now() / 1000);
  const userId = Number(
    tdb.sqlite
      .prepare("INSERT INTO users (email, password_hash, is_admin, timezone, created_at, updated_at) VALUES ('a@x', 'x', 0, 'Europe/Paris', ?, ?)")
      .run(t, t).lastInsertRowid
  );
  const babyId = Number(
    tdb.sqlite
      .prepare("INSERT INTO babies (user_id, name, birth_date, created_at, updated_at) VALUES (?, 'Milo', '2025-11-13', ?, ?)")
      .run(userId, t, t).lastInsertRowid
  );
  return { userId, babyId };
}

function postSave(babyId: number, fields: Record<string, string>) {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.append(k, v);
  return new Request(`http://test/app/babies/${babyId}/today?/save`, { method: 'POST', body });
}

describe('today save action', () => {
  beforeEach(() => { globalTdb = makeTestDb(); });

  async function save(userId: number, babyId: number, fields: Record<string, string>) {
    const { actions } = await import('../../src/routes/app/babies/[id]/today/+page.server');
    return (actions.save as any)({
      request: postSave(babyId, fields),
      locals: { user: { id: userId, timezone: 'Europe/Paris' } },
      params: { id: String(babyId) }
    });
  }

  it('returns the fresh entry with the success message', async () => {
    const { userId, babyId } = setup(globalTdb);
    upsertEntry(globalTdb.db, babyId, '2026-11-16', { bedtime: '20:00' });
    const result = await save(userId, babyId, { date: '2026-11-16', wake_time: '06:40' });
    expect(typeof result.success).toBe('string');
    expect(result.entry).toMatchObject({ babyId, date: '2026-11-16', wakeTime: '06:40', bedtime: '20:00' });
  });

  it('refuses a missing or invalid date and writes nothing', async () => {
    const { userId, babyId } = setup(globalTdb);
    const posts: Record<string, string>[] = [{ wake_time: '06:40' }, { date: 'undefined', wake_time: '06:40' }, { date: '2026-02-30', wake_time: '06:40' }];
    for (const fields of posts) {
      const result = await save(userId, babyId, fields);
      expect(result).toMatchObject({ status: 400 });
      expect(typeof result.data.error).toBe('string');
    }
    const count = globalTdb.sqlite.prepare('SELECT COUNT(*) AS n FROM sleep_entries').get() as { n: number };
    expect(count.n).toBe(0);
    expect(getEntryForBabyDate(globalTdb.db, babyId, 'undefined')).toBeNull();
  });
});

describe('GET /api/babies/[id]/entries/[date]', () => {
  beforeEach(() => { globalTdb = makeTestDb(); });

  async function get(locals: unknown, id: number | string, date: string) {
    const { GET } = await import('../../src/routes/api/babies/[id]/entries/[date]/+server');
    return (GET as any)({ locals, params: { id: String(id), date } });
  }

  it('401s without a user', async () => {
    await expect(async () => { await get({}, 1, '2026-11-16'); }).rejects.toMatchObject({ status: 401 });
  });

  it('404s for a baby of another user', async () => {
    const { babyId } = setup(globalTdb);
    await expect(async () => {
      await get({ user: { id: 999 } }, babyId, '2026-11-16');
    }).rejects.toMatchObject({ status: 404 });
  });

  it('400s on a malformed date', async () => {
    const { userId, babyId } = setup(globalTdb);
    await expect(async () => {
      await get({ user: { id: userId } }, babyId, 'undefined');
    }).rejects.toMatchObject({ status: 400 });
  });

  it('returns the entry of that day', async () => {
    const { userId, babyId } = setup(globalTdb);
    upsertEntry(globalTdb.db, babyId, '2026-11-16', { wakeTime: '06:40' });
    const res: Response = await get({ user: { id: userId } }, babyId, '2026-11-16');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.entry).toMatchObject({ date: '2026-11-16', wakeTime: '06:40' });
  });

  it('returns a null entry for a day with nothing recorded', async () => {
    const { userId, babyId } = setup(globalTdb);
    const res: Response = await get({ user: { id: userId } }, babyId, '2026-11-15');
    expect(await res.json()).toEqual({ entry: null });
  });
});
