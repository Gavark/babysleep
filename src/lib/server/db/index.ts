import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

export function createDb(path: string) {
  const sqlite = new Database(path);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('synchronous = NORMAL');
  const db = drizzle(sqlite, { schema });
  return { db, sqlite };
}

let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (_db) return _db;
  const path = process.env.DATABASE_PATH ?? './data/babysleep.sqlite';
  _db = createDb(path);
  return _db;
}

export { schema };
