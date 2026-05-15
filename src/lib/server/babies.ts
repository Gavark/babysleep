import { and, eq } from 'drizzle-orm';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './db/schema';
import { isValidTimezone } from '$lib/tz';

type DB = ReturnType<typeof drizzle<typeof schema>>;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HH_MM = /^([01]\d|2[0-3]):([0-5]\d)$/;

function validateDesiredWakeTime(v: string | null | undefined): string | null {
  if (v == null || v === '') return null;
  if (!HH_MM.test(v)) throw new Error('desiredWakeTime must be HH:MM');
  return v;
}

function validateTimezone(v: string | null | undefined): string | null {
  if (v == null || v === '') return null;
  if (!isValidTimezone(v)) throw new Error('Invalid timezone');
  return v;
}

export function createBaby(
  db: DB,
  userId: number,
  input: { name: string; birthDate: string; ageOverrideMonths: number | null; desiredWakeTime?: string | null; timezone?: string | null }
) {
  const name = String(input.name ?? '').trim();
  if (!name) throw new Error('name required');
  if (!ISO_DATE.test(input.birthDate)) throw new Error('birthDate must be YYYY-MM-DD');
  const desiredWakeTime = validateDesiredWakeTime(input.desiredWakeTime);
  const timezone = validateTimezone(input.timezone);
  const t = Math.floor(Date.now() / 1000);
  return db.insert(schema.babies).values({
    userId, name, birthDate: input.birthDate, ageOverrideMonths: input.ageOverrideMonths,
    desiredWakeTime, timezone,
    createdAt: t, updatedAt: t
  }).returning().all()[0];
}

export function listBabies(db: DB, userId: number) {
  return db.select().from(schema.babies).where(eq(schema.babies.userId, userId)).all();
}

export function getBabyForUser(db: DB, userId: number, babyId: number) {
  return db.select().from(schema.babies)
    .where(and(eq(schema.babies.id, babyId), eq(schema.babies.userId, userId)))
    .all()[0] ?? null;
}

export function updateBaby(
  db: DB,
  userId: number,
  babyId: number,
  patch: Partial<{ name: string; birthDate: string; ageOverrideMonths: number | null; desiredWakeTime: string | null; timezone: string | null }>
): boolean {
  const owned = getBabyForUser(db, userId, babyId);
  if (!owned) return false;
  if (patch.birthDate && !ISO_DATE.test(patch.birthDate)) throw new Error('birthDate must be YYYY-MM-DD');
  if ('desiredWakeTime' in patch) {
    patch = { ...patch, desiredWakeTime: validateDesiredWakeTime(patch.desiredWakeTime) };
  }
  if ('timezone' in patch) {
    patch = { ...patch, timezone: validateTimezone(patch.timezone) };
  }
  const t = Math.floor(Date.now() / 1000);
  db.update(schema.babies).set({ ...patch, updatedAt: t }).where(eq(schema.babies.id, babyId)).run();
  return true;
}

export function deleteBaby(db: DB, userId: number, babyId: number): boolean {
  const owned = getBabyForUser(db, userId, babyId);
  if (!owned) return false;
  db.delete(schema.babies).where(eq(schema.babies.id, babyId)).run();
  return true;
}
