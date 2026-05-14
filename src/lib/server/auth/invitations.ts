import { eq, and, isNull, gt, desc } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export const INVITATION_TTL_SEC = 7 * 24 * 60 * 60;

export function createInvitation(db: DB, createdBy: number) {
  const t = Math.floor(Date.now() / 1000);
  const token = randomBytes(32).toString('base64url');
  const info = db.insert(schema.invitations).values({
    token,
    createdBy,
    expiresAt: t + INVITATION_TTL_SEC,
    createdAt: t
  }).returning().all()[0];
  return info;
}

export function findUsableInvitation(db: DB, token: string, now: number = Math.floor(Date.now() / 1000)) {
  const rows = db.select().from(schema.invitations)
    .where(and(eq(schema.invitations.token, token), isNull(schema.invitations.usedAt), gt(schema.invitations.expiresAt, now)))
    .all();
  return rows[0] ?? null;
}

export function markInvitationUsed(db: DB, invitationId: number, usedBy: number) {
  const t = Math.floor(Date.now() / 1000);
  db.update(schema.invitations)
    .set({ usedAt: t, usedBy })
    .where(eq(schema.invitations.id, invitationId))
    .run();
}

export function listInvitations(db: DB) {
  return db.select().from(schema.invitations)
    .orderBy(desc(schema.invitations.createdAt), desc(schema.invitations.id))
    .all();
}
