import { eq, and, lt, ne } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export const SESSION_TTL_SEC = 30 * 24 * 60 * 60;     // 30 days
export const SESSION_HARD_CAP_SEC = 90 * 24 * 60 * 60; // 90 days

function nowSec() { return Math.floor(Date.now() / 1000); }

function generateId(): string {
  return randomBytes(32).toString('base64url');
}

export function createSession(db: DB, userId: number, userAgent: string | null) {
  const t = nowSec();
  const id = generateId();
  db.insert(schema.sessions).values({
    id,
    userId,
    expiresAt: t + SESSION_TTL_SEC,
    lastUsedAt: t,
    userAgent,
    createdAt: t
  }).run();
  return { id, userId, expiresAt: t + SESSION_TTL_SEC, lastUsedAt: t, userAgent, createdAt: t };
}

export function getSessionWithUser(db: DB, sessionId: string, now: number = nowSec()) {
  const rows = db
    .select({ session: schema.sessions, user: schema.users })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
    .where(eq(schema.sessions.id, sessionId))
    .all();
  const row = rows[0];
  if (!row) return null;
  if (row.session.expiresAt <= now) return null;
  return row;
}

export function refreshSessionIfStale(db: DB, sessionId: string, now: number = nowSec()) {
  const row = db.select().from(schema.sessions).where(eq(schema.sessions.id, sessionId)).all()[0];
  if (!row) return;
  if (now - row.createdAt >= SESSION_HARD_CAP_SEC) {
    db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId)).run();
    return;
  }
  if (now - row.lastUsedAt < 24 * 3600) return;
  db.update(schema.sessions)
    .set({ lastUsedAt: now, expiresAt: now + SESSION_TTL_SEC })
    .where(eq(schema.sessions.id, sessionId))
    .run();
}

export function deleteSession(db: DB, sessionId: string) {
  db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId)).run();
}

export function deleteOtherSessionsForUser(db: DB, userId: number, keepSessionId: string) {
  db.delete(schema.sessions)
    .where(and(eq(schema.sessions.userId, userId), ne(schema.sessions.id, keepSessionId)))
    .run();
}

export function listSessionsForUser(db: DB, userId: number) {
  return db.select().from(schema.sessions).where(eq(schema.sessions.userId, userId)).all();
}

export function purgeExpiredSessions(db: DB, now: number = nowSec()) {
  db.delete(schema.sessions).where(lt(schema.sessions.expiresAt, now)).run();
}
