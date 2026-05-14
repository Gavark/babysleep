import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';
import { hashPassword, isStrongEnough } from './password';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export async function bootstrapAdmin(db: DB, env: { email?: string; password?: string }) {
  if (!env.email || !env.password) return;
  const count = db.select().from(schema.users).all().length;
  if (count > 0) return;
  if (!isStrongEnough(env.password)) {
    throw new Error('ADMIN_PASSWORD too weak (need ≥ 10 chars)');
  }
  const t = Math.floor(Date.now() / 1000);
  const hash = await hashPassword(env.password);
  db.insert(schema.users).values({
    email: env.email.toLowerCase().trim(),
    passwordHash: hash,
    isAdmin: 1,
    createdAt: t,
    updatedAt: t
  }).run();
}
