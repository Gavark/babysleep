import { sqliteTable, integer, text, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  isAdmin: integer('is_admin').notNull().default(0),
  timezone: text('timezone').notNull().default('Europe/Paris'),
  locale: text('locale').notNull().default('fr'),
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
    nap5End: text('nap5_end'),
    nap6End: text('nap6_end'),
    nap7End: text('nap7_end'),
    nap8End: text('nap8_end'),
    nap1Start: text('nap1_start'),
    nap2Start: text('nap2_start'),
    nap3Start: text('nap3_start'),
    nap4Start: text('nap4_start'),
    nap5Start: text('nap5_start'),
    nap6Start: text('nap6_start'),
    nap7Start: text('nap7_start'),
    nap8Start: text('nap8_start'),
    nap1PauseMin: integer('nap1_pause_min'),
    nap2PauseMin: integer('nap2_pause_min'),
    nap3PauseMin: integer('nap3_pause_min'),
    nap4PauseMin: integer('nap4_pause_min'),
    nap5PauseMin: integer('nap5_pause_min'),
    nap6PauseMin: integer('nap6_pause_min'),
    nap7PauseMin: integer('nap7_pause_min'),
    nap8PauseMin: integer('nap8_pause_min'),
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

export const appConfig = sqliteTable('app_config', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`)
});

export const pushSubscriptions = sqliteTable(
  'push_subscriptions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    endpoint: text('endpoint').notNull().unique(),
    p256dh: text('p256dh').notNull(),
    auth: text('auth').notNull(),
    userAgent: text('user_agent'),
    createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
    lastSeenAt: integer('last_seen_at').notNull().default(sql`(unixepoch())`)
  },
  (t) => ({
    userIdx: index('push_subscriptions_user_id').on(t.userId)
  })
);

export const scheduledPushes = sqliteTable(
  'scheduled_pushes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    babyId: integer('baby_id').notNull().references(() => babies.id, { onDelete: 'cascade' }),
    kind: text('kind').notNull(),
    fireAt: integer('fire_at').notNull(),
    firedAt: integer('fired_at'),
    cancelledAt: integer('cancelled_at'),
    createdAt: integer('created_at').notNull().default(sql`(unixepoch())`)
  },
  (t) => ({
    pendingFireAtIdx: index('scheduled_pushes_pending_fire_at').on(t.fireAt),
    babyIdx: index('scheduled_pushes_baby_id').on(t.babyId)
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
export type AppConfig = typeof appConfig.$inferSelect;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type ScheduledPush = typeof scheduledPushes.$inferSelect;
