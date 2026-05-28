import type { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import { hashPassword, isStrongEnough } from '$lib/server/auth/password';
import { findUsableInvitation, markInvitationUsed } from '$lib/server/auth/invitations';
import { normalizeEmail, isValidEmail } from '$lib/server/auth/email';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export type SignupResult =
  | { ok: true; userId: number }
  | { ok: false; reason: 'bad-token' | 'weak-password' | 'duplicate-email' | 'invalid-email' };

export async function signupWithToken(
  db: DB,
  input: { token: string; email: string; password: string }
): Promise<SignupResult> {
  const token = String(input.token ?? '');
  const email = normalizeEmail(input.email);
  const password = String(input.password ?? '');

  if (!isValidEmail(email)) return { ok: false, reason: 'invalid-email' };
  if (!isStrongEnough(password)) return { ok: false, reason: 'weak-password' };

  // Hash outside the transaction (argon2id is slow + async; better-sqlite3 transactions are sync).
  const hash = await hashPassword(password);
  const t = Math.floor(Date.now() / 1000);

  // Atomic critical section: re-check invitation + duplicate email + insert + mark-used.
  // SQLite serialises transactions, so two concurrent calls with the same token
  // cannot both succeed.
  return db.transaction((tx) => {
    const inv = findUsableInvitation(tx, token);
    if (!inv) return { ok: false, reason: 'bad-token' as const };

    const existing = tx.select().from(schema.users).where(eq(schema.users.email, email)).all()[0];
    if (existing) return { ok: false, reason: 'duplicate-email' as const };

    const row = tx.insert(schema.users).values({
      email, passwordHash: hash, isAdmin: 0, createdAt: t, updatedAt: t
    }).returning().all()[0];
    markInvitationUsed(tx, inv.id, row.id);
    return { ok: true, userId: row.id };
  });
}
