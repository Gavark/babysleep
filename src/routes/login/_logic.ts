import { eq } from 'drizzle-orm';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '$lib/server/db/schema';
import { hashPassword, verifyPassword, MAX_PASSWORD_LEN } from '$lib/server/auth/password';
import { createSession } from '$lib/server/auth/session';
import { normalizeEmail } from '$lib/server/auth/email';
import { rateLimit, clearRateLimit } from '$lib/server/rate-limit';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export type LoginResult =
  | { ok: true; user: schema.User; session: { id: string } }
  | { ok: false; reason: 'invalid' | 'rate_limited' };

// Failed attempts allowed per email address before it is locked for the rest
// of the window. Keyed by account rather than IP: behind Docker Desktop's NAT
// every client reaches the app from the same address, so an IP-only limit
// let a few wrong passwords lock everyone out. Unknown emails are counted
// the same way, so a lockout reveals nothing about which accounts exist.
export const LOGIN_MAX_FAILURES = 5;
export const LOGIN_FAILURE_WINDOW_SEC = 15 * 60;

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
  // Count the attempt before argon2, in the same synchronous step as the
  // check: concurrent requests can't all slip past while a hash is running,
  // and a locked account costs no hashing at all. A success clears the count
  // below, so only failures add up.
  const limitKey = `login:${email}`;
  if (!rateLimit(limitKey, LOGIN_MAX_FAILURES, LOGIN_FAILURE_WINDOW_SEC)) {
    return { ok: false, reason: 'rate_limited' };
  }
  const user = db.select().from(schema.users).where(eq(schema.users.email, email)).all()[0];
  // Always run verify against SOMETHING — real hash when user exists, a dummy
  // hash otherwise. Both paths spend ~100ms inside argon2id so response times
  // don't leak whether an email is registered.
  const hashToCheck = user?.passwordHash ?? (await getDummyHash());
  const ok = await verifyPassword(hashToCheck, password);
  if (!user || !ok) return { ok: false, reason: 'invalid' };
  clearRateLimit(limitKey);
  const session = createSession(db, user.id, userAgent);
  return { ok: true, user, session: { id: session.id } };
}
