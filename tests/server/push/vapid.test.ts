import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../../helpers/db';
import { getVapidKeys } from '../../../src/lib/server/push/vapid';

describe('getVapidKeys', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('generates a new keypair on first call', async () => {
    const keys = await getVapidKeys(tdb.db);
    expect(keys.publicKey).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(keys.privateKey).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(keys.publicKey.length).toBeGreaterThan(60);
    expect(keys.privateKey.length).toBeGreaterThan(20);
  });

  it('returns the same keypair on subsequent calls (persisted)', async () => {
    const first = await getVapidKeys(tdb.db);
    const second = await getVapidKeys(tdb.db);
    expect(second.publicKey).toBe(first.publicKey);
    expect(second.privateKey).toBe(first.privateKey);
  });

  it('does not regenerate when both rows already exist', async () => {
    await getVapidKeys(tdb.db);
    const rowsBefore = tdb.sqlite.prepare("SELECT key FROM app_config WHERE key LIKE 'vapid_%'").all();
    await getVapidKeys(tdb.db);
    const rowsAfter = tdb.sqlite.prepare("SELECT key FROM app_config WHERE key LIKE 'vapid_%'").all();
    expect(rowsAfter.length).toBe(rowsBefore.length);
  });
});
