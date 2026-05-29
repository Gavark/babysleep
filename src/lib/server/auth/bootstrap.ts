import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import * as schema from '../db/schema';
import { hashPassword, isStrongEnough } from './password';
import { normalizeEmail, isValidEmail } from './email';

// Widened so transaction-scoped handles passed in by db.transaction(...) also satisfy it.
type DB = BaseSQLiteDatabase<'sync', unknown, typeof schema>;

/** True when the users table is empty (i.e. first-run / wizard mode). */
export function hasNoUsers(db: DB): boolean {
  return db.select().from(schema.users).all().length === 0;
}

export async function bootstrapAdmin(db: DB, env: { email?: string; password?: string }) {
  if (!env.email || !env.password) return;
  if (!hasNoUsers(db)) return;
  if (!isStrongEnough(env.password)) {
    throw new Error('ADMIN_PASSWORD too weak (need ≥ 10 chars)');
  }
  const t = Math.floor(Date.now() / 1000);
  const hash = await hashPassword(env.password);
  db.insert(schema.users).values({
    email: normalizeEmail(env.email),
    passwordHash: hash,
    isAdmin: 1,
    createdAt: t,
    updatedAt: t
  }).run();
}

export type CreateFirstAdminResult =
  | { ok: true; userId: number }
  | { ok: false; reason: 'already-setup' | 'invalid-email' | 'weak-password' };

/**
 * Wizard-driven counterpart to bootstrapAdmin. Refuses if any user already
 * exists so the endpoint cannot be replayed to take over an existing instance.
 */
export async function createFirstAdmin(
  db: DB,
  input: { email: string; password: string }
): Promise<CreateFirstAdminResult> {
  if (!hasNoUsers(db)) return { ok: false, reason: 'already-setup' };
  const email = normalizeEmail(input.email);
  const password = String(input.password ?? '');
  if (!isValidEmail(email)) return { ok: false, reason: 'invalid-email' };
  if (!isStrongEnough(password)) return { ok: false, reason: 'weak-password' };

  const hash = await hashPassword(password);
  const t = Math.floor(Date.now() / 1000);

  // SQLite serialises the transaction so two parallel POSTs cannot both
  // create a user. The hasNoUsers re-check inside protects against a race
  // between the load-side `redirect-if-already-set-up` and the action.
  return db.transaction((tx) => {
    if (!hasNoUsers(tx)) return { ok: false, reason: 'already-setup' as const };
    const row = tx.insert(schema.users).values({
      email, passwordHash: hash, isAdmin: 1, createdAt: t, updatedAt: t
    }).returning().all()[0];
    return { ok: true, userId: row.id };
  });
}
