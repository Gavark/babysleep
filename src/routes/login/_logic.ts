import { eq } from 'drizzle-orm';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '$lib/server/db/schema';
import { verifyPassword } from '$lib/server/auth/password';
import { createSession } from '$lib/server/auth/session';
import { normalizeEmail } from '$lib/server/auth/email';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export type LoginResult =
  | { ok: true; user: schema.User; session: { id: string } }
  | { ok: false; reason: 'invalid' };

export async function attemptLogin(
  db: DB,
  input: { email: string; password: string },
  userAgent: string | null
): Promise<LoginResult> {
  const email = normalizeEmail(input.email);
  const password = String(input.password ?? '');
  if (!email || !password) return { ok: false, reason: 'invalid' };
  const user = db.select().from(schema.users).where(eq(schema.users.email, email)).all()[0];
  if (!user) return { ok: false, reason: 'invalid' };
  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) return { ok: false, reason: 'invalid' };
  const session = createSession(db, user.id, userAgent);
  return { ok: true, user, session: { id: session.id } };
}
