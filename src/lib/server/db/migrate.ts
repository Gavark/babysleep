import 'dotenv/config';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { getDb } from './index';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const path = process.env.DATABASE_PATH ?? './data/babysleep.sqlite';
mkdirSync(dirname(path), { recursive: true });
const { db } = getDb();
migrate(db, { migrationsFolder: './drizzle' });
console.log('Migrations applied.');
