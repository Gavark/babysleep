import { eq } from 'drizzle-orm';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '$lib/server/db/schema';
import { hashPassword, verifyPassword, MAX_PASSWORD_LEN } from '$lib/server/auth/password';
import { createSession } from '$lib/server/auth/session';
import { normalizeEmail } from '$lib/server/auth/email';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export type LoginResult =
  | { ok: true; user: schema.User; session: { id: string } }
  | { ok: false; reason: 'invalid' };

// Pre-computed at first login so that the "user not found" path still runs
// argon2id verify against SOME hash, preventing timing-based email enumeration.
// Cached as a Promise so concurrent first calls share the single computation.
let dummyHashPromise: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  if (!dummyHashPromise) {
    dummyHashPromise = hashPassword('this-is-not-a-real-account-pad-for-constant-time-login');
  }
  return dummyHashPromise;
}

export async function attemptLogin(
  db: DB,
  input: { email: string; password: string },
  userAgent: string | null
): Promise<LoginResult> {
  const email = normalizeEmail(input.email);
  const password = String(input.password ?? '');
  if (!email || !password) return { ok: false, reason: 'invalid' };
  // Reject pathologically long passwords before they reach argon2 — without
  // this, /login becomes a CPU oracle (each request worth N MB of hashing).
  // Doesn't reveal anything about email existence so the timing-safe path
  // is preserved.
  if (password.length > MAX_PASSWORD_LEN) return { ok: false, reason: 'invalid' };
  const user = db.select().from(schema.users).where(eq(schema.users.email, email)).all()[0];
  // Always run verify against SOMETHING — real hash when user exists, a dummy
  // hash otherwise. Both paths spend ~100ms inside argon2id so response times
  // don't leak whether an email is registered.
  const hashToCheck = user?.passwordHash ?? (await getDummyHash());
  const ok = await verifyPassword(hashToCheck, password);
  if (!user || !ok) return { ok: false, reason: 'invalid' };
  const session = createSession(db, user.id, userAgent);
  return { ok: true, user, session: { id: session.id } };
}
