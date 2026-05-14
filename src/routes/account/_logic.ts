import { eq } from 'drizzle-orm';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '$lib/server/db/schema';
import { hashPassword, verifyPassword, isStrongEnough } from '$lib/server/auth/password';
import { deleteOtherSessionsForUser } from '$lib/server/auth/session';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export type ChangeResult =
  | { ok: true }
  | { ok: false; reason: 'wrong-current' | 'mismatch' | 'weak' };

export async function changePassword(
  db: DB,
  userId: number,
  currentSessionId: string,
  input: { current: string; next: string; confirm: string }
): Promise<ChangeResult> {
  if (input.next !== input.confirm) return { ok: false, reason: 'mismatch' };
  if (!isStrongEnough(input.next)) return { ok: false, reason: 'weak' };
  const u = db.select().from(schema.users).where(eq(schema.users.id, userId)).all()[0];
  if (!u) return { ok: false, reason: 'wrong-current' };
  if (!(await verifyPassword(u.passwordHash, input.current))) return { ok: false, reason: 'wrong-current' };
  const hash = await hashPassword(input.next);
  const t = Math.floor(Date.now() / 1000);
  db.update(schema.users).set({ passwordHash: hash, updatedAt: t }).where(eq(schema.users.id, userId)).run();
  deleteOtherSessionsForUser(db, userId, currentSessionId);
  return { ok: true };
}
