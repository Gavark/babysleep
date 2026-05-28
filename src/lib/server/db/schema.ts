import { sqliteTable, integer, text, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  isAdmin: integer('is_admin').notNull().default(0),
  timezone: text('timezone').notNull().default('Europe/Paris'),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`)
});

export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: integer('expires_at').notNull(),
    lastUsedAt: integer('last_used_at').notNull(),
    userAgent: text('user_agent'),
    createdAt: integer('created_at').notNull().default(sql`(unixepoch())`)
  },
  (t) => ({
    expIdx: index('sessions_expires_at').on(t.expiresAt),
    userIdx: index('sessions_user_id').on(t.userId)
  })
);

export const invitations = sqliteTable('invitations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  token: text('token').notNull().unique(),
  createdBy: integer('created_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
  usedAt: integer('used_at'),
  usedBy: integer('used_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`)
});

export const babies = sqliteTable(
  'babies',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    birthDate: text('birth_date').notNull(),
    ageOverrideMonths: integer('age_override_months'),
    desiredWakeTime: text('desired_wake_time'),
    timezone: text('timezone'),
    createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`)
  },
  (t) => ({ userIdx: index('babies_user_id').on(t.userId) })
);

export const sleepEntries = sqliteTable(
  'sleep_entries',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    babyId: integer('baby_id').notNull().references(() => babies.id, { onDelete: 'cascade' }),
    date: text('date').notNull(),
    wakeTime: text('wake_time'),
    nap1End: text('nap1_end'),
    nap2End: text('nap2_end'),
    nap3End: text('nap3_end'),
    nap4End: text('nap4_end'),
    nap1Start: text('nap1_start'),
    nap2Start: text('nap2_start'),
    nap3Start: text('nap3_start'),
    nap4Start: text('nap4_start'),
    bedtime: text('bedtime'),
    notes: text('notes'),
    timezone: text('timezone'),
    nightRating: text('night_rating'),
    createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`)
  },
  (t) => ({
    babyDateUq: uniqueIndex('sleep_entries_baby_date').on(t.babyId, t.date),
    babyDateIdx: index('sleep_entries_baby_date_idx').on(t.babyId, t.date)
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Invitation = typeof invitations.$inferSelect;
export type Baby = typeof babies.$inferSelect;
export type NewBaby = typeof babies.$inferInsert;
export type SleepEntry = typeof sleepEntries.$inferSelect;
export type NewSleepEntry = typeof sleepEntries.$inferInsert;
