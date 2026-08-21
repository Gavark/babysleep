/**
 * Demo instance for screenshots and release assets.
 *
 * Seeds an ISOLATED database (data/demo.sqlite by default) with one baby and
 * a few months of plausible sleep data, then starts a dev server against it.
 * The real dev database (data/babysleep.sqlite) is never opened.
 *
 *   npm run demo              seed + serve on http://localhost:5199
 *   npm run demo -- --seed    seed only, no server
 *
 * The generator is deterministic (fixed PRNG seed), so re-running it produces
 * the same history every time. Only "today" moves, so the wake-window timer
 * always looks alive in a fresh capture.
 */
import { spawn } from 'node:child_process';
import { rmSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const DB_PATH = process.env.DEMO_DATABASE_PATH ?? './data/demo.sqlite';
const PORT = process.env.DEMO_PORT ?? '5199';
const EMAIL = 'demo@babysleep.local';
const PASSWORD = 'demo-babysleep-2026';

const BIRTH_DATE = '2026-03-01';
const HISTORY_START = '2026-06-01';
const BABY_NAME = 'Léo';
const TZ = 'Europe/Paris';

process.env.DATABASE_PATH = DB_PATH;

// ---------------------------------------------------------------- utilities

/** mulberry32: tiny deterministic PRNG. Same seed, same history, every run. */
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hhmm = (min: number) => {
  const m = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

/** Wall-clock date (YYYY-MM-DD) in a given IANA zone. */
function isoDateInTZ(tz: string, at = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(at);
}

/** Minutes since midnight in a given IANA zone. */
function minutesInTZ(tz: string, at = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(at);
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const mi = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return h * 60 + mi;
}

function eachDate(fromISO: string, toISO: string): string[] {
  const out: string[] = [];
  const cur = new Date(fromISO + 'T12:00:00Z');
  const end = new Date(toISO + 'T12:00:00Z');
  while (cur <= end) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

/** Whole months elapsed between two ISO dates. */
function monthsBetween(fromISO: string, toISO: string): number {
  const [fy, fm, fd] = fromISO.split('-').map(Number);
  const [ty, tm, td] = toISO.split('-').map(Number);
  let months = (ty - fy) * 12 + (tm - fm);
  if (td < fd) months -= 1;
  return Math.max(0, months);
}

// ---------------------------------------------------------------- generator

type Nap = { start: string; end: string; pauseMin: number };
type Day = {
  date: string;
  wakeTime: string | null;
  naps: Nap[];
  bedtime: string | null;
  nightRating: 'good' | 'medium' | 'bad' | null;
};

async function buildHistory(todayISO: string): Promise<Day[]> {
  const { paramsForAge } = await import('../src/lib/age-params');
  const rng = makeRng(20260301);
  const jitter = (span: number) => Math.round((rng() - 0.5) * 2 * span);
  const days: Day[] = [];

  for (const date of eachDate(HISTORY_START, todayISO)) {
    const p = paramsForAge(monthsBetween(BIRTH_DATE, date));
    const isToday = date === todayISO;

    // A day with no entry at all. Real logs have gaps, and the calendar has a
    // dedicated "no data" state that deserves to be visible in a screenshot.
    if (!isToday && rng() < 0.055) {
      days.push({ date, wakeTime: null, naps: [], bedtime: null, nightRating: null });
      continue;
    }

    // Day quality. Without this the whole calendar comes out uniformly green,
    // which makes the heatmap look decorative instead of informative. Real
    // logs mix good stretches with rough patches and half-recorded days.
    const q = rng();
    const quality = q < 0.68 ? 'good' : q < 0.92 ? 'rough' : 'wrecked';

    const wake =
      quality === 'good'
        ? 6 * 60 + Math.round(rng() * 55)
        : 5 * 60 + 35 + Math.round(rng() * 35);
    const napScale = quality === 'good' ? 1 : quality === 'rough' ? 0.6 : 0.32;
    const napCount = quality === 'wrecked' ? Math.max(1, p.naps - 2) : p.naps;
    const targetNap = ((p.daySleepH * 60) / p.naps) * napScale;
    const naps: Nap[] = [];
    let cursor = wake + p.firstAwakeWindowMin + jitter(18);

    for (let i = 0; i < napCount; i++) {
      const duration = Math.max(25, Math.min(115, Math.round(targetNap * (0.78 + rng() * 0.44))));
      const pauseMin = rng() < 0.12 ? 5 * (1 + Math.floor(rng() * 3)) : 0;
      naps.push({ start: hhmm(cursor), end: hhmm(cursor + duration), pauseMin });
      cursor += duration + p.awakeWindowMin + jitter(20);
    }

    // On a wrecked day the last nap collapsed hours before the evening, so the
    // usual "last nap + before-bed window" arithmetic underflows. What actually
    // happens is an overtired baby going down very late.
    // Bedtime by day quality. Deriving all three from the model's suggestion
    // makes most days land on the same minute, and the bedtime chart comes out
    // as a dead flat line. Rough days get the early compensation bedtime
    // parents actually use; wrecked days get the overtired late one.
    const rawBedtime =
      quality === 'good'
        ? cursor - p.awakeWindowMin + p.beforeBedWindowMin + 25 + jitter(25)
        : quality === 'rough'
          ? 17 * 60 + 45 + Math.round(rng() * 45)
          : 20 * 60 + 5 + Math.round(rng() * 40);
    const bedtimeMin = Math.max(17 * 60 + 20, Math.min(20 * 60 + 45, rawBedtime));
    // A handful of days where the evening entry never got filled in. The
    // calendar renders those as incomplete, which is the honest state.
    const skipBedtime = !isToday && rng() < 0.05;
    // The manual rating is the parent's own read of the night, so it should
    // correlate with the day it produced without matching it mechanically.
    const r = rng();
    const nightRating =
      quality === 'good'
        ? r < 0.88 ? 'good' : r < 0.99 ? 'medium' : 'bad'
        : quality === 'rough'
          ? r < 0.2 ? 'good' : r < 0.85 ? 'medium' : 'bad'
          : r < 0.35 ? 'medium' : 'bad';

    days.push({
      date,
      wakeTime: hhmm(wake),
      naps,
      bedtime: skipBedtime ? null : hhmm(bedtimeMin),
      nightRating: skipBedtime ? null : nightRating
    });
  }

  // Today is rebuilt against the real clock so the wake-window timer shows a
  // live value: the last nap ended ~75 min ago, the next one is still ahead.
  const today = days[days.length - 1];
  const p = paramsForAge(monthsBetween(BIRTH_DATE, todayISO));
  const nowMin = minutesInTZ(TZ);
  const lastNapEnd = nowMin - 75;
  const wakeMin = 6 * 60 + 40;

  today.bedtime = null;
  today.nightRating = null;
  today.naps = [];
  today.wakeTime = hhmm(Math.min(wakeMin, Math.max(5 * 60, nowMin - 60)));

  if (lastNapEnd > wakeMin + p.firstAwakeWindowMin + 45) {
    // Enough of the day has elapsed to show a couple of completed naps.
    const span = p.awakeWindowMin + 70;
    const done = Math.min(p.naps - 1, Math.max(1, Math.round((lastNapEnd - wakeMin) / span)));
    let end = lastNapEnd;
    for (let i = done - 1; i >= 0; i--) {
      const duration = 60 + i * 8;
      today.naps.unshift({ start: hhmm(end - duration), end: hhmm(end), pauseMin: 0 });
      end -= duration + p.awakeWindowMin;
    }
  }

  return days;
}

// ---------------------------------------------------------------- seeding

async function seed() {
  mkdirSync(dirname(resolve(DB_PATH)), { recursive: true });
  for (const suffix of ['', '-wal', '-shm']) {
    rmSync(resolve(DB_PATH + suffix), { force: true });
  }

  const { migrate } = await import('drizzle-orm/better-sqlite3/migrator');
  const { getDb } = await import('../src/lib/server/db');
  const schema = await import('../src/lib/server/db/schema');
  const { hashPassword } = await import('../src/lib/server/auth/password');

  const { db } = getDb();
  migrate(db, { migrationsFolder: './drizzle' });

  const t = Math.floor(Date.now() / 1000);
  const user = db
    .insert(schema.users)
    .values({
      email: EMAIL,
      passwordHash: await hashPassword(PASSWORD),
      isAdmin: 1,
      timezone: TZ,
      locale: 'fr',
      createdAt: t,
      updatedAt: t
    })
    .returning()
    .all()[0];

  const baby = db
    .insert(schema.babies)
    .values({
      userId: user.id,
      name: BABY_NAME,
      birthDate: BIRTH_DATE,
      desiredWakeTime: '06:45',
      timezone: TZ,
      createdAt: t,
      updatedAt: t
    })
    .returning()
    .all()[0];

  const todayISO = isoDateInTZ(TZ);
  const days = await buildHistory(todayISO);

  for (const day of days) {
    if (!day.wakeTime && day.naps.length === 0) continue;
    const row: Record<string, unknown> = {
      babyId: baby.id,
      date: day.date,
      wakeTime: day.wakeTime,
      bedtime: day.bedtime,
      nightRating: day.nightRating,
      timezone: null,
      createdAt: t,
      updatedAt: t
    };
    day.naps.forEach((nap, i) => {
      row[`nap${i + 1}Start`] = nap.start;
      row[`nap${i + 1}End`] = nap.end;
      if (nap.pauseMin) row[`nap${i + 1}PauseMin`] = nap.pauseMin;
    });
    db.insert(schema.sleepEntries).values(row as never).run();
  }

  console.log(`Seeded ${DB_PATH}: ${days.length} days for ${BABY_NAME}, up to ${todayISO}.`);
  console.log(`Login: ${EMAIL} / ${PASSWORD}`);
}

// ---------------------------------------------------------------- entrypoint

async function main() {
  await seed();
  if (process.argv.includes('--seed')) return;

  console.log(`Starting demo server on http://localhost:${PORT}`);
  const child = spawn('npx', ['vite', 'dev', '--port', PORT, '--strictPort'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      DATABASE_PATH: DB_PATH,
      // Never let the demo instance bootstrap an admin from the real .env.
      ADMIN_EMAIL: '',
      ADMIN_PASSWORD: ''
    }
  });
  child.on('exit', (code) => process.exit(code ?? 0));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
