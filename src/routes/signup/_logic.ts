import type { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import { hashPassword, isStrongEnough } from '$lib/server/auth/password';
import { findUsableInvitation, markInvitationUsed } from '$lib/server/auth/invitations';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export type SignupResult =
  | { ok: true; userId: number }
  | { ok: false; reason: 'bad-token' | 'weak-password' | 'duplicate-email' | 'invalid-email' };

export async function signupWithToken(
  db: DB,
  input: { token: string; email: string; password: string }
): Promise<SignupResult> {
  const token = String(input.token ?? '');
  const email = String(input.email ?? '').toLowerCase().trim();
  const password = String(input.password ?? '');

  if (!email.includes('@')) return { ok: false, reason: 'invalid-email' };
  if (!isStrongEnough(password)) return { ok: false, reason: 'weak-password' };

  const inv = findUsableInvitation(db, token);
  if (!inv) return { ok: false, reason: 'bad-token' };

  const existing = db.select().from(schema.users).where(eq(schema.users.email, email)).all()[0];
  if (existing) return { ok: false, reason: 'duplicate-email' };

  const hash = await hashPassword(password);
  const t = Math.floor(Date.now() / 1000);
  const row = db.insert(schema.users).values({
    email, passwordHash: hash, isAdmin: 0, createdAt: t, updatedAt: t
  }).returning().all()[0];
  markInvitationUsed(db, inv.id, row.id);
  return { ok: true, userId: row.id };
}
