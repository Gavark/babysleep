import { describe, it, expect } from 'vitest';
import { makeTestDb } from '../helpers/db';

describe('makeTestDb', () => {
  it('creates a working in-memory DB with all tables', () => {
    const { sqlite } = makeTestDb();
    const tables = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all() as { name: string }[];
    const names = tables.map((t) => t.name).filter((n) => !n.startsWith('__'));
    expect(names).toEqual(expect.arrayContaining(['users', 'sessions', 'invitations', 'babies', 'sleep_entries']));
  });
});
