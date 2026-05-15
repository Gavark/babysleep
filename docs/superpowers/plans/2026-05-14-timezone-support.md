# Timezone Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add timezone support at user/baby/entry levels with a fallback chain so that "today" is computed in the effective local timezone instead of the Docker container TZ.

**Architecture:** A pure `$lib/tz.ts` helper provides `isValidTimezone`, `todayISOInTZ`, and `resolveTimezone`. Schema adds `timezone` columns to `users`, `babies`, and `sleep_entries`. The today page load and save action use the resolved TZ; account and baby-edit pages expose TZ selects. Milo's baby row gets `timezone='America/Guadeloupe'` applied post-migration.

**Tech Stack:** SvelteKit, Drizzle ORM (better-sqlite3), Vitest, TypeScript, Docker Compose.

---

## File Map

| Action | Path |
|--------|------|
| Modify | `src/lib/server/db/schema.ts` |
| Create | `src/lib/tz.ts` |
| Create | `tests/tz.test.ts` |
| Modify | `src/lib/server/babies.ts` |
| Modify | `src/lib/server/sleep-entries.ts` |
| Modify | `src/routes/app/babies/[id]/today/+page.server.ts` |
| Modify | `src/routes/app/babies/[id]/today/+page.svelte` |
| Modify | `src/routes/account/+page.server.ts` |
| Modify | `src/routes/account/+page.svelte` |
| Modify | `src/routes/app/babies/[id]/+page.server.ts` |
| Modify | `src/routes/app/babies/[id]/+page.svelte` |
| Auto-generated | `drizzle/0003_*.sql` (via `npm run db:generate`) |

---

### Task 1: Add `timezone` columns to schema

**Files:**
- Modify: `src/lib/server/db/schema.ts`

- [ ] **Step 1: Add `timezone` to `users` table (before `createdAt`)**

Open `src/lib/server/db/schema.ts`. In the `users` table definition, insert after `isAdmin`:

```ts
timezone: text('timezone').notNull().default('Europe/Paris'),
```

Full updated `users` block:
```ts
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  isAdmin: integer('is_admin').notNull().default(0),
  timezone: text('timezone').notNull().default('Europe/Paris'),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`)
});
```

- [ ] **Step 2: Add `timezone` to `babies` table (before `createdAt`)**

In the `babies` table definition, insert after `desiredWakeTime`:

```ts
timezone: text('timezone'),  // null = inherit from user
```

Full updated `babies` block:
```ts
export const babies = sqliteTable(
  'babies',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    birthDate: text('birth_date').notNull(),
    ageOverrideMonths: integer('age_override_months'),
    desiredWakeTime: text('desired_wake_time'),
    timezone: text('timezone'),  // null = inherit from user
    createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`)
  },
  (t) => ({ userIdx: index('babies_user_id').on(t.userId) })
);
```

- [ ] **Step 3: Add `timezone` to `sleepEntries` table (before `createdAt`)**

In the `sleepEntries` table definition, insert after `notes`:

```ts
timezone: text('timezone'),  // null = inherit from baby/user
```

Full updated `sleepEntries` block:
```ts
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
    timezone: text('timezone'),  // null = inherit from baby/user
    createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
    updatedAt: integer('updated_at').notNull().default(sql`(unixepoch())`)
  },
  (t) => ({
    babyDateUq: uniqueIndex('sleep_entries_baby_date').on(t.babyId, t.date),
    babyDateIdx: index('sleep_entries_baby_date_idx').on(t.babyId, t.date)
  })
);
```

- [ ] **Step 4: Generate the migration**

```bash
npm run db:generate
```

Expected: a new file `drizzle/0003_*.sql` containing exactly these 3 statements (order may vary):
```sql
ALTER TABLE `users` ADD `timezone` text NOT NULL DEFAULT 'Europe/Paris';--> statement-breakpoint
ALTER TABLE `babies` ADD `timezone` text;--> statement-breakpoint
ALTER TABLE `sleep_entries` ADD `timezone` text;
```

- [ ] **Step 5: Verify tests still pass (migration picked up)**

```bash
npm test -- --reporter=verbose 2>&1 | tail -5
```

Expected: `101 passed` (no failures — tests use `migrate()` against `./drizzle` which now includes the new file).

- [ ] **Step 6: Commit**

```bash
git add src/lib/server/db/schema.ts drizzle/
git commit -m "feat(schema): add timezone column to users, babies, sleep_entries"
```

---

### Task 2: Create the TZ helper

**Files:**
- Create: `src/lib/tz.ts`
- Create: `tests/tz.test.ts`

- [ ] **Step 1: Write the failing tests first**

Create `tests/tz.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { isValidTimezone, todayISOInTZ, resolveTimezone } from '$lib/tz';

describe('isValidTimezone', () => {
  it('accepts common IANA names', () => {
    expect(isValidTimezone('Europe/Paris')).toBe(true);
    expect(isValidTimezone('America/Guadeloupe')).toBe(true);
    expect(isValidTimezone('UTC')).toBe(true);
  });
  it('rejects garbage', () => {
    expect(isValidTimezone('')).toBe(false);
    expect(isValidTimezone('Bogus/Place')).toBe(false);
    expect(isValidTimezone('paris')).toBe(false);
  });
});

describe('todayISOInTZ', () => {
  it('returns ISO date in given TZ', () => {
    // 2026-05-14 23:30 UTC is 2026-05-15 in Paris (CEST, +2)
    const utcNight = new Date('2026-05-14T23:30:00Z');
    expect(todayISOInTZ('Europe/Paris', utcNight)).toBe('2026-05-15');
    // 2026-05-14 23:30 UTC is 2026-05-14 19:30 in Guadeloupe (AST, -4)
    expect(todayISOInTZ('America/Guadeloupe', utcNight)).toBe('2026-05-14');
  });
  it('falls back to Europe/Paris on invalid TZ', () => {
    const d = new Date('2026-05-14T23:30:00Z');
    expect(todayISOInTZ('Garbage/Place', d)).toBe('2026-05-15');
  });
});

describe('resolveTimezone', () => {
  it('prefers entry > baby > user', () => {
    expect(resolveTimezone('Asia/Tokyo', 'America/Guadeloupe', 'Europe/Paris')).toBe('Asia/Tokyo');
    expect(resolveTimezone(null, 'America/Guadeloupe', 'Europe/Paris')).toBe('America/Guadeloupe');
    expect(resolveTimezone(null, null, 'Europe/Paris')).toBe('Europe/Paris');
    expect(resolveTimezone(null, null, null)).toBe('Europe/Paris');
  });
  it('skips invalid entries in the chain', () => {
    expect(resolveTimezone('Bogus', 'America/Guadeloupe', 'Europe/Paris')).toBe('America/Guadeloupe');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/tz.test.ts 2>&1 | tail -10
```

Expected: FAIL — `Cannot find module '$lib/tz'`

- [ ] **Step 3: Implement `src/lib/tz.ts`**

Create `src/lib/tz.ts`:

```ts
const FALLBACK_TZ = 'Europe/Paris';

export function isValidTimezone(tz: string): boolean {
  if (typeof tz !== 'string' || !tz.trim()) return false;
  try {
    new Intl.DateTimeFormat('en-CA', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function todayISOInTZ(tz: string, now: Date = new Date()): string {
  const safe = isValidTimezone(tz) ? tz : FALLBACK_TZ;
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: safe,
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(now);
}

export function resolveTimezone(
  entryTz: string | null | undefined,
  babyTz: string | null | undefined,
  userTz: string | null | undefined
): string {
  if (entryTz && isValidTimezone(entryTz)) return entryTz;
  if (babyTz && isValidTimezone(babyTz)) return babyTz;
  if (userTz && isValidTimezone(userTz)) return userTz;
  return FALLBACK_TZ;
}

export const COMMON_TIMEZONES = [
  'Europe/Paris', 'Europe/London', 'Europe/Berlin', 'Europe/Madrid', 'Europe/Lisbon',
  'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'America/Toronto',
  'America/Guadeloupe', 'America/Martinique', 'America/Cayenne', 'America/Sao_Paulo',
  'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Dubai',
  'Australia/Sydney',
  'Africa/Casablanca',
  'Indian/Reunion', 'Pacific/Tahiti', 'Pacific/Honolulu',
  'UTC'
] as const;
```

- [ ] **Step 4: Run tz tests to verify they pass**

```bash
npm test -- tests/tz.test.ts 2>&1 | tail -10
```

Expected: `6 passed`

- [ ] **Step 5: Run full test suite to verify no regressions**

```bash
npm test 2>&1 | tail -5
```

Expected: `107 passed` (101 previous + 6 new).

- [ ] **Step 6: Commit**

```bash
git add src/lib/tz.ts tests/tz.test.ts
git commit -m "feat(tz): add isValidTimezone, todayISOInTZ, resolveTimezone helpers"
```

---

### Task 3: Extend babies service with timezone

**Files:**
- Modify: `src/lib/server/babies.ts`
- Test via existing: `tests/server/babies.test.ts`

- [ ] **Step 1: Write failing test for timezone on baby**

Add to `tests/server/babies.test.ts` (append inside the `describe('babies', ...)` block, before the closing `}`):

```ts
  it('accepts and stores timezone on create', () => {
    const u = mkUser(tdb);
    const b = createBaby(tdb.db, u, { name: 'X', birthDate: '2025-01-15', ageOverrideMonths: null, timezone: 'America/Guadeloupe' });
    expect(b.timezone).toBe('America/Guadeloupe');
  });

  it('rejects invalid timezone on create', () => {
    const u = mkUser(tdb);
    expect(() => createBaby(tdb.db, u, { name: 'X', birthDate: '2025-01-15', ageOverrideMonths: null, timezone: 'Bogus/Zone' })).toThrow('timezone invalide');
  });

  it('accepts null timezone (inherit from user)', () => {
    const u = mkUser(tdb);
    const b = createBaby(tdb.db, u, { name: 'X', birthDate: '2025-01-15', ageOverrideMonths: null, timezone: null });
    expect(b.timezone).toBeNull();
  });

  it('updateBaby persists timezone change', () => {
    const u = mkUser(tdb);
    const b = createBaby(tdb.db, u, { name: 'X', birthDate: '2025-01-15', ageOverrideMonths: null });
    updateBaby(tdb.db, u, b.id, { timezone: 'America/Guadeloupe' });
    expect(getBabyForUser(tdb.db, u, b.id)?.timezone).toBe('America/Guadeloupe');
  });
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/server/babies.test.ts 2>&1 | tail -10
```

Expected: FAIL on the new tests (timezone field not accepted yet).

- [ ] **Step 3: Update `src/lib/server/babies.ts`**

Add the import at the top:
```ts
import { isValidTimezone } from '$lib/tz';
```

Update `createBaby` signature and body:
```ts
export function createBaby(
  db: DB,
  userId: number,
  input: { name: string; birthDate: string; ageOverrideMonths: number | null; desiredWakeTime?: string | null; timezone?: string | null }
) {
  const name = String(input.name ?? '').trim();
  if (!name) throw new Error('name required');
  if (!ISO_DATE.test(input.birthDate)) throw new Error('birthDate must be YYYY-MM-DD');
  const desiredWakeTime = validateDesiredWakeTime(input.desiredWakeTime);
  if (input.timezone != null && input.timezone !== '' && !isValidTimezone(input.timezone)) {
    throw new Error('timezone invalide');
  }
  const timezone = input.timezone ?? null;
  const t = Math.floor(Date.now() / 1000);
  return db.insert(schema.babies).values({
    userId, name, birthDate: input.birthDate, ageOverrideMonths: input.ageOverrideMonths,
    desiredWakeTime,
    timezone,
    createdAt: t, updatedAt: t
  }).returning().all()[0];
}
```

Update `updateBaby` patch type:
```ts
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
  if ('timezone' in patch && patch.timezone != null && patch.timezone !== '' && !isValidTimezone(patch.timezone)) {
    throw new Error('timezone invalide');
  }
  const t = Math.floor(Date.now() / 1000);
  db.update(schema.babies).set({ ...patch, updatedAt: t }).where(eq(schema.babies.id, babyId)).run();
  return true;
}
```

- [ ] **Step 4: Run baby tests to verify they pass**

```bash
npm test -- tests/server/babies.test.ts 2>&1 | tail -10
```

Expected: all babies tests pass (now 10 total in that file).

- [ ] **Step 5: Run full suite**

```bash
npm test 2>&1 | tail -5
```

Expected: `111 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/server/babies.ts tests/server/babies.test.ts
git commit -m "feat(babies): accept optional timezone in create/update"
```

---

### Task 4: Extend sleep-entries service with timezone

**Files:**
- Modify: `src/lib/server/sleep-entries.ts`
- Test via existing: `tests/server/sleep-entries.test.ts`

- [ ] **Step 1: Write failing test**

Append inside `describe('sleep-entries', ...)` in `tests/server/sleep-entries.test.ts`:

```ts
  it('upsertEntry stores and returns timezone field', () => {
    const { babyId } = setup(tdb);
    upsertEntry(tdb.db, babyId, '2025-07-15', { wakeTime: '07:00', timezone: 'America/Guadeloupe' });
    const row = getEntryForBabyDate(tdb.db, babyId, '2025-07-15');
    expect(row?.timezone).toBe('America/Guadeloupe');
  });

  it('upsertEntry allows null timezone (inherit)', () => {
    const { babyId } = setup(tdb);
    upsertEntry(tdb.db, babyId, '2025-07-15', { wakeTime: '07:00', timezone: null });
    const row = getEntryForBabyDate(tdb.db, babyId, '2025-07-15');
    expect(row?.timezone).toBeNull();
  });
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/server/sleep-entries.test.ts 2>&1 | tail -10
```

Expected: FAIL on new tests (timezone not in EntryPatch yet).

- [ ] **Step 3: Update `src/lib/server/sleep-entries.ts`**

Extend `EntryPatch` type (add `timezone` field):
```ts
export type EntryPatch = Partial<{
  wakeTime: string | null;
  nap1Start: string | null;
  nap1End: string | null;
  nap2Start: string | null;
  nap2End: string | null;
  nap3Start: string | null;
  nap3End: string | null;
  nap4Start: string | null;
  nap4End: string | null;
  bedtime: string | null;
  notes: string | null;
  timezone: string | null;
}>;
```

Update the insert inside `upsertEntry` to include `timezone`:
```ts
export function upsertEntry(db: DB, babyId: number, date: string, patch: EntryPatch) {
  const existing = getEntryForBabyDate(db, babyId, date);
  const t = Math.floor(Date.now() / 1000);
  if (!existing) {
    db.insert(schema.sleepEntries).values({
      babyId, date,
      wakeTime: patch.wakeTime ?? null,
      nap1Start: patch.nap1Start ?? null,
      nap1End: patch.nap1End ?? null,
      nap2Start: patch.nap2Start ?? null,
      nap2End: patch.nap2End ?? null,
      nap3Start: patch.nap3Start ?? null,
      nap3End: patch.nap3End ?? null,
      nap4Start: patch.nap4Start ?? null,
      nap4End: patch.nap4End ?? null,
      bedtime: patch.bedtime ?? null,
      notes: patch.notes ?? null,
      timezone: patch.timezone ?? null,
      createdAt: t, updatedAt: t
    }).run();
  } else {
    db.update(schema.sleepEntries).set({ ...patch, updatedAt: t })
      .where(eq(schema.sleepEntries.id, existing.id)).run();
  }
}
```

- [ ] **Step 4: Run sleep-entry tests**

```bash
npm test -- tests/server/sleep-entries.test.ts 2>&1 | tail -10
```

Expected: all sleep-entry tests pass (now 6 total in that file).

- [ ] **Step 5: Run full suite**

```bash
npm test 2>&1 | tail -5
```

Expected: `113 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/server/sleep-entries.ts tests/server/sleep-entries.test.ts
git commit -m "feat(sleep-entries): add timezone field to EntryPatch and upsertEntry"
```

---

### Task 5: Update today page — server (load + save action)

**Files:**
- Modify: `src/routes/app/babies/[id]/today/+page.server.ts`

- [ ] **Step 1: Replace the entire file with the timezone-aware version**

```ts
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser } from '$lib/server/babies';
import { getEntryForBabyDate, listEntriesInRange, upsertEntry } from '$lib/server/sleep-entries';
import { ageInMonths } from '$lib/sleep-calc';
import { paramsForAge } from '$lib/age-params';
import { isValidHHMM } from '$lib/time';
import { resolveTimezone, todayISOInTZ, isValidTimezone } from '$lib/tz';

function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
}

export const load: PageServerLoad = ({ locals, params }) => {
  if (!locals.user) throw redirect(303, '/login');
  const id = Number(params.id);
  const { db } = getDb();
  const baby = getBabyForUser(db, locals.user.id, id);
  if (!baby) throw error(404);
  // Resolve base TZ (baby > user > fallback) to compute today's date
  const tz = resolveTimezone(null, baby.timezone, locals.user.timezone);
  const today = todayISOInTZ(tz);
  const entry = getEntryForBabyDate(db, baby.id, today);
  // If the entry has its own TZ override, use that for display (but not to recompute date)
  const effectiveTz = resolveTimezone(entry?.timezone ?? null, baby.timezone, locals.user.timezone);
  const months = ageInMonths(baby.birthDate, baby.ageOverrideMonths ?? undefined);
  const params_ = paramsForAge(months);
  const recent = listEntriesInRange(db, baby.id, addDays(today, -7), today);
  return { baby, today, entry, ageMonths: months, ageParams: params_, recent, effectiveTz, userTimezone: locals.user.timezone };
};

export const actions: Actions = {
  save: async ({ request, locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');
    const id = Number(params.id);
    const { db } = getDb();
    const baby = getBabyForUser(db, locals.user.id, id);
    if (!baby) throw error(404);
    const form = await request.formData();
    const fields = ['wake_time',
      'nap1_start', 'nap1_end',
      'nap2_start', 'nap2_end',
      'nap3_start', 'nap3_end',
      'nap4_start', 'nap4_end',
      'bedtime'] as const;
    const patch: Record<string, string | null> = {};
    for (const f of fields) {
      const v = String(form.get(f) ?? '').trim();
      if (v === '') patch[camel(f)] = null;
      else if (!isValidHHMM(v)) return fail(400, { error: `Heure invalide (${f}): ${v}` });
      else patch[camel(f)] = v;
    }
    const notes = String(form.get('notes') ?? '').trim();
    patch.notes = notes || null;
    // Timezone: accept form field override or fall back to baby/user
    const formTz = String(form.get('timezone') ?? '').trim();
    const entryTz = formTz && isValidTimezone(formTz) ? formTz : null;
    patch.timezone = entryTz;
    // Compute the date in the effective TZ
    const tz = resolveTimezone(entryTz, baby.timezone, locals.user.timezone);
    const date = String(form.get('date') ?? todayISOInTZ(tz));
    upsertEntry(db, baby.id, date, patch as any);
    return { success: 'Journée enregistrée.' };
  }
};

function camel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
```

- [ ] **Step 2: Run type check**

```bash
npm run check 2>&1 | tail -20
```

Expected: 0 errors. (If `locals.user.timezone` is not typed yet, fix in step 3.)

- [ ] **Step 3: If type errors on `locals.user.timezone` — update app.d.ts**

Find the `Locals` interface:
```bash
grep -n "timezone\|user:" src/app.d.ts 2>/dev/null || grep -rn "interface Locals" src/
```

If `timezone` is missing from the user type, add it. The user type comes from the Drizzle `users.$inferSelect`. Since we added `timezone` to schema, the inferred type already includes it. The `locals.user` type in `src/app.d.ts` or `src/hooks.server.ts` must expose it. Check:

```bash
grep -n "locals.user\|User\b" src/hooks.server.ts src/app.d.ts 2>/dev/null
```

If `locals.user` is typed as `typeof schema.users.$inferSelect`, it already has `timezone`. If it's a manual interface, add:
```ts
timezone: string;
```

- [ ] **Step 4: Run full suite**

```bash
npm test 2>&1 | tail -5
```

Expected: `113 passed` (no new tests here, just verifying no regressions).

- [ ] **Step 5: Commit**

```bash
git add src/routes/app/babies/\[id\]/today/+page.server.ts
git commit -m "feat(today): resolve timezone from baby/user/entry for today date computation"
```

---

### Task 6: Update today page — UI (timezone select)

**Files:**
- Modify: `src/routes/app/babies/[id]/today/+page.svelte`

- [ ] **Step 1: Update the Svelte page**

Replace the full content of `src/routes/app/babies/[id]/today/+page.svelte` with the version below. Key changes:
- Import `COMMON_TIMEZONES` from `$lib/tz`
- Add `timezone` state, defaulting to `data.effectiveTz` when it's a per-entry override (else empty = inherit)
- Add a `<select>` in the form for timezone
- Add hidden input so form POST sends the value

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import { idealBedtime, suggestNextNap, suggestedBedtime } from '$lib/sleep-calc';
  import { isValidHHMM } from '$lib/time';
  import { COMMON_TIMEZONES } from '$lib/tz';

  let { data, form } = $props();

  // All form state initialized empty — synced from data.entry via $effect below
  let wake       = $state('');
  let nap1Start  = $state('');
  let nap1End    = $state('');
  let nap2Start  = $state('');
  let nap2End    = $state('');
  let nap3Start  = $state('');
  let nap3End    = $state('');
  let nap4Start  = $state('');
  let nap4End    = $state('');
  let bedtime    = $state('');
  let notes      = $state('');
  // Timezone: empty string means "inherit from baby/user" (no per-entry override)
  let timezone   = $state('');

  // Track which entry we last synced from; trigger resync when the loaded entry changes.
  let syncedFor = $state<string | number>('__init__');

  $effect(() => {
    const id = data.entry?.id ?? 'none';
    if (id !== syncedFor) {
      syncedFor = id;
      wake      = data.entry?.wakeTime  ?? '';
      nap1Start = data.entry?.nap1Start ?? '';
      nap1End   = data.entry?.nap1End   ?? '';
      nap2Start = data.entry?.nap2Start ?? '';
      nap2End   = data.entry?.nap2End   ?? '';
      nap3Start = data.entry?.nap3Start ?? '';
      nap3End   = data.entry?.nap3End   ?? '';
      nap4Start = data.entry?.nap4Start ?? '';
      nap4End   = data.entry?.nap4End   ?? '';
      bedtime   = data.entry?.bedtime   ?? '';
      notes     = data.entry?.notes     ?? '';
      // Only pre-select TZ if the entry has its own override (not inherited)
      timezone  = data.entry?.timezone  ?? '';
    }
  });

  function safeNextNap(t: string) {
    return isValidHHMM(t) ? suggestNextNap(t, data.ageParams.awakeWindowMin) : '';
  }
  function safeIdeal(t: string) {
    return isValidHHMM(t) ? idealBedtime(t, data.ageParams.nightSleepH) : '';
  }

  const ideal = $derived(
    safeIdeal(data.baby.desiredWakeTime ?? '') || safeIdeal(wake)
  );
  const sugg1 = $derived(safeNextNap(wake));
  const sugg2 = $derived(safeNextNap(nap1End));
  const sugg3 = $derived(safeNextNap(nap2End));
  const sugg4 = $derived(safeNextNap(nap3End));
  const suggBed = $derived(
    isValidHHMM(wake)
      ? (suggestedBedtime(
          { wake, napEnds: [nap1End, nap2End, nap3End, nap4End].filter(isValidHHMM) },
          data.ageParams
        ) ?? '')
      : ''
  );

  // The TZ label shown in the "inherit" option
  const inheritedTz = $derived(data.effectiveTz);

  function read(e: Event) {
    return (e.currentTarget as HTMLInputElement | HTMLTextAreaElement).value;
  }
</script>

<h1>{data.baby.name} — {data.today}</h1>
<p>Âge : <strong>{data.ageMonths} mois</strong> ({data.ageParams.label}). Recommandé : {data.ageParams.naps} sieste(s), fenêtre {data.ageParams.awakeWindowMin} min, nuit {data.ageParams.nightSleepH}h.</p>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form method="POST" action="?/save" use:enhance={() => async ({ update }) => update({ reset: false })} autocomplete="off">
  <input type="hidden" name="date" value={data.today} />
  <input type="hidden" name="timezone" value={timezone} />

  <label>Réveil
    <input type="time" name="wake_time" autocomplete="off"
      value={wake}
      oninput={(e) => wake = read(e)}
      onchange={(e) => wake = read(e)}
      onblur={(e) => wake = read(e)} />
  </label>

  <div class="hint">💤 Sieste 1 suggérée vers <strong>{sugg1 || '—'}</strong></div>
  <label>Début sieste 1
    <input type="time" name="nap1_start" autocomplete="off"
      value={nap1Start}
      oninput={(e) => nap1Start = read(e)}
      onchange={(e) => nap1Start = read(e)}
      onblur={(e) => nap1Start = read(e)} />
  </label>
  <label>Fin sieste 1
    <input type="time" name="nap1_end" autocomplete="off"
      value={nap1End}
      oninput={(e) => nap1End = read(e)}
      onchange={(e) => nap1End = read(e)}
      onblur={(e) => nap1End = read(e)} />
  </label>

  <div class="hint">💤 Sieste 2 suggérée vers <strong>{sugg2 || '—'}</strong></div>
  <label>Début sieste 2
    <input type="time" name="nap2_start" autocomplete="off"
      value={nap2Start}
      oninput={(e) => nap2Start = read(e)}
      onchange={(e) => nap2Start = read(e)}
      onblur={(e) => nap2Start = read(e)} />
  </label>
  <label>Fin sieste 2
    <input type="time" name="nap2_end" autocomplete="off"
      value={nap2End}
      oninput={(e) => nap2End = read(e)}
      onchange={(e) => nap2End = read(e)}
      onblur={(e) => nap2End = read(e)} />
  </label>

  <div class="hint">💤 Sieste 3 suggérée vers <strong>{sugg3 || '—'}</strong></div>
  <label>Début sieste 3
    <input type="time" name="nap3_start" autocomplete="off"
      value={nap3Start}
      oninput={(e) => nap3Start = read(e)}
      onchange={(e) => nap3Start = read(e)}
      onblur={(e) => nap3Start = read(e)} />
  </label>
  <label>Fin sieste 3
    <input type="time" name="nap3_end" autocomplete="off"
      value={nap3End}
      oninput={(e) => nap3End = read(e)}
      onchange={(e) => nap3End = read(e)}
      onblur={(e) => nap3End = read(e)} />
  </label>

  <div class="hint">💤 Sieste 4 suggérée vers <strong>{sugg4 || '—'}</strong></div>
  <label>Début sieste 4
    <input type="time" name="nap4_start" autocomplete="off"
      value={nap4Start}
      oninput={(e) => nap4Start = read(e)}
      onchange={(e) => nap4Start = read(e)}
      onblur={(e) => nap4Start = read(e)} />
  </label>
  <label>Fin sieste 4
    <input type="time" name="nap4_end" autocomplete="off"
      value={nap4End}
      oninput={(e) => nap4End = read(e)}
      onchange={(e) => nap4End = read(e)}
      onblur={(e) => nap4End = read(e)} />
  </label>

  <div class="key">⭐ Coucher idéal : <strong>{ideal || '—'}</strong></div>
  <div class="key">⭐ Coucher suggéré : <strong>{suggBed || '—'}</strong></div>
  <label>Coucher effectif
    <input type="time" name="bedtime" autocomplete="off"
      value={bedtime}
      oninput={(e) => bedtime = read(e)}
      onchange={(e) => bedtime = read(e)}
      onblur={(e) => bedtime = read(e)} />
  </label>

  <label>Notes <textarea name="notes" autocomplete="off" value={notes} oninput={(e) => notes = read(e)} rows="2"></textarea></label>

  <label class="tz-line">Fuseau horaire (cette journée)
    <select bind:value={timezone}>
      <option value="">Hériter ({inheritedTz})</option>
      {#each COMMON_TIMEZONES as tz}
        <option value={tz}>{tz}</option>
      {/each}
    </select>
  </label>

  <button type="submit">Enregistrer la journée</button>
</form>

<h2>7 derniers jours</h2>
<ul>
  {#each data.recent as r}
    <li>{r.date} — réveil {r.wakeTime ?? '?'} / coucher {r.bedtime ?? '?'}</li>
  {/each}
</ul>

<style>
  form { display: grid; gap: 0.5rem; max-width: 360px; }
  .hint { color: #475569; font-size: 0.9rem; }
  .key { background: #C6E0B4; padding: 0.25rem 0.5rem; border-radius: 4px; color: #1F4E78; font-weight: 600; }
  .tz-line { font-size: 0.85rem; color: #64748b; }
  .tz-line select { width: 100%; font-size: 0.85rem; }
  .error { color: #b91c1c; } .ok { color: #047857; }
  button { padding: 0.5rem 1rem; background: #1F4E78; color: white; border: 0; border-radius: 4px; }
</style>
```

- [ ] **Step 2: Run type check**

```bash
npm run check 2>&1 | tail -20
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add "src/routes/app/babies/[id]/today/+page.svelte"
git commit -m "feat(today-ui): add timezone select with inherit option"
```

---

### Task 7: Account page — user default timezone

**Files:**
- Modify: `src/routes/account/+page.server.ts`
- Modify: `src/routes/account/+page.svelte`

- [ ] **Step 1: Update `src/routes/account/+page.server.ts`**

Replace the full file:

```ts
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { listSessionsForUser } from '$lib/server/auth/session';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import { isValidTimezone } from '$lib/tz';

export const load: PageServerLoad = ({ locals }) => {
  if (!locals.user) throw redirect(303, '/login');
  const { db } = getDb();
  const sessions = listSessionsForUser(db, locals.user.id).map((s) => ({
    id: s.id,
    userAgent: s.userAgent ?? 'inconnu',
    lastUsedAt: s.lastUsedAt,
    expiresAt: s.expiresAt,
    isCurrent: s.id === locals.session?.id
  }));
  return { account: { email: locals.user.email, isAdmin: !!locals.user.isAdmin, timezone: locals.user.timezone }, sessions };
};

export const actions: Actions = {
  changePassword: async ({ request, locals }) => {
    if (!locals.user || !locals.session) throw redirect(303, '/login');
    const form = await request.formData();
    const { db } = getDb();
    const { changePassword } = await import('./_logic');
    const r = await changePassword(db, locals.user.id, locals.session.id, {
      current: String(form.get('current_password') ?? ''),
      next: String(form.get('new_password') ?? ''),
      confirm: String(form.get('confirm') ?? '')
    });
    if (!r.ok) {
      const msg = ({
        'wrong-current': 'Mot de passe actuel incorrect.',
        'mismatch': 'Les nouveaux mots de passe ne correspondent pas.',
        'weak': 'Mot de passe trop court (≥ 10 caractères).'
      })[r.reason];
      return fail(400, { error: msg });
    }
    return { success: 'Mot de passe modifié — vos autres appareils ont été déconnectés.' };
  },

  updateTimezone: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/login');
    const form = await request.formData();
    const tz = String(form.get('timezone') ?? '').trim();
    if (!isValidTimezone(tz)) return fail(400, { tzError: 'Fuseau horaire invalide.' });
    const { db } = getDb();
    const t = Math.floor(Date.now() / 1000);
    db.update(schema.users).set({ timezone: tz, updatedAt: t }).where(eq(schema.users.id, locals.user.id)).run();
    return { tzSuccess: 'Fuseau horaire mis à jour.' };
  }
};
```

- [ ] **Step 2: Update `src/routes/account/+page.svelte`**

Replace the full file:

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import { COMMON_TIMEZONES } from '$lib/tz';
  let { data, form } = $props();
  let timezone = $state(data.account.timezone ?? 'Europe/Paris');
</script>

<h1>Mon compte</h1>
<p>Connecté en tant que <strong>{data.account.email}</strong>{#if data.account.isAdmin} (admin){/if}.</p>

<h2>Fuseau horaire par défaut</h2>
{#if form?.tzError}<p class="error" role="alert">{form.tzError}</p>{/if}
{#if form?.tzSuccess}<p class="ok">{form.tzSuccess}</p>{/if}
<form method="POST" action="?/updateTimezone" use:enhance>
  <label>Fuseau horaire
    <select name="timezone" bind:value={timezone}>
      {#each COMMON_TIMEZONES as tz}
        <option value={tz}>{tz}</option>
      {/each}
    </select>
  </label>
  <button type="submit">Enregistrer</button>
</form>

<h2>Changer mon mot de passe</h2>
{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}
<form method="POST" action="?/changePassword" use:enhance>
  <label>Mot de passe actuel<input type="password" name="current_password" required autocomplete="current-password" /></label>
  <label>Nouveau (≥ 10 car.)<input type="password" name="new_password" required minlength="10" autocomplete="new-password" /></label>
  <label>Confirmer<input type="password" name="confirm" required minlength="10" autocomplete="new-password" /></label>
  <button type="submit">Modifier</button>
</form>

<h2>Sessions actives</h2>
<table>
  <thead><tr><th>Appareil</th><th>Dernière activité</th><th>Expire</th><th></th></tr></thead>
  <tbody>
    {#each data.sessions as s}
      <tr>
        <td>{s.userAgent}{#if s.isCurrent}<em> — cet appareil</em>{/if}</td>
        <td>{new Date(s.lastUsedAt * 1000).toLocaleString('fr-FR')}</td>
        <td>{new Date(s.expiresAt * 1000).toLocaleDateString('fr-FR')}</td>
        <td>
          {#if !s.isCurrent}
            <form method="POST" action="/account/sessions/{s.id}" use:enhance>
              <button type="submit">Révoquer</button>
            </form>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<form method="POST" action="/logout"><button type="submit">Se déconnecter</button></form>

<style>
  form { display: grid; gap: 1rem; max-width: 360px; margin: 1rem 0; }
  table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
  th, td { padding: 0.5rem; border-bottom: 1px solid #e5e7eb; text-align: left; }
  .error { color: #b91c1c; } .ok { color: #047857; }
</style>
```

- [ ] **Step 3: Run type check**

```bash
npm run check 2>&1 | tail -20
```

Expected: 0 errors.

- [ ] **Step 4: Run full test suite**

```bash
npm test 2>&1 | tail -5
```

Expected: `113 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/routes/account/+page.server.ts src/routes/account/+page.svelte
git commit -m "feat(account): add user default timezone select"
```

---

### Task 8: Baby edit page — per-baby timezone override

**Files:**
- Modify: `src/routes/app/babies/[id]/+page.server.ts`
- Modify: `src/routes/app/babies/[id]/+page.svelte`

- [ ] **Step 1: Update `src/routes/app/babies/[id]/+page.server.ts`**

Replace the full file to pass `timezone` from the form to `updateBaby`:

```ts
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser, updateBaby, deleteBaby } from '$lib/server/babies';
import { isValidTimezone } from '$lib/tz';

export const load: PageServerLoad = ({ locals, params }) => {
  if (!locals.user) throw redirect(303, '/login');
  const id = Number(params.id);
  const { db } = getDb();
  const baby = getBabyForUser(db, locals.user.id, id);
  if (!baby) throw error(404, 'Bébé introuvable');
  return { baby };
};

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');
    const id = Number(params.id);
    const form = await request.formData();
    const name = String(form.get('name') ?? '').trim();
    const birthDate = String(form.get('birth_date') ?? '');
    const overrideStr = String(form.get('age_override') ?? '').trim();
    const override = overrideStr === '' ? null : Math.max(0, Math.floor(Number(overrideStr)));
    const desiredWakeRaw = String(form.get('desired_wake') ?? '').trim();
    const desiredWakeTime = desiredWakeRaw === '' ? null : desiredWakeRaw;
    const tzRaw = String(form.get('timezone') ?? '').trim();
    // Empty string = inherit from user (null), non-empty must be valid IANA
    const timezone = tzRaw === '' ? null : tzRaw;
    if (timezone !== null && !isValidTimezone(timezone)) {
      return fail(400, { error: 'Fuseau horaire invalide.' });
    }
    const { db } = getDb();
    const ok = updateBaby(db, locals.user.id, id, { name, birthDate, ageOverrideMonths: override, desiredWakeTime, timezone });
    if (!ok) return fail(404, { error: 'Bébé introuvable.' });
    return { success: 'Modifications enregistrées.' };
  },
  delete: ({ locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');
    const id = Number(params.id);
    const { db } = getDb();
    deleteBaby(db, locals.user.id, id);
    throw redirect(303, '/app/babies');
  }
};
```

- [ ] **Step 2: Update `src/routes/app/babies/[id]/+page.svelte`**

Replace the full file to add the timezone select:

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import { COMMON_TIMEZONES } from '$lib/tz';
  let { data, form } = $props();
  // Empty string = inherit from user account
  let timezone = $state(data.baby.timezone ?? '');
</script>

<h1>Bébé : {data.baby.name}</h1>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form method="POST" action="?/update" use:enhance>
  <label>Prénom<input name="name" value={data.baby.name} required /></label>
  <label>Date de naissance<input type="date" name="birth_date" value={data.baby.birthDate} required /></label>
  <label>Âge corrigé (mois)<input type="number" name="age_override" min="0" max="60" value={data.baby.ageOverrideMonths ?? ''} /></label>
  <label>Heure de réveil souhaitée<input type="time" name="desired_wake" value={data.baby.desiredWakeTime ?? ''} /></label>
  <label>Fuseau horaire (override bébé)
    <select name="timezone" bind:value={timezone}>
      <option value="">Hériter du compte</option>
      {#each COMMON_TIMEZONES as tz}
        <option value={tz}>{tz}</option>
      {/each}
    </select>
  </label>
  <button type="submit">Enregistrer</button>
</form>

<form method="POST" action="?/delete" use:enhance onsubmit={(e) => { if (!confirm('Supprimer ce bébé et tout son historique ?')) e.preventDefault(); }}>
  <button class="danger" type="submit">Supprimer ce bébé</button>
</form>

<style>
  form { display: grid; gap: 0.5rem; max-width: 320px; margin: 1rem 0; }
  .error { color: #b91c1c; } .ok { color: #047857; }
  .danger { background: #b91c1c; color: white; }
</style>
```

- [ ] **Step 3: Run type check**

```bash
npm run check 2>&1 | tail -20
```

Expected: 0 errors.

- [ ] **Step 4: Run full test suite**

```bash
npm test 2>&1 | tail -5
```

Expected: `113 passed`.

- [ ] **Step 5: Commit**

```bash
git add "src/routes/app/babies/[id]/+page.server.ts" "src/routes/app/babies/[id]/+page.svelte"
git commit -m "feat(baby-edit): add per-baby timezone override select"
```

---

### Task 9: Rebuild Docker, apply migration, set Milo's TZ

**Files:** None modified — Docker and DB operations only.

- [ ] **Step 1: Rebuild and restart containers**

```bash
docker compose down && docker compose up -d --build
```

Wait ~15 seconds for the app to start and the migration to run.

- [ ] **Step 2: Verify healthz**

```bash
curl -sSk --resolve babysleep.gavark.fr:443:127.0.0.1 https://babysleep.gavark.fr/healthz
```

Expected: `{"status":"ok"}` or similar 200 response.

- [ ] **Step 3: Verify migration applied (columns exist)**

```bash
docker compose exec -T app sh -c "sqlite3 /data/babysleep.sqlite '.schema users'"
```

Expected: output contains `timezone text NOT NULL DEFAULT 'Europe/Paris'`.

```bash
docker compose exec -T app sh -c "sqlite3 /data/babysleep.sqlite '.schema babies'"
```

Expected: output contains `timezone text`.

- [ ] **Step 4: Set Milo's timezone to America/Guadeloupe**

```bash
docker compose exec -T app sh -c "sqlite3 /data/babysleep.sqlite \"UPDATE babies SET timezone='America/Guadeloupe' WHERE name='Milo' AND user_id=(SELECT id FROM users WHERE email='jn.champanhet@gmail.com');\""
```

- [ ] **Step 5: Verify Milo's TZ was set**

```bash
docker compose exec -T app sh -c "sqlite3 /data/babysleep.sqlite \"SELECT id, name, timezone FROM babies WHERE name='Milo';\""
```

Expected output:
```
<id>|Milo|America/Guadeloupe
```

- [ ] **Step 6: Final commit and push**

```bash
git add -A
git status  # verify nothing unexpected is staged
git commit -m "feat(tz): timezone at user/baby/entry levels with fallback chain"
git push origin master
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Schema: `timezone` on `users`, `babies`, `sleep_entries` — Task 1
- [x] TZ helper with `isValidTimezone`, `todayISOInTZ`, `resolveTimezone`, `COMMON_TIMEZONES` — Task 2
- [x] Tests for TZ helper (6 tests) — Task 2
- [x] `createBaby` / `updateBaby` accept `timezone` with validation — Task 3
- [x] `EntryPatch.timezone` + `upsertEntry` pass-through — Task 4
- [x] Today page load: `resolveTimezone(null, baby.timezone, user.timezone)` — Task 5
- [x] Today page load: returns `effectiveTz` — Task 5
- [x] Today save action: reads `timezone` form field, passes to `upsertEntry` — Task 5
- [x] Today UI: timezone select with inherit option, hidden input — Task 6
- [x] Account page: `updateTimezone` action — Task 7
- [x] Baby edit page: timezone select — Task 8
- [x] Milo's TZ set to `America/Guadeloupe` — Task 9
- [x] Migration generated and applied — Tasks 1 + 9
- [x] `npm run check` 0 errors — Tasks 5, 6, 7, 8
- [x] `npm test` 113+ passing — Tasks 2, 3, 4

**Placeholder scan:** No TBD / TODO found. All code blocks complete.

**Type consistency:**
- `resolveTimezone(entryTz, babyTz, userTz)` — used consistently in Tasks 5 and matching definition in Task 2
- `todayISOInTZ(tz, now?)` — used in Tasks 5 server, matching definition in Task 2
- `isValidTimezone(tz)` — used in Tasks 3, 5, 7, 8, matching definition in Task 2
- `COMMON_TIMEZONES` — used in Tasks 6, 7, 8 (Svelte), matching definition in Task 2
- `EntryPatch.timezone` — defined in Task 4, consumed in Task 5 save action
- `patch.timezone` in `updateBaby` — defined in Task 3, consumed in Task 8 server
