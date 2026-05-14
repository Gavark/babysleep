# BabySleep Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Dockerized SvelteKit web app for tracking baby sleep with auth, multi-baby support, CSV export, and PWA install — per `docs/superpowers/specs/2026-05-13-babysleep-web-app-design.md`.

**Architecture:** Single SvelteKit (adapter-node) container. SQLite + Drizzle ORM on a Docker volume. Argon2id passwords with DB-backed sessions (cookies, 30d sliding). vite-plugin-pwa generates the service worker. Reverse proxy with HTTPS is provided externally.

**Tech Stack:** SvelteKit 2.x + Svelte 5, TypeScript strict, better-sqlite3, Drizzle ORM, `@node-rs/argon2`, `vite-plugin-pwa`, vitest.

---

## File Structure

Files created in order of plan execution. Bold = created in that task, regular = touched later.

```
.
├── .dockerignore                                 [Task 40]
├── .env.example                                  [Task 41]
├── .gitignore                                    [Task 1]
├── Dockerfile                                    [Task 40]
├── README.md                                     [Task 43]
├── docker-compose.yml                            [Task 41]
├── drizzle.config.ts                             [Task 13]
├── package.json                                  [Task 1, 2]
├── svelte.config.js                              [Task 1]
├── tsconfig.json                                 [Task 3]
├── vite.config.ts                                [Task 1, 4, 37]
├── drizzle/                                      [Task 13] (generated)
├── scripts/
│   ├── backup.sh                                 [Task 42]
│   └── reset-password.ts                         [Task 42]
├── src/
│   ├── app.d.ts                                  [Task 3, 20]
│   ├── app.html                                  [Task 1, 37]
│   ├── hooks.server.ts                           [Task 20, 39]
│   ├── lib/
│   │   ├── age-params.ts                         [Task 7, 8]
│   │   ├── sleep-calc.ts                         [Task 9, 10, 11]
│   │   ├── time.ts                               [Task 5, 6]
│   │   └── server/
│   │       ├── auth/
│   │       │   ├── bootstrap.ts                  [Task 19]
│   │       │   ├── invitations.ts                [Task 18]
│   │       │   ├── password.ts                   [Task 16]
│   │       │   └── session.ts                    [Task 17]
│   │       ├── babies.ts                         [Task 28]
│   │       ├── csv.ts                            [Task 35]
│   │       ├── db/
│   │       │   ├── index.ts                      [Task 14]
│   │       │   ├── migrate.ts                    [Task 14]
│   │       │   └── schema.ts                     [Task 12]
│   │       ├── rate-limit.ts                     [Task 39]
│   │       └── sleep-entries.ts                  [Task 32]
│   └── routes/
│       ├── +error.svelte                         [Task 20]
│       ├── +layout.svelte                        [Task 20]
│       ├── +page.server.ts                       [Task 20]
│       ├── account/
│       │   ├── +page.server.ts                   [Task 25, 26]
│       │   ├── +page.svelte                      [Task 25, 26]
│       │   └── sessions/[id]/+server.ts          [Task 27]
│       ├── admin/invitations/
│       │   ├── +page.server.ts                   [Task 24]
│       │   └── +page.svelte                      [Task 24]
│       ├── api/babies/[id]/export.csv/+server.ts [Task 36]
│       ├── app/
│       │   ├── +layout.server.ts                 [Task 31]
│       │   ├── +layout.svelte                    [Task 31]
│       │   ├── +page.server.ts                   [Task 29]
│       │   └── babies/
│       │       ├── +page.server.ts               [Task 29]
│       │       ├── +page.svelte                  [Task 29]
│       │       └── [id]/
│       │           ├── +page.server.ts           [Task 30]
│       │           ├── +page.svelte              [Task 30]
│       │           ├── history/
│       │           │   ├── +page.server.ts       [Task 34]
│       │           │   └── +page.svelte          [Task 34]
│       │           └── today/
│       │               ├── +page.server.ts       [Task 33]
│       │               └── +page.svelte          [Task 33]
│       ├── healthz/+server.ts                    [Task 38]
│       ├── login/
│       │   ├── +page.server.ts                   [Task 21]
│       │   └── +page.svelte                      [Task 21]
│       ├── logout/+server.ts                     [Task 22]
│       └── signup/
│           ├── +page.server.ts                   [Task 23]
│           └── +page.svelte                      [Task 23]
├── static/
│   ├── icon-192.png                              [Task 37]
│   ├── icon-512.png                              [Task 37]
│   └── apple-touch-icon.png                      [Task 37]
└── tests/
    ├── helpers/
    │   ├── db.ts                                 [Task 15]
    │   └── http.ts                               [Task 20]
    ├── age-params.test.ts                        [Task 7, 8]
    ├── sleep-calc.test.ts                        [Task 9, 10, 11]
    ├── time.test.ts                              [Task 5, 6]
    └── server/
        ├── auth-bootstrap.test.ts                [Task 19]
        ├── auth-invitations.test.ts              [Task 18]
        ├── auth-password.test.ts                 [Task 16]
        ├── auth-session.test.ts                  [Task 17]
        ├── babies.test.ts                        [Task 28]
        ├── csv.test.ts                           [Task 35]
        ├── routes-account.test.ts                [Task 26, 27]
        ├── routes-csv.test.ts                    [Task 36]
        ├── routes-login.test.ts                  [Task 21, 39]
        ├── routes-signup.test.ts                 [Task 23]
        └── sleep-entries.test.ts                 [Task 32]
```

---

## Phase 0 — Project bootstrap

### Task 1: Scaffold the SvelteKit project

**Files:**
- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `src/app.html`, `tsconfig.json`, `.gitignore`

- [ ] **Step 1: Initialize git and create package.json**

Run from `d:/Dev/Gavark/CalculateurSommeilBebe/`:

```bash
git init
```

Create `package.json`:

```json
{
  "name": "babysleep",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "test": "vitest run",
    "test:watch": "vitest",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "tsx src/lib/server/db/migrate.ts",
    "reset-password": "tsx scripts/reset-password.ts",
    "start": "node build/index.js"
  }
}
```

- [ ] **Step 2: Add `.gitignore`**

```gitignore
node_modules/
.svelte-kit/
build/
.env
.env.local
*.sqlite
*.sqlite-journal
*.sqlite-wal
*.sqlite-shm
/data/
dist/
coverage/
.DS_Store
```

- [ ] **Step 3: Add `svelte.config.js`**

```js
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ out: 'build' }),
    csrf: { checkOrigin: true },
    alias: {
      $lib: 'src/lib'
    }
  }
};

export default config;
```

- [ ] **Step 4: Add `vite.config.ts`**

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: { port: 5173 },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node'
  }
});
```

- [ ] **Step 5: Add `src/app.html`**

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#1F4E78" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <title>BabySleep</title>
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold SvelteKit project"
```

---

### Task 2: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime + dev dependencies**

```bash
npm install --save \
  @sveltejs/adapter-node \
  better-sqlite3 \
  drizzle-orm \
  @node-rs/argon2

npm install --save-dev \
  @sveltejs/kit \
  @sveltejs/vite-plugin-svelte \
  @types/better-sqlite3 \
  @types/node \
  drizzle-kit \
  svelte \
  svelte-check \
  typescript \
  tsx \
  vite \
  vitest \
  vite-plugin-pwa \
  workbox-build
```

- [ ] **Step 2: Verify install**

```bash
npm run check
```

Expected: command runs (may report missing files — that's OK; we just need no install errors).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install dependencies"
```

---

### Task 3: TypeScript config + path aliases

**Files:**
- Create: `tsconfig.json`, `src/app.d.ts`

- [ ] **Step 1: Write `tsconfig.json`**

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}
```

- [ ] **Step 2: Write `src/app.d.ts` (placeholder, expanded in Task 20)**

```ts
declare global {
  namespace App {
    interface Locals {}
    interface PageData {}
    interface Error {}
    interface Platform {}
  }
}

export {};
```

- [ ] **Step 3: Run check**

```bash
npm run check
```

Expected: passes (no errors).

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json src/app.d.ts
git commit -m "chore: TypeScript strict config"
```

---

### Task 4: Vitest configuration

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Already configured in Task 1.** Verify by running an empty test:

```bash
mkdir -p tests
cat > tests/smoke.test.ts <<'EOF'
import { describe, it, expect } from 'vitest';
describe('smoke', () => { it('runs', () => { expect(1).toBe(1); }); });
EOF
npm test
```

Expected: 1 test passes.

- [ ] **Step 2: Remove the smoke test, commit**

```bash
rm tests/smoke.test.ts
git add -A
git commit -m "chore: verify vitest setup"
```

---

## Phase 1 — Pure libraries (TDD)

### Task 5: `lib/time.ts` — parse/format HH:MM

**Files:**
- Create: `tests/time.test.ts`, `src/lib/time.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/time.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { parseHHMM, formatHHMM, isValidHHMM } from '$lib/time';

describe('parseHHMM', () => {
  it('parses 07:00 to 420 minutes', () => {
    expect(parseHHMM('07:00')).toBe(7 * 60);
  });
  it('parses 00:00 to 0', () => {
    expect(parseHHMM('00:00')).toBe(0);
  });
  it('parses 23:59 to 1439', () => {
    expect(parseHHMM('23:59')).toBe(23 * 60 + 59);
  });
  it('throws on invalid input', () => {
    expect(() => parseHHMM('25:00')).toThrow();
    expect(() => parseHHMM('7:00')).toThrow();
    expect(() => parseHHMM('xx:00')).toThrow();
    expect(() => parseHHMM('')).toThrow();
  });
});

describe('formatHHMM', () => {
  it('formats 420 to 07:00', () => {
    expect(formatHHMM(420)).toBe('07:00');
  });
  it('formats 0 to 00:00', () => {
    expect(formatHHMM(0)).toBe('00:00');
  });
  it('wraps values >= 1440 with mod', () => {
    expect(formatHHMM(1440)).toBe('00:00');
    expect(formatHHMM(1500)).toBe('01:00');
  });
  it('wraps negatives', () => {
    expect(formatHHMM(-60)).toBe('23:00');
  });
});

describe('isValidHHMM', () => {
  it('accepts valid HH:MM', () => {
    expect(isValidHHMM('07:00')).toBe(true);
    expect(isValidHHMM('23:59')).toBe(true);
  });
  it('rejects invalid', () => {
    expect(isValidHHMM('7:00')).toBe(false);
    expect(isValidHHMM('24:00')).toBe(false);
    expect(isValidHHMM('07:60')).toBe(false);
    expect(isValidHHMM('abc')).toBe(false);
    expect(isValidHHMM('')).toBe(false);
  });
});
```

- [ ] **Step 2: Run and verify failure**

```bash
npm test
```

Expected: FAIL with "Cannot find module $lib/time".

- [ ] **Step 3: Implement `src/lib/time.ts`**

```ts
const HHMM_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidHHMM(s: string): boolean {
  return typeof s === 'string' && HHMM_RE.test(s);
}

export function parseHHMM(s: string): number {
  const m = HHMM_RE.exec(s);
  if (!m) throw new Error(`Invalid HH:MM: ${JSON.stringify(s)}`);
  return Number(m[1]) * 60 + Number(m[2]);
}

export function formatHHMM(minutes: number): string {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return `${String(h).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: all parse/format/isValid tests pass.

- [ ] **Step 5: Commit**

```bash
git add tests/time.test.ts src/lib/time.ts
git commit -m "feat(time): parseHHMM, formatHHMM, isValidHHMM"
```

---

### Task 6: `lib/time.ts` — duration helpers (modulo midnight)

**Files:**
- Modify: `tests/time.test.ts`, `src/lib/time.ts`

- [ ] **Step 1: Append failing tests to `tests/time.test.ts`**

```ts
import { diffMinutesMod, addMinutesMod } from '$lib/time';

describe('diffMinutesMod', () => {
  it('returns 360 between 19:00 (prev) and 01:00 (next) crossing midnight', () => {
    expect(diffMinutesMod('19:00', '01:00')).toBe(6 * 60);
  });
  it('returns 60 within the same day', () => {
    expect(diffMinutesMod('07:00', '08:00')).toBe(60);
  });
  it('returns 0 when equal', () => {
    expect(diffMinutesMod('12:00', '12:00')).toBe(0);
  });
  it('returns positive duration always', () => {
    expect(diffMinutesMod('22:00', '21:00')).toBe(23 * 60);
  });
});

describe('addMinutesMod', () => {
  it('adds minutes within a day', () => {
    expect(addMinutesMod('07:00', 90)).toBe('08:30');
  });
  it('wraps past midnight', () => {
    expect(addMinutesMod('23:00', 90)).toBe('00:30');
  });
  it('subtracts (negative minutes) past midnight', () => {
    expect(addMinutesMod('00:30', -60)).toBe('23:30');
  });
});
```

- [ ] **Step 2: Run and verify failure**

```bash
npm test
```

Expected: FAIL ("diffMinutesMod is not exported").

- [ ] **Step 3: Append to `src/lib/time.ts`**

```ts
export function diffMinutesMod(from: string, to: string): number {
  const a = parseHHMM(from);
  const b = parseHHMM(to);
  return ((b - a) % 1440 + 1440) % 1440;
}

export function addMinutesMod(time: string, deltaMin: number): string {
  return formatHHMM(parseHHMM(time) + deltaMin);
}
```

- [ ] **Step 4: Tests pass**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/time.test.ts src/lib/time.ts
git commit -m "feat(time): diffMinutesMod, addMinutesMod"
```

---

### Task 7: `lib/age-params.ts` — the 8 age tiers as a constant

**Files:**
- Create: `tests/age-params.test.ts`, `src/lib/age-params.ts`

- [ ] **Step 1: Write failing tests**

`tests/age-params.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { AGE_PARAMS } from '$lib/age-params';

describe('AGE_PARAMS', () => {
  it('has 8 tiers', () => {
    expect(AGE_PARAMS).toHaveLength(8);
  });
  it('is sorted by ageMinMonths ascending', () => {
    for (let i = 1; i < AGE_PARAMS.length; i++) {
      expect(AGE_PARAMS[i].ageMinMonths).toBeGreaterThanOrEqual(AGE_PARAMS[i - 1].ageMinMonths);
    }
  });
  it('first tier starts at 0 months', () => {
    expect(AGE_PARAMS[0].ageMinMonths).toBe(0);
  });
  it('last tier ends at 36 months', () => {
    expect(AGE_PARAMS[AGE_PARAMS.length - 1].ageMaxMonths).toBe(36);
  });
  it('every tier has required fields', () => {
    for (const t of AGE_PARAMS) {
      expect(typeof t.label).toBe('string');
      expect(typeof t.naps).toBe('number');
      expect(typeof t.awakeWindowMin).toBe('number');
      expect(typeof t.beforeBedWindowMin).toBe('number');
      expect(typeof t.nightSleepH).toBe('number');
      expect(typeof t.daySleepH).toBe('number');
    }
  });
});
```

- [ ] **Step 2: Run, see failure**

```bash
npm test
```

Expected: FAIL ("Cannot find module $lib/age-params").

- [ ] **Step 3: Implement `src/lib/age-params.ts`**

```ts
export type AgeParams = {
  label: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  naps: number;
  awakeWindowMin: number;
  beforeBedWindowMin: number;
  nightSleepH: number;
  daySleepH: number;
};

export const AGE_PARAMS: readonly AgeParams[] = [
  { label: '0-3 mois',   ageMinMonths: 0,  ageMaxMonths: 3,  naps: 4, awakeWindowMin: 75,  beforeBedWindowMin: 60,  nightSleepH: 9,  daySleepH: 7   },
  { label: '3-4 mois',   ageMinMonths: 3,  ageMaxMonths: 4,  naps: 4, awakeWindowMin: 90,  beforeBedWindowMin: 90,  nightSleepH: 10, daySleepH: 5   },
  { label: '4-6 mois',   ageMinMonths: 4,  ageMaxMonths: 6,  naps: 3, awakeWindowMin: 120, beforeBedWindowMin: 120, nightSleepH: 11, daySleepH: 3.5 },
  { label: '6-9 mois',   ageMinMonths: 6,  ageMaxMonths: 9,  naps: 3, awakeWindowMin: 165, beforeBedWindowMin: 180, nightSleepH: 11, daySleepH: 3   },
  { label: '9-12 mois',  ageMinMonths: 9,  ageMaxMonths: 12, naps: 2, awakeWindowMin: 210, beforeBedWindowMin: 240, nightSleepH: 11, daySleepH: 2.5 },
  { label: '12-18 mois', ageMinMonths: 12, ageMaxMonths: 18, naps: 2, awakeWindowMin: 270, beforeBedWindowMin: 300, nightSleepH: 11, daySleepH: 2.5 },
  { label: '18-24 mois', ageMinMonths: 18, ageMaxMonths: 24, naps: 1, awakeWindowMin: 330, beforeBedWindowMin: 330, nightSleepH: 11, daySleepH: 2   },
  { label: '2-3 ans',    ageMinMonths: 24, ageMaxMonths: 36, naps: 1, awakeWindowMin: 360, beforeBedWindowMin: 360, nightSleepH: 11, daySleepH: 1.5 }
] as const;
```

- [ ] **Step 4: Tests pass**

```bash
npm test
```

- [ ] **Step 5: Commit**

```bash
git add tests/age-params.test.ts src/lib/age-params.ts
git commit -m "feat(age-params): 8-tier constants"
```

---

### Task 8: `lib/age-params.ts` — `paramsForAge` lookup

**Files:**
- Modify: `tests/age-params.test.ts`, `src/lib/age-params.ts`

- [ ] **Step 1: Append failing tests**

```ts
import { paramsForAge } from '$lib/age-params';

describe('paramsForAge', () => {
  it('returns 0-3 mois for 0', () => {
    expect(paramsForAge(0).label).toBe('0-3 mois');
  });
  it('returns 6-9 mois for 6', () => {
    expect(paramsForAge(6).label).toBe('6-9 mois');
  });
  it('returns 6-9 mois for 8 (within tier)', () => {
    expect(paramsForAge(8).label).toBe('6-9 mois');
  });
  it('clamps to first tier for negative input', () => {
    expect(paramsForAge(-3).label).toBe('0-3 mois');
  });
  it('clamps to last tier for input >= 36', () => {
    expect(paramsForAge(36).label).toBe('2-3 ans');
    expect(paramsForAge(60).label).toBe('2-3 ans');
  });
  it('returns the right tier at the boundary (Sheets parity: ascending match-≤)', () => {
    // 12 should match 12-18 (boundary inclusive on min, like VLOOKUP TRUE)
    expect(paramsForAge(12).label).toBe('12-18 mois');
  });
});
```

- [ ] **Step 2: Run, fail**

```bash
npm test
```

Expected: FAIL ("paramsForAge is not exported").

- [ ] **Step 3: Append to `src/lib/age-params.ts`**

```ts
export function paramsForAge(months: number): AgeParams {
  if (!Number.isFinite(months)) return AGE_PARAMS[0];
  if (months < AGE_PARAMS[0].ageMinMonths) return AGE_PARAMS[0];
  let chosen = AGE_PARAMS[0];
  for (const t of AGE_PARAMS) {
    if (t.ageMinMonths <= months) chosen = t;
    else break;
  }
  return chosen;
}
```

- [ ] **Step 4: Tests pass, commit**

```bash
npm test
git add tests/age-params.test.ts src/lib/age-params.ts
git commit -m "feat(age-params): paramsForAge lookup"
```

---

### Task 9: `lib/sleep-calc.ts` — `ageInMonths`

**Files:**
- Create: `tests/sleep-calc.test.ts`, `src/lib/sleep-calc.ts`

- [ ] **Step 1: Write failing tests**

`tests/sleep-calc.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { ageInMonths } from '$lib/sleep-calc';

describe('ageInMonths', () => {
  it('returns whole months between two dates', () => {
    expect(ageInMonths('2025-01-15', undefined, new Date('2025-07-15T12:00:00Z'))).toBe(6);
  });
  it('rounds down if the day-of-month has not passed', () => {
    expect(ageInMonths('2025-01-20', undefined, new Date('2025-07-15T12:00:00Z'))).toBe(5);
  });
  it('uses override when provided', () => {
    expect(ageInMonths('2025-01-15', 4, new Date('2025-07-15T12:00:00Z'))).toBe(4);
  });
  it('returns 0 for newborn', () => {
    expect(ageInMonths('2025-07-10', undefined, new Date('2025-07-15T12:00:00Z'))).toBe(0);
  });
  it('throws if birth date is in the future and no override', () => {
    expect(() => ageInMonths('2026-12-01', undefined, new Date('2025-07-15T12:00:00Z'))).toThrow();
  });
  it('clamps very old to a reasonable max (no upper throw)', () => {
    expect(ageInMonths('2020-01-15', undefined, new Date('2025-07-15T12:00:00Z'))).toBe(66);
  });
});
```

- [ ] **Step 2: Run, fail**

```bash
npm test
```

- [ ] **Step 3: Implement `src/lib/sleep-calc.ts` (initial)**

```ts
export function ageInMonths(birthDateISO: string, override?: number | null, today: Date = new Date()): number {
  if (override != null) return Math.max(0, Math.floor(override));
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDateISO);
  if (!m) throw new Error(`Invalid birth date: ${birthDateISO}`);
  const by = Number(m[1]);
  const bm = Number(m[2]);
  const bd = Number(m[3]);
  const birth = new Date(Date.UTC(by, bm - 1, bd));
  const ref = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  if (birth.getTime() > ref.getTime()) throw new Error('Birth date is in the future');
  let months = (ref.getUTCFullYear() - by) * 12 + (ref.getUTCMonth() - (bm - 1));
  if (ref.getUTCDate() < bd) months -= 1;
  return Math.max(0, months);
}
```

- [ ] **Step 4: Tests pass, commit**

```bash
npm test
git add tests/sleep-calc.test.ts src/lib/sleep-calc.ts
git commit -m "feat(sleep-calc): ageInMonths from DOB + override"
```

---

### Task 10: `lib/sleep-calc.ts` — `idealBedtime`

**Files:**
- Modify: `tests/sleep-calc.test.ts`, `src/lib/sleep-calc.ts`

- [ ] **Step 1: Append failing tests**

```ts
import { idealBedtime } from '$lib/sleep-calc';

describe('idealBedtime', () => {
  it('07:00 wake with 11h night → 20:00', () => {
    expect(idealBedtime('07:00', 11)).toBe('20:00');
  });
  it('handles wrap before midnight: 06:00 wake with 9h → 21:00', () => {
    expect(idealBedtime('06:00', 9)).toBe('21:00');
  });
  it('06:30 wake with 10.5h → 20:00', () => {
    expect(idealBedtime('06:30', 10.5)).toBe('20:00');
  });
  it('rounds to nearest minute', () => {
    expect(idealBedtime('07:00', 11.25)).toBe('19:45');
  });
});
```

- [ ] **Step 2: Run, fail**

- [ ] **Step 3: Append to `src/lib/sleep-calc.ts`**

```ts
import { parseHHMM, formatHHMM } from './time';

export function idealBedtime(wakeHHMM: string, nightSleepHours: number): string {
  const wakeMin = parseHHMM(wakeHHMM);
  const totalMin = wakeMin - Math.round(nightSleepHours * 60);
  return formatHHMM(totalMin);
}
```

- [ ] **Step 4: Tests pass, commit**

```bash
npm test
git add tests/sleep-calc.test.ts src/lib/sleep-calc.ts
git commit -m "feat(sleep-calc): idealBedtime"
```

---

### Task 11: `lib/sleep-calc.ts` — `suggestNextNap` and `suggestedBedtime`

**Files:**
- Modify: `tests/sleep-calc.test.ts`, `src/lib/sleep-calc.ts`

- [ ] **Step 1: Append failing tests**

```ts
import { suggestNextNap, suggestedBedtime } from '$lib/sleep-calc';

describe('suggestNextNap', () => {
  it('adds awakeWindowMin to last end time', () => {
    expect(suggestNextNap('07:00', 90)).toBe('08:30');
  });
  it('wraps past midnight', () => {
    expect(suggestNextNap('23:00', 120)).toBe('01:00');
  });
});

describe('suggestedBedtime', () => {
  const params = { beforeBedWindowMin: 180, nightSleepH: 11 } as const;

  it('returns idealBedtime when no nap end provided', () => {
    expect(suggestedBedtime({ wake: '07:00', napEnds: [] }, params)).toBe('20:00');
  });
  it('returns lastNap + beforeBedWindowMin when at least one nap', () => {
    expect(suggestedBedtime({ wake: '07:00', napEnds: ['10:00', '15:00'] }, params)).toBe('18:00');
  });
  it('uses the max of (wake, napEnds) — order-independent', () => {
    expect(suggestedBedtime({ wake: '07:00', napEnds: ['16:00', '10:00'] }, params)).toBe('19:00');
  });
  it('ignores empty/undefined nap ends', () => {
    expect(suggestedBedtime({ wake: '07:00', napEnds: ['', undefined, '15:00'] as (string|undefined)[] }, params))
      .toBe('18:00');
  });
});
```

- [ ] **Step 2: Run, fail**

- [ ] **Step 3: Append to `src/lib/sleep-calc.ts`**

```ts
export function suggestNextNap(lastEndHHMM: string, awakeWindowMin: number): string {
  return formatHHMM(parseHHMM(lastEndHHMM) + awakeWindowMin);
}

export type DayEvents = {
  wake?: string | null;
  napEnds: (string | null | undefined)[];
};

export function suggestedBedtime(
  events: DayEvents,
  params: { beforeBedWindowMin: number; nightSleepH: number }
): string | null {
  const valid = events.napEnds.filter((s): s is string => !!s && /^\d{2}:\d{2}$/.test(s));
  if (valid.length === 0) {
    if (!events.wake) return null;
    return idealBedtime(events.wake, params.nightSleepH);
  }
  const candidates = events.wake ? [events.wake, ...valid] : valid;
  let bestMin = -1;
  for (const t of candidates) {
    const m = parseHHMM(t);
    if (m > bestMin) bestMin = m;
  }
  return formatHHMM(bestMin + params.beforeBedWindowMin);
}
```

- [ ] **Step 4: Tests pass**

```bash
npm test
```

- [ ] **Step 5: Commit**

```bash
git add tests/sleep-calc.test.ts src/lib/sleep-calc.ts
git commit -m "feat(sleep-calc): suggestNextNap + suggestedBedtime"
```

---

## Phase 2 — Database schema & migrations

### Task 12: Drizzle schema

**Files:**
- Create: `src/lib/server/db/schema.ts`

- [ ] **Step 1: Write the schema**

```ts
import { sqliteTable, integer, text, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  isAdmin: integer('is_admin').notNull().default(0),
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
    bedtime: text('bedtime'),
    notes: text('notes'),
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/server/db/schema.ts
git commit -m "feat(db): Drizzle schema (users, sessions, invitations, babies, sleep_entries)"
```

---

### Task 13: Drizzle config + generate first migration

**Files:**
- Create: `drizzle.config.ts`, `drizzle/` (generated)

- [ ] **Step 1: Write `drizzle.config.ts`**

```ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/lib/server/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_PATH ?? './data/babysleep.sqlite'
  }
});
```

- [ ] **Step 2: Generate the first migration**

```bash
npm run db:generate
```

Expected: a `drizzle/0000_*.sql` file is created with `CREATE TABLE` statements for all 5 tables.

- [ ] **Step 3: Commit migration**

```bash
git add drizzle.config.ts drizzle/
git commit -m "feat(db): initial migration"
```

---

### Task 14: DB connection module + migration runner

**Files:**
- Create: `src/lib/server/db/index.ts`, `src/lib/server/db/migrate.ts`

- [ ] **Step 1: Write `src/lib/server/db/index.ts`**

```ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

export function createDb(path: string) {
  const sqlite = new Database(path);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('synchronous = NORMAL');
  const db = drizzle(sqlite, { schema });
  return { db, sqlite };
}

let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (_db) return _db;
  const path = process.env.DATABASE_PATH ?? './data/babysleep.sqlite';
  _db = createDb(path);
  return _db;
}

export { schema };
```

- [ ] **Step 2: Write `src/lib/server/db/migrate.ts`**

```ts
import 'dotenv/config';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { getDb } from './index';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const path = process.env.DATABASE_PATH ?? './data/babysleep.sqlite';
mkdirSync(dirname(path), { recursive: true });
const { db } = getDb();
migrate(db, { migrationsFolder: './drizzle' });
console.log('Migrations applied.');
```

- [ ] **Step 3: Verify it runs locally**

```bash
mkdir -p data
DATABASE_PATH=./data/babysleep.sqlite npm run db:migrate
```

Expected: prints "Migrations applied." and a `./data/babysleep.sqlite` file appears (plus `-wal`, `-shm`).

- [ ] **Step 4: Commit**

```bash
git add src/lib/server/db/
git commit -m "feat(db): connection module + migration runner"
```

---

### Task 15: Test helper for in-memory DB

**Files:**
- Create: `tests/helpers/db.ts`

- [ ] **Step 1: Write helper**

```ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import * as schema from '../../src/lib/server/db/schema';

export function makeTestDb() {
  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: './drizzle' });
  return { db, sqlite, schema };
}
```

- [ ] **Step 2: Smoke-test it**

Create `tests/server/db-helper.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { makeTestDb } from '../helpers/db';

describe('makeTestDb', () => {
  it('creates a working in-memory DB with all tables', () => {
    const { sqlite } = makeTestDb();
    const tables = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all() as { name: string }[];
    const names = tables.map((t) => t.name).filter((n) => !n.startsWith('__'));
    expect(names).toEqual(expect.arrayContaining(['users', 'sessions', 'invitations', 'babies', 'sleep_entries']));
  });
});
```

- [ ] **Step 3: Tests pass, commit**

```bash
npm test
git add tests/helpers/db.ts tests/server/db-helper.test.ts
git commit -m "test: in-memory DB helper"
```

---

## Phase 3 — Server auth primitives

### Task 16: Password hashing/verify

**Files:**
- Create: `src/lib/server/auth/password.ts`, `tests/server/auth-password.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, isStrongEnough } from '../../src/lib/server/auth/password';

describe('hashPassword + verifyPassword', () => {
  it('produces different hashes for the same input', async () => {
    const a = await hashPassword('correct horse battery staple');
    const b = await hashPassword('correct horse battery staple');
    expect(a).not.toBe(b);
  });
  it('verifyPassword returns true for correct, false for wrong', async () => {
    const h = await hashPassword('hello world');
    expect(await verifyPassword(h, 'hello world')).toBe(true);
    expect(await verifyPassword(h, 'hello world!')).toBe(false);
  });
}, 20_000);

describe('isStrongEnough', () => {
  it('rejects passwords shorter than 10 chars', () => {
    expect(isStrongEnough('short')).toBe(false);
    expect(isStrongEnough('123456789')).toBe(false);
  });
  it('accepts ≥ 10 chars', () => {
    expect(isStrongEnough('1234567890')).toBe(true);
  });
});
```

- [ ] **Step 2: Run, fail**

- [ ] **Step 3: Implement**

```ts
import { hash, verify, Algorithm } from '@node-rs/argon2';

const ARGON_OPTS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
  algorithm: Algorithm.Argon2id
};

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, ARGON_OPTS);
}

export async function verifyPassword(hashStr: string, plain: string): Promise<boolean> {
  try {
    return await verify(hashStr, plain);
  } catch {
    return false;
  }
}

export function isStrongEnough(plain: string): boolean {
  return typeof plain === 'string' && plain.length >= 10;
}
```

- [ ] **Step 4: Tests pass, commit**

```bash
npm test
git add src/lib/server/auth/password.ts tests/server/auth-password.test.ts
git commit -m "feat(auth): argon2id password hashing"
```

---

### Task 17: Session create/lookup/refresh/delete + sliding expiration

**Files:**
- Create: `src/lib/server/auth/session.ts`, `tests/server/auth-session.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import {
  createSession,
  getSessionWithUser,
  refreshSessionIfStale,
  deleteSession,
  deleteOtherSessionsForUser,
  purgeExpiredSessions,
  SESSION_TTL_SEC,
  SESSION_HARD_CAP_SEC
} from '../../src/lib/server/auth/session';

function now() {
  return Math.floor(Date.now() / 1000);
}

async function makeUser(db: ReturnType<typeof makeTestDb>) {
  const { sqlite } = db;
  const stmt = sqlite.prepare(
    "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
  );
  const t = now();
  const info = stmt.run('alice@example.com', 'x', t, t);
  return Number(info.lastInsertRowid);
}

describe('sessions', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('creates a session and looks it up with the user', async () => {
    const uid = await makeUser(tdb);
    const sess = createSession(tdb.db, uid, 'curl/8');
    const found = getSessionWithUser(tdb.db, sess.id, now());
    expect(found?.user.id).toBe(uid);
    expect(found?.session.id).toBe(sess.id);
  });

  it('returns null for unknown session id', () => {
    expect(getSessionWithUser(tdb.db, 'nonexistent', now())).toBeNull();
  });

  it('returns null for expired session', async () => {
    const uid = await makeUser(tdb);
    const sess = createSession(tdb.db, uid, 'x');
    expect(getSessionWithUser(tdb.db, sess.id, now() + SESSION_TTL_SEC + 10)).toBeNull();
  });

  it('refreshSessionIfStale extends a session older than 24h', async () => {
    const uid = await makeUser(tdb);
    const t0 = now() - 25 * 3600;
    tdb.sqlite.prepare(
      "INSERT INTO sessions (id, user_id, expires_at, last_used_at, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run('abc', uid, t0 + SESSION_TTL_SEC, t0, 'x', t0);
    refreshSessionIfStale(tdb.db, 'abc', now());
    const row = tdb.sqlite.prepare('SELECT * FROM sessions WHERE id = ?').get('abc') as any;
    expect(row.expires_at).toBeGreaterThan(now() + SESSION_TTL_SEC - 60);
  });

  it('refreshSessionIfStale revokes session past hard cap', async () => {
    const uid = await makeUser(tdb);
    const t0 = now() - SESSION_HARD_CAP_SEC - 10;
    tdb.sqlite.prepare(
      "INSERT INTO sessions (id, user_id, expires_at, last_used_at, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run('abc', uid, now() + 1000, now() - 1000, 'x', t0);
    refreshSessionIfStale(tdb.db, 'abc', now());
    expect(getSessionWithUser(tdb.db, 'abc', now())).toBeNull();
  });

  it('deleteSession removes a single row', async () => {
    const uid = await makeUser(tdb);
    const sess = createSession(tdb.db, uid, 'x');
    deleteSession(tdb.db, sess.id);
    expect(getSessionWithUser(tdb.db, sess.id, now())).toBeNull();
  });

  it('deleteOtherSessionsForUser keeps current, deletes the rest', async () => {
    const uid = await makeUser(tdb);
    const a = createSession(tdb.db, uid, 'a');
    const b = createSession(tdb.db, uid, 'b');
    deleteOtherSessionsForUser(tdb.db, uid, a.id);
    expect(getSessionWithUser(tdb.db, a.id, now())).not.toBeNull();
    expect(getSessionWithUser(tdb.db, b.id, now())).toBeNull();
  });

  it('purgeExpiredSessions removes only expired', async () => {
    const uid = await makeUser(tdb);
    const live = createSession(tdb.db, uid, 'x');
    tdb.sqlite.prepare(
      "INSERT INTO sessions (id, user_id, expires_at, last_used_at, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run('dead', uid, now() - 10, now() - 1000, 'x', now() - 2000);
    purgeExpiredSessions(tdb.db, now());
    expect(getSessionWithUser(tdb.db, live.id, now())).not.toBeNull();
    expect(getSessionWithUser(tdb.db, 'dead', now())).toBeNull();
  });
});
```

- [ ] **Step 2: Run, fail**

- [ ] **Step 3: Implement `src/lib/server/auth/session.ts`**

```ts
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
```

- [ ] **Step 4: Tests pass, commit**

```bash
npm test
git add src/lib/server/auth/session.ts tests/server/auth-session.test.ts
git commit -m "feat(auth): session create/lookup/refresh/delete with sliding TTL"
```

---

### Task 18: Invitations create/use

**Files:**
- Create: `src/lib/server/auth/invitations.ts`, `tests/server/auth-invitations.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import {
  createInvitation,
  findUsableInvitation,
  markInvitationUsed,
  listInvitations,
  INVITATION_TTL_SEC
} from '../../src/lib/server/auth/invitations';

function makeAdmin(tdb: ReturnType<typeof makeTestDb>) {
  const t = Math.floor(Date.now() / 1000);
  const info = tdb.sqlite.prepare(
    "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 1, ?, ?)"
  ).run('admin@x', 'x', t, t);
  return Number(info.lastInsertRowid);
}

describe('invitations', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('createInvitation generates a unique token with 7-day expiry', () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    expect(inv.token.length).toBeGreaterThan(20);
    expect(inv.expiresAt - inv.createdAt).toBe(INVITATION_TTL_SEC);
  });

  it('findUsableInvitation returns it if not used and not expired', () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    expect(findUsableInvitation(tdb.db, inv.token)).not.toBeNull();
  });

  it('returns null for unknown token', () => {
    expect(findUsableInvitation(tdb.db, 'nope')).toBeNull();
  });

  it('returns null for expired token', () => {
    const adminId = makeAdmin(tdb);
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO invitations (token, created_by, expires_at, created_at) VALUES (?, ?, ?, ?)"
    ).run('xxx', adminId, t - 10, t - 1000);
    expect(findUsableInvitation(tdb.db, 'xxx')).toBeNull();
  });

  it('returns null for used token', () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    markInvitationUsed(tdb.db, inv.id, adminId);
    expect(findUsableInvitation(tdb.db, inv.token)).toBeNull();
  });

  it('listInvitations returns all, newest first', () => {
    const adminId = makeAdmin(tdb);
    const a = createInvitation(tdb.db, adminId);
    const b = createInvitation(tdb.db, adminId);
    const all = listInvitations(tdb.db);
    expect(all).toHaveLength(2);
    expect(all[0].id).toBe(b.id);
    expect(all[1].id).toBe(a.id);
  });
});
```

- [ ] **Step 2: Run, fail**

- [ ] **Step 3: Implement**

```ts
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
  return db.select().from(schema.invitations).orderBy(desc(schema.invitations.createdAt)).all();
}
```

- [ ] **Step 4: Tests pass, commit**

```bash
npm test
git add src/lib/server/auth/invitations.ts tests/server/auth-invitations.test.ts
git commit -m "feat(auth): invitations create/find/use/list"
```

---

### Task 19: Bootstrap admin from env

**Files:**
- Create: `src/lib/server/auth/bootstrap.ts`, `tests/server/auth-bootstrap.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { bootstrapAdmin } from '../../src/lib/server/auth/bootstrap';

describe('bootstrapAdmin', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('creates admin if users table is empty', async () => {
    await bootstrapAdmin(tdb.db, { email: 'admin@x', password: '12345678ab' });
    const u = tdb.sqlite.prepare('SELECT * FROM users WHERE email = ?').get('admin@x') as any;
    expect(u.is_admin).toBe(1);
  });

  it('is a no-op if users table is not empty', async () => {
    tdb.sqlite.prepare(
      "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
    ).run('preexisting@x', 'x', 0, 0);
    await bootstrapAdmin(tdb.db, { email: 'admin@x', password: '12345678ab' });
    const count = tdb.sqlite.prepare('SELECT COUNT(*) AS n FROM users').get() as any;
    expect(count.n).toBe(1);
  });

  it('no-op if env vars are missing', async () => {
    await bootstrapAdmin(tdb.db, { email: undefined, password: undefined });
    const n = (tdb.sqlite.prepare('SELECT COUNT(*) AS n FROM users').get() as any).n;
    expect(n).toBe(0);
  });

  it('rejects weak password', async () => {
    await expect(bootstrapAdmin(tdb.db, { email: 'admin@x', password: 'short' })).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run, fail**

- [ ] **Step 3: Implement**

```ts
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';
import { hashPassword, isStrongEnough } from './password';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export async function bootstrapAdmin(db: DB, env: { email?: string; password?: string }) {
  if (!env.email || !env.password) return;
  const count = db.select().from(schema.users).all().length;
  if (count > 0) return;
  if (!isStrongEnough(env.password)) {
    throw new Error('ADMIN_PASSWORD too weak (need ≥ 10 chars)');
  }
  const t = Math.floor(Date.now() / 1000);
  const hash = await hashPassword(env.password);
  db.insert(schema.users).values({
    email: env.email.toLowerCase().trim(),
    passwordHash: hash,
    isAdmin: 1,
    createdAt: t,
    updatedAt: t
  }).run();
}
```

- [ ] **Step 4: Tests pass, commit**

```bash
npm test
git add src/lib/server/auth/bootstrap.ts tests/server/auth-bootstrap.test.ts
git commit -m "feat(auth): bootstrapAdmin from env"
```

---

## Phase 4 — Auth UI (routes)

### Task 20: hooks.server.ts + locals typing + base layout

**Files:**
- Modify: `src/app.d.ts`, create `src/hooks.server.ts`, `src/routes/+layout.svelte`, `src/routes/+page.server.ts`, `src/routes/+error.svelte`, `tests/helpers/http.ts`

- [ ] **Step 1: Update `src/app.d.ts`**

```ts
import type { Session, User } from '$lib/server/db/schema';

declare global {
  namespace App {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
    interface PageData {
      user: User | null;
    }
    interface Error {}
    interface Platform {}
  }
}

export {};
```

- [ ] **Step 2: Create `src/hooks.server.ts`**

```ts
import type { Handle } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import {
  getSessionWithUser,
  refreshSessionIfStale,
  purgeExpiredSessions,
  SESSION_TTL_SEC
} from '$lib/server/auth/session';
import { bootstrapAdmin } from '$lib/server/auth/bootstrap';

const { db } = getDb();

let bootstrapped = false;
async function maybeBootstrap() {
  if (bootstrapped) return;
  bootstrapped = true;
  await bootstrapAdmin(db, { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
}

setInterval(() => purgeExpiredSessions(db), 3600 * 1000);

export const handle: Handle = async ({ event, resolve }) => {
  await maybeBootstrap();
  const sessionId = event.cookies.get('session');
  event.locals.user = null;
  event.locals.session = null;
  if (sessionId) {
    const row = getSessionWithUser(db, sessionId);
    if (row) {
      refreshSessionIfStale(db, sessionId);
      event.locals.user = row.user;
      event.locals.session = row.session;
    } else {
      event.cookies.delete('session', { path: '/' });
    }
  }
  return resolve(event);
};

export function setSessionCookie(cookies: import('@sveltejs/kit').Cookies, sessionId: string) {
  cookies.set('session', sessionId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_SEC
  });
}
```

- [ ] **Step 3: Create `src/routes/+page.server.ts`**

```ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) throw redirect(303, '/app');
  throw redirect(303, '/login');
};
```

- [ ] **Step 4: Create `src/routes/+layout.svelte`**

```svelte
<script lang="ts">
  let { children, data } = $props();
</script>

<svelte:head>
  <link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<main>
  {@render children()}
</main>

<style>
  :global(body) {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    margin: 0;
    background: #f7f7f7;
    color: #1f2937;
  }
  main { max-width: 800px; margin: 0 auto; padding: 1rem; }
</style>
```

- [ ] **Step 5: Create `src/routes/+error.svelte`**

```svelte
<script lang="ts">
  import { page } from '$app/state';
</script>
<h1>Erreur {page.status}</h1>
<p>{page.error?.message ?? 'Une erreur est survenue.'}</p>
<p><a href="/">Retour à l'accueil</a></p>
```

- [ ] **Step 6: Create `tests/helpers/http.ts`** (used by later route tests)

```ts
import { handle as appHandle } from '../../src/hooks.server';

export async function callHandle(req: Request): Promise<Response> {
  // Minimal SvelteKit-style handle invocation for testing custom logic.
  // For full route testing we'll use vitest's HTTP client against a built server.
  // This helper exists primarily for hooks.server.ts cookie path tests.
  const event: any = {
    request: req,
    url: new URL(req.url),
    cookies: makeCookies(req),
    locals: {},
    params: {},
    route: { id: '/' },
    isDataRequest: false,
    isSubRequest: false,
    platform: undefined,
    setHeaders: () => {},
    getClientAddress: () => '127.0.0.1'
  };
  const resolve = async () => new Response('ok');
  return appHandle({ event, resolve } as any);
}

function makeCookies(req: Request) {
  const jar = new Map<string, string>();
  const ck = req.headers.get('cookie') ?? '';
  for (const part of ck.split(';')) {
    const [k, v] = part.split('=').map((s) => s?.trim() ?? '');
    if (k) jar.set(k, decodeURIComponent(v ?? ''));
  }
  return {
    get: (k: string) => jar.get(k),
    set: (k: string, v: string) => jar.set(k, v),
    delete: (k: string) => jar.delete(k)
  };
}
```

- [ ] **Step 7: `npm run check`, commit**

```bash
npm run check
git add -A
git commit -m "feat(auth): hooks.server, locals typing, base layout"
```

---

### Task 21: `/login` page + form action

**Files:**
- Create: `src/routes/login/+page.server.ts`, `src/routes/login/+page.svelte`, `tests/server/routes-login.test.ts`

- [ ] **Step 1: Write failing test for the action's pure logic**

`tests/server/routes-login.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { hashPassword } from '../../src/lib/server/auth/password';
import { attemptLogin } from '../../src/routes/login/_logic';

describe('attemptLogin', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('returns the user + new session id on correct creds', async () => {
    const hash = await hashPassword('hello world!');
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
    ).run('alice@x', hash, t, t);
    const res = await attemptLogin(tdb.db, { email: 'alice@x', password: 'hello world!' }, 'curl');
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.session.id.length).toBeGreaterThan(20);
  });

  it('returns error on unknown email', async () => {
    const res = await attemptLogin(tdb.db, { email: 'nope@x', password: 'whatever' }, 'curl');
    expect(res.ok).toBe(false);
  });

  it('returns error on wrong password', async () => {
    const hash = await hashPassword('hello world!');
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
    ).run('alice@x', hash, t, t);
    const res = await attemptLogin(tdb.db, { email: 'alice@x', password: 'wrong wrong wrong' }, 'curl');
    expect(res.ok).toBe(false);
  });

  it('email is case-insensitive', async () => {
    const hash = await hashPassword('hello world!');
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
    ).run('alice@x', hash, t, t);
    const res = await attemptLogin(tdb.db, { email: 'ALICE@X', password: 'hello world!' }, 'curl');
    expect(res.ok).toBe(true);
  });
}, 30_000);
```

- [ ] **Step 2: Create `src/routes/login/_logic.ts`**

```ts
import { eq } from 'drizzle-orm';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '$lib/server/db/schema';
import { verifyPassword } from '$lib/server/auth/password';
import { createSession } from '$lib/server/auth/session';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export type LoginResult =
  | { ok: true; user: schema.User; session: { id: string } }
  | { ok: false; reason: 'invalid' };

export async function attemptLogin(
  db: DB,
  input: { email: string; password: string },
  userAgent: string | null
): Promise<LoginResult> {
  const email = String(input.email ?? '').toLowerCase().trim();
  const password = String(input.password ?? '');
  if (!email || !password) return { ok: false, reason: 'invalid' };
  const user = db.select().from(schema.users).where(eq(schema.users.email, email)).all()[0];
  if (!user) return { ok: false, reason: 'invalid' };
  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) return { ok: false, reason: 'invalid' };
  const session = createSession(db, user.id, userAgent);
  return { ok: true, user, session: { id: session.id } };
}
```

- [ ] **Step 3: Run tests, pass**

```bash
npm test
```

- [ ] **Step 4: Create `src/routes/login/+page.server.ts`**

```ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { attemptLogin } from './_logic';
import { setSessionCookie } from '../../hooks.server';

export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) throw redirect(303, '/app');
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const ua = request.headers.get('user-agent') ?? null;
    const { db } = getDb();
    const res = await attemptLogin(db, { email, password }, ua);
    if (!res.ok) return fail(400, { error: 'Identifiants invalides.', email });
    setSessionCookie(cookies, res.session.id);
    throw redirect(303, '/app');
  }
};
```

- [ ] **Step 5: Create `src/routes/login/+page.svelte`**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>

<h1>Connexion</h1>
{#if form?.error}
  <p class="error" role="alert">{form.error}</p>
{/if}
<form method="POST" use:enhance>
  <label>
    Email
    <input type="email" name="email" autocomplete="username" required value={form?.email ?? ''} />
  </label>
  <label>
    Mot de passe
    <input type="password" name="password" autocomplete="current-password" required />
  </label>
  <button type="submit">Se connecter</button>
</form>

<style>
  form { display: grid; gap: 1rem; max-width: 360px; }
  label { display: grid; gap: 0.25rem; }
  input { padding: 0.5rem; }
  button { padding: 0.5rem 1rem; }
  .error { color: #b91c1c; }
</style>
```

- [ ] **Step 6: Commit**

```bash
npm test && npm run check
git add -A
git commit -m "feat(auth): /login page + action"
```

---

### Task 22: `/logout`

**Files:**
- Create: `src/routes/logout/+server.ts`

- [ ] **Step 1: Write the route**

```ts
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { deleteSession } from '$lib/server/auth/session';

export const POST: RequestHandler = async ({ locals, cookies }) => {
  if (locals.session) {
    const { db } = getDb();
    deleteSession(db, locals.session.id);
  }
  cookies.delete('session', { path: '/' });
  throw redirect(303, '/login');
};
```

- [ ] **Step 2: Commit**

```bash
npm run check
git add src/routes/logout/+server.ts
git commit -m "feat(auth): /logout endpoint"
```

---

### Task 23: `/signup` with token validation

**Files:**
- Create: `src/routes/signup/+page.server.ts`, `src/routes/signup/+page.svelte`, `tests/server/routes-signup.test.ts`

- [ ] **Step 1: Write failing tests for the signup logic**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { createInvitation } from '../../src/lib/server/auth/invitations';
import { signupWithToken } from '../../src/routes/signup/_logic';

function makeAdmin(tdb: ReturnType<typeof makeTestDb>) {
  const t = Math.floor(Date.now() / 1000);
  const info = tdb.sqlite.prepare(
    "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 1, ?, ?)"
  ).run('admin@x', 'x', t, t);
  return Number(info.lastInsertRowid);
}

describe('signupWithToken', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('rejects unknown token', async () => {
    const r = await signupWithToken(tdb.db, { token: 'nope', email: 'b@x', password: '1234567890' });
    expect(r.ok).toBe(false);
  });

  it('creates user and marks invitation used on success', async () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    const r = await signupWithToken(tdb.db, { token: inv.token, email: 'b@x', password: '1234567890' });
    expect(r.ok).toBe(true);
    const u = tdb.sqlite.prepare('SELECT * FROM users WHERE email = ?').get('b@x') as any;
    expect(u).toBeTruthy();
    const used = tdb.sqlite.prepare('SELECT * FROM invitations WHERE id = ?').get(inv.id) as any;
    expect(used.used_at).not.toBeNull();
  });

  it('rejects already-used token', async () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    await signupWithToken(tdb.db, { token: inv.token, email: 'b@x', password: '1234567890' });
    const r2 = await signupWithToken(tdb.db, { token: inv.token, email: 'c@x', password: '1234567890' });
    expect(r2.ok).toBe(false);
  });

  it('rejects weak password', async () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    const r = await signupWithToken(tdb.db, { token: inv.token, email: 'b@x', password: 'short' });
    expect(r.ok).toBe(false);
  });

  it('rejects duplicate email', async () => {
    const adminId = makeAdmin(tdb);
    const inv = createInvitation(tdb.db, adminId);
    await signupWithToken(tdb.db, { token: inv.token, email: 'b@x', password: '1234567890' });
    const inv2 = createInvitation(tdb.db, adminId);
    const r2 = await signupWithToken(tdb.db, { token: inv2.token, email: 'b@x', password: '1234567890' });
    expect(r2.ok).toBe(false);
  });
}, 30_000);
```

- [ ] **Step 2: Create `src/routes/signup/_logic.ts`**

```ts
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import { hashPassword, isStrongEnough } from '$lib/server/auth/password';
import { findUsableInvitation, markInvitationUsed } from '$lib/server/auth/invitations';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export type SignupResult =
  | { ok: true; userId: number }
  | { ok: false; reason: 'bad-token' | 'weak-password' | 'duplicate-email' | 'invalid-email' };

export async function signupWithToken(
  db: DB,
  input: { token: string; email: string; password: string }
): Promise<SignupResult> {
  const token = String(input.token ?? '');
  const email = String(input.email ?? '').toLowerCase().trim();
  const password = String(input.password ?? '');

  if (!email.includes('@')) return { ok: false, reason: 'invalid-email' };
  if (!isStrongEnough(password)) return { ok: false, reason: 'weak-password' };

  const inv = findUsableInvitation(db, token);
  if (!inv) return { ok: false, reason: 'bad-token' };

  const existing = db.select().from(schema.users).where(eq(schema.users.email, email)).all()[0];
  if (existing) return { ok: false, reason: 'duplicate-email' };

  const hash = await hashPassword(password);
  const t = Math.floor(Date.now() / 1000);
  const row = db.insert(schema.users).values({
    email, passwordHash: hash, isAdmin: 0, createdAt: t, updatedAt: t
  }).returning().all()[0];
  markInvitationUsed(db, inv.id, row.id);
  return { ok: true, userId: row.id };
}
```

- [ ] **Step 3: Tests pass**

```bash
npm test
```

- [ ] **Step 4: Create `src/routes/signup/+page.server.ts`**

```ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { findUsableInvitation } from '$lib/server/auth/invitations';
import { signupWithToken } from './_logic';

export const load: PageServerLoad = ({ url, locals }) => {
  if (locals.user) throw redirect(303, '/app');
  const token = url.searchParams.get('token') ?? '';
  const { db } = getDb();
  const inv = findUsableInvitation(db, token);
  return { tokenValid: !!inv, token };
};

export const actions: Actions = {
  default: async ({ request, url }) => {
    const form = await request.formData();
    const token = String(form.get('token') ?? url.searchParams.get('token') ?? '');
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const confirm = String(form.get('confirm') ?? '');
    if (password !== confirm) {
      return fail(400, { error: 'Les mots de passe ne correspondent pas.', email });
    }
    const { db } = getDb();
    const res = await signupWithToken(db, { token, email, password });
    if (!res.ok) {
      const msg = ({
        'bad-token': 'Lien d\'invitation invalide ou expiré.',
        'weak-password': 'Mot de passe trop court (≥ 10 caractères).',
        'duplicate-email': 'Un compte existe déjà avec cet email.',
        'invalid-email': 'Email invalide.'
      })[res.reason];
      return fail(400, { error: msg, email });
    }
    throw redirect(303, '/login');
  }
};
```

- [ ] **Step 5: Create `src/routes/signup/+page.svelte`**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  let { data, form } = $props();
</script>

<h1>Inscription</h1>

{#if !data.tokenValid}
  <p>Inscription sur invitation uniquement. Demande un lien à l'administrateur.</p>
{:else}
  {#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
  <form method="POST" use:enhance>
    <input type="hidden" name="token" value={data.token} />
    <label>Email
      <input type="email" name="email" autocomplete="username" required value={form?.email ?? ''} />
    </label>
    <label>Mot de passe (≥ 10 caractères)
      <input type="password" name="password" autocomplete="new-password" required minlength="10" />
    </label>
    <label>Confirmer
      <input type="password" name="confirm" autocomplete="new-password" required minlength="10" />
    </label>
    <button type="submit">Créer mon compte</button>
  </form>
{/if}

<style>
  form { display: grid; gap: 1rem; max-width: 360px; }
  label { display: grid; gap: 0.25rem; }
  input { padding: 0.5rem; }
  button { padding: 0.5rem 1rem; }
  .error { color: #b91c1c; }
</style>
```

- [ ] **Step 6: Commit**

```bash
npm run check
git add -A
git commit -m "feat(auth): /signup with token validation"
```

---

### Task 24: `/admin/invitations` page (admin guard)

**Files:**
- Create: `src/routes/admin/invitations/+page.server.ts`, `src/routes/admin/invitations/+page.svelte`

- [ ] **Step 1: Server logic**

```ts
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { createInvitation, listInvitations } from '$lib/server/auth/invitations';

function requireAdmin(locals: App.Locals) {
  if (!locals.user) throw redirect(303, '/login');
  if (!locals.user.isAdmin) throw error(403, 'Réservé aux administrateurs');
}

export const load: PageServerLoad = ({ locals, url }) => {
  requireAdmin(locals);
  const { db } = getDb();
  const list = listInvitations(db).map((inv) => ({
    ...inv,
    link: `${url.origin}/signup?token=${inv.token}`
  }));
  return { invitations: list };
};

export const actions: Actions = {
  create: ({ locals }) => {
    requireAdmin(locals);
    const { db } = getDb();
    createInvitation(db, locals.user!.id);
    return { ok: true };
  }
};
```

- [ ] **Step 2: Page UI**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  let { data } = $props();

  function statusOf(inv: any): string {
    const now = Math.floor(Date.now() / 1000);
    if (inv.usedAt) return 'utilisée';
    if (inv.expiresAt < now) return 'expirée';
    return 'en attente';
  }

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); } catch {}
  }
</script>

<h1>Invitations</h1>
<form method="POST" action="?/create" use:enhance>
  <button type="submit">Générer une invitation</button>
</form>

<table>
  <thead>
    <tr><th>Créée</th><th>Expire</th><th>Statut</th><th>Lien</th></tr>
  </thead>
  <tbody>
    {#each data.invitations as inv}
      <tr>
        <td>{new Date(inv.createdAt * 1000).toLocaleDateString('fr-FR')}</td>
        <td>{new Date(inv.expiresAt * 1000).toLocaleDateString('fr-FR')}</td>
        <td>{statusOf(inv)}</td>
        <td>
          <button type="button" onclick={() => copy(inv.link)} title={inv.link}>Copier</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
  th, td { padding: 0.5rem; border-bottom: 1px solid #e5e7eb; text-align: left; }
</style>
```

- [ ] **Step 3: Commit**

```bash
npm run check
git add -A
git commit -m "feat(auth): /admin/invitations admin-only page"
```

---

### Task 25: `/account` (read) — list sessions + password form skeleton

**Files:**
- Create: `src/routes/account/+page.server.ts`, `src/routes/account/+page.svelte`

- [ ] **Step 1: Server load**

```ts
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { listSessionsForUser } from '$lib/server/auth/session';

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
  return { user: { email: locals.user.email, isAdmin: !!locals.user.isAdmin }, sessions };
};

export const actions: Actions = {
  // populated in Task 26
};
```

- [ ] **Step 2: Page UI**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  let { data, form } = $props();
</script>

<h1>Mon compte</h1>
<p>Connecté en tant que <strong>{data.user.email}</strong>{#if data.user.isAdmin} (admin){/if}.</p>

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

- [ ] **Step 3: Commit**

```bash
npm run check
git add -A
git commit -m "feat(account): list sessions"
```

---

### Task 26: `/account` — password change action

**Files:**
- Modify: `src/routes/account/+page.server.ts`, create `tests/server/routes-account.test.ts`

- [ ] **Step 1: Write failing test for the pure logic helper**

`tests/server/routes-account.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { hashPassword } from '../../src/lib/server/auth/password';
import { changePassword } from '../../src/routes/account/_logic';

async function makeUser(tdb: ReturnType<typeof makeTestDb>, pw: string) {
  const hash = await hashPassword(pw);
  const t = Math.floor(Date.now() / 1000);
  const info = tdb.sqlite.prepare(
    "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, ?, 0, ?, ?)"
  ).run('alice@x', hash, t, t);
  return Number(info.lastInsertRowid);
}

describe('changePassword', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('rejects wrong current password', async () => {
    const uid = await makeUser(tdb, 'helloworld1');
    const r = await changePassword(tdb.db, uid, 'current-session', {
      current: 'WRONG', next: '1234567890', confirm: '1234567890'
    });
    expect(r.ok).toBe(false);
  });

  it('rejects mismatched confirm', async () => {
    const uid = await makeUser(tdb, 'helloworld1');
    const r = await changePassword(tdb.db, uid, 'current-session', {
      current: 'helloworld1', next: 'AAAAAAAAAA', confirm: 'BBBBBBBBBB'
    });
    expect(r.ok).toBe(false);
  });

  it('rejects weak new password', async () => {
    const uid = await makeUser(tdb, 'helloworld1');
    const r = await changePassword(tdb.db, uid, 'current-session', {
      current: 'helloworld1', next: 'short', confirm: 'short'
    });
    expect(r.ok).toBe(false);
  });

  it('on success: updates hash + deletes other sessions, keeps current', async () => {
    const uid = await makeUser(tdb, 'helloworld1');
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO sessions (id, user_id, expires_at, last_used_at, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run('current', uid, t + 1000, t, 'a', t);
    tdb.sqlite.prepare(
      "INSERT INTO sessions (id, user_id, expires_at, last_used_at, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run('other', uid, t + 1000, t, 'b', t);
    const r = await changePassword(tdb.db, uid, 'current', {
      current: 'helloworld1', next: 'AAAAAAAAAA1', confirm: 'AAAAAAAAAA1'
    });
    expect(r.ok).toBe(true);
    const rows = tdb.sqlite.prepare('SELECT id FROM sessions WHERE user_id = ?').all(uid) as any[];
    expect(rows.map((r) => r.id)).toEqual(['current']);
  });
}, 60_000);
```

- [ ] **Step 2: Implement `src/routes/account/_logic.ts`**

```ts
import { eq } from 'drizzle-orm';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '$lib/server/db/schema';
import { hashPassword, verifyPassword, isStrongEnough } from '$lib/server/auth/password';
import { deleteOtherSessionsForUser } from '$lib/server/auth/session';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export type ChangeResult =
  | { ok: true }
  | { ok: false; reason: 'wrong-current' | 'mismatch' | 'weak' };

export async function changePassword(
  db: DB,
  userId: number,
  currentSessionId: string,
  input: { current: string; next: string; confirm: string }
): Promise<ChangeResult> {
  if (input.next !== input.confirm) return { ok: false, reason: 'mismatch' };
  if (!isStrongEnough(input.next)) return { ok: false, reason: 'weak' };
  const u = db.select().from(schema.users).where(eq(schema.users.id, userId)).all()[0];
  if (!u) return { ok: false, reason: 'wrong-current' };
  if (!(await verifyPassword(u.passwordHash, input.current))) return { ok: false, reason: 'wrong-current' };
  const hash = await hashPassword(input.next);
  const t = Math.floor(Date.now() / 1000);
  db.update(schema.users).set({ passwordHash: hash, updatedAt: t }).where(eq(schema.users.id, userId)).run();
  deleteOtherSessionsForUser(db, userId, currentSessionId);
  return { ok: true };
}
```

- [ ] **Step 3: Run tests, pass**

- [ ] **Step 4: Update `src/routes/account/+page.server.ts` actions**

Replace the empty `actions` block with:

```ts
export const actions: Actions = {
  changePassword: async ({ request, locals }) => {
    if (!locals.user || !locals.session) throw redirect(303, '/login');
    const form = await request.formData();
    const { db } = getDb();
    const r = await (await import('./_logic')).changePassword(db, locals.user.id, locals.session.id, {
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
  }
};
```

Add `fail` to the import line at the top:

```ts
import { fail, redirect } from '@sveltejs/kit';
```

- [ ] **Step 5: Commit**

```bash
npm test && npm run check
git add -A
git commit -m "feat(account): password change revokes other sessions"
```

---

### Task 27: Session revoke endpoint

**Files:**
- Create: `src/routes/account/sessions/[id]/+server.ts`

- [ ] **Step 1: Write the route**

```ts
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { deleteSession, listSessionsForUser } from '$lib/server/auth/session';

export const POST: RequestHandler = async ({ params, locals }) => {
  if (!locals.user || !locals.session) throw redirect(303, '/login');
  if (params.id === locals.session.id) throw redirect(303, '/account');
  const { db } = getDb();
  const sessions = listSessionsForUser(db, locals.user.id);
  if (sessions.some((s) => s.id === params.id)) {
    deleteSession(db, params.id);
  }
  throw redirect(303, '/account');
};
```

- [ ] **Step 2: Commit**

```bash
npm run check
git add -A
git commit -m "feat(account): revoke individual session"
```

---

## Phase 5 — Babies CRUD

### Task 28: `server/babies.ts` service

**Files:**
- Create: `src/lib/server/babies.ts`, `tests/server/babies.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { createBaby, listBabies, getBabyForUser, updateBaby, deleteBaby } from '../../src/lib/server/babies';

function mkUser(tdb: ReturnType<typeof makeTestDb>, email = 'a@x'): number {
  const t = Math.floor(Date.now() / 1000);
  return Number(tdb.sqlite.prepare(
    "INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES (?, 'x', 0, ?, ?)"
  ).run(email, t, t).lastInsertRowid);
}

describe('babies', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('creates and lists babies scoped per user', () => {
    const u1 = mkUser(tdb, 'a@x');
    const u2 = mkUser(tdb, 'b@x');
    createBaby(tdb.db, u1, { name: 'Léa', birthDate: '2025-01-15', ageOverrideMonths: null });
    createBaby(tdb.db, u1, { name: 'Tom', birthDate: '2023-06-01', ageOverrideMonths: null });
    createBaby(tdb.db, u2, { name: 'Mia', birthDate: '2024-09-09', ageOverrideMonths: 6 });
    expect(listBabies(tdb.db, u1).map((b) => b.name).sort()).toEqual(['Léa', 'Tom']);
    expect(listBabies(tdb.db, u2).map((b) => b.name)).toEqual(['Mia']);
  });

  it('getBabyForUser returns null if owned by another user', () => {
    const u1 = mkUser(tdb, 'a@x');
    const u2 = mkUser(tdb, 'b@x');
    const b = createBaby(tdb.db, u1, { name: 'L', birthDate: '2025-01-15', ageOverrideMonths: null });
    expect(getBabyForUser(tdb.db, u1, b.id)).not.toBeNull();
    expect(getBabyForUser(tdb.db, u2, b.id)).toBeNull();
  });

  it('rejects invalid birth date', () => {
    const u = mkUser(tdb);
    expect(() => createBaby(tdb.db, u, { name: 'X', birthDate: 'pas-une-date', ageOverrideMonths: null })).toThrow();
  });

  it('updateBaby only succeeds for owner', () => {
    const u1 = mkUser(tdb, 'a@x');
    const u2 = mkUser(tdb, 'b@x');
    const b = createBaby(tdb.db, u1, { name: 'A', birthDate: '2025-01-15', ageOverrideMonths: null });
    expect(updateBaby(tdb.db, u2, b.id, { name: 'B' })).toBe(false);
    expect(updateBaby(tdb.db, u1, b.id, { name: 'B' })).toBe(true);
    expect(getBabyForUser(tdb.db, u1, b.id)?.name).toBe('B');
  });

  it('deleteBaby cascades to sleep_entries', () => {
    const u = mkUser(tdb);
    const b = createBaby(tdb.db, u, { name: 'X', birthDate: '2025-01-15', ageOverrideMonths: null });
    const t = Math.floor(Date.now() / 1000);
    tdb.sqlite.prepare(
      "INSERT INTO sleep_entries (baby_id, date, created_at, updated_at) VALUES (?, '2025-07-15', ?, ?)"
    ).run(b.id, t, t);
    deleteBaby(tdb.db, u, b.id);
    const n = (tdb.sqlite.prepare('SELECT COUNT(*) AS n FROM sleep_entries WHERE baby_id = ?').get(b.id) as any).n;
    expect(n).toBe(0);
  });
});
```

- [ ] **Step 2: Run, fail**

- [ ] **Step 3: Implement `src/lib/server/babies.ts`**

```ts
import { and, eq } from 'drizzle-orm';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './db/schema';

type DB = ReturnType<typeof drizzle<typeof schema>>;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function createBaby(
  db: DB,
  userId: number,
  input: { name: string; birthDate: string; ageOverrideMonths: number | null }
) {
  const name = String(input.name ?? '').trim();
  if (!name) throw new Error('name required');
  if (!ISO_DATE.test(input.birthDate)) throw new Error('birthDate must be YYYY-MM-DD');
  const t = Math.floor(Date.now() / 1000);
  return db.insert(schema.babies).values({
    userId, name, birthDate: input.birthDate, ageOverrideMonths: input.ageOverrideMonths,
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
  patch: Partial<{ name: string; birthDate: string; ageOverrideMonths: number | null }>
): boolean {
  const owned = getBabyForUser(db, userId, babyId);
  if (!owned) return false;
  if (patch.birthDate && !ISO_DATE.test(patch.birthDate)) throw new Error('birthDate must be YYYY-MM-DD');
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
```

- [ ] **Step 4: Tests pass, commit**

```bash
npm test
git add -A
git commit -m "feat(babies): CRUD service with ownership scoping"
```

---

### Task 29: `/app/babies` (list + create)

**Files:**
- Create: `src/routes/app/babies/+page.server.ts`, `src/routes/app/babies/+page.svelte`, `src/routes/app/+page.server.ts`

- [ ] **Step 1: `src/routes/app/+page.server.ts` — redirect to babies or today**

```ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { listBabies } from '$lib/server/babies';

export const load: PageServerLoad = ({ locals, cookies }) => {
  if (!locals.user) throw redirect(303, '/login');
  const { db } = getDb();
  const babies = listBabies(db, locals.user.id);
  if (babies.length === 0) throw redirect(303, '/app/babies');
  const last = Number(cookies.get('last_baby_id'));
  const target = babies.find((b) => b.id === last) ?? babies[0];
  throw redirect(303, `/app/babies/${target.id}/today`);
};
```

- [ ] **Step 2: `src/routes/app/babies/+page.server.ts`**

```ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { createBaby, listBabies } from '$lib/server/babies';

export const load: PageServerLoad = ({ locals }) => {
  if (!locals.user) throw redirect(303, '/login');
  const { db } = getDb();
  return { babies: listBabies(db, locals.user.id) };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/login');
    const form = await request.formData();
    const name = String(form.get('name') ?? '').trim();
    const birthDate = String(form.get('birth_date') ?? '');
    const overrideStr = String(form.get('age_override') ?? '').trim();
    const override = overrideStr === '' ? null : Math.max(0, Math.floor(Number(overrideStr)));
    if (!name || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return fail(400, { error: 'Nom et date de naissance requis (YYYY-MM-DD).' });
    }
    try {
      const { db } = getDb();
      const baby = createBaby(db, locals.user.id, { name, birthDate, ageOverrideMonths: override });
      throw redirect(303, `/app/babies/${baby.id}/today`);
    } catch (e) {
      if ((e as any)?.status === 303) throw e;
      return fail(400, { error: 'Échec de création.' });
    }
  }
};
```

- [ ] **Step 3: `src/routes/app/babies/+page.svelte`**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  let { data, form } = $props();
</script>

<h1>Mes bébés</h1>

<ul>
  {#each data.babies as b}
    <li>
      <a href="/app/babies/{b.id}/today">{b.name}</a> — né(e) le {b.birthDate}
      <a href="/app/babies/{b.id}">éditer</a>
    </li>
  {/each}
</ul>

<h2>Ajouter un bébé</h2>
{#if form?.error}<p class="error">{form.error}</p>{/if}
<form method="POST" action="?/create" use:enhance>
  <label>Prénom<input name="name" required /></label>
  <label>Date de naissance<input type="date" name="birth_date" required /></label>
  <label>Âge corrigé (mois, facultatif)<input type="number" name="age_override" min="0" max="60" /></label>
  <button type="submit">Créer</button>
</form>

<style>
  form { display: grid; gap: 0.5rem; max-width: 320px; }
  .error { color: #b91c1c; }
</style>
```

- [ ] **Step 4: Commit**

```bash
npm run check
git add -A
git commit -m "feat(babies): list + create page"
```

---

### Task 30: `/app/babies/[id]` (edit + delete)

**Files:**
- Create: `src/routes/app/babies/[id]/+page.server.ts`, `src/routes/app/babies/[id]/+page.svelte`

- [ ] **Step 1: Server**

```ts
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser, updateBaby, deleteBaby } from '$lib/server/babies';

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
    const { db } = getDb();
    const ok = updateBaby(db, locals.user.id, id, { name, birthDate, ageOverrideMonths: override });
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

- [ ] **Step 2: Page**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  let { data, form } = $props();
</script>

<h1>Bébé : {data.baby.name}</h1>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form method="POST" action="?/update" use:enhance>
  <label>Prénom<input name="name" value={data.baby.name} required /></label>
  <label>Date de naissance<input type="date" name="birth_date" value={data.baby.birthDate} required /></label>
  <label>Âge corrigé (mois)<input type="number" name="age_override" min="0" max="60" value={data.baby.ageOverrideMonths ?? ''} /></label>
  <button type="submit">Enregistrer</button>
</form>

<form method="POST" action="?/delete" use:enhance onsubmit={(e) => { if (!confirm('Supprimer ce bébé et tout son historique ?')) e.preventDefault(); }}>
  <button class="danger" type="submit">Supprimer ce bébé</button>
</form>

<p><a href="/app/babies/{data.baby.id}/today">→ Calculateur du jour</a></p>
<p><a href="/app/babies/{data.baby.id}/history">→ Historique</a></p>

<style>
  form { display: grid; gap: 0.5rem; max-width: 320px; margin: 1rem 0; }
  .error { color: #b91c1c; } .ok { color: #047857; }
  .danger { background: #b91c1c; color: white; }
</style>
```

- [ ] **Step 3: Commit**

```bash
npm run check
git add -A
git commit -m "feat(babies): edit + delete page"
```

---

### Task 31: `/app` layout + baby switcher + `last_baby_id` cookie

**Files:**
- Create: `src/routes/app/+layout.server.ts`, `src/routes/app/+layout.svelte`

- [ ] **Step 1: Layout server**

```ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { listBabies } from '$lib/server/babies';

export const load: LayoutServerLoad = ({ locals, cookies, params, url }) => {
  if (!locals.user) throw redirect(303, '/login');
  const { db } = getDb();
  const babies = listBabies(db, locals.user.id);
  const currentId = Number(params.id);
  if (currentId && babies.some((b) => b.id === currentId)) {
    cookies.set('last_baby_id', String(currentId), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365
    });
  }
  return { babies, currentBabyId: currentId || null, isAdmin: !!locals.user.isAdmin };
};
```

- [ ] **Step 2: Layout UI**

```svelte
<script lang="ts">
  import { page } from '$app/state';
  let { children, data } = $props();

  function tabClass(id: number) {
    return id === data.currentBabyId ? 'tab active' : 'tab';
  }
</script>

<header>
  <nav>
    <a href="/app/babies">Bébés</a>
    {#if data.isAdmin}<a href="/admin/invitations">Invitations</a>{/if}
    <a href="/account">Compte</a>
  </nav>
  <div class="switcher">
    {#each data.babies as b}
      <a class={tabClass(b.id)} href="/app/babies/{b.id}/today">{b.name}</a>
    {/each}
  </div>
</header>

{@render children()}

<style>
  header { display: grid; gap: 0.5rem; margin-bottom: 1rem; }
  nav { display: flex; gap: 1rem; }
  .switcher { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .tab { padding: 0.25rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px; text-decoration: none; }
  .tab.active { background: #1F4E78; color: white; border-color: #1F4E78; }
</style>
```

- [ ] **Step 3: Commit**

```bash
npm run check
git add -A
git commit -m "feat(app): layout with baby switcher + last_baby_id cookie"
```

---

## Phase 6 — Sleep entries

### Task 32: `server/sleep-entries.ts` service

**Files:**
- Create: `src/lib/server/sleep-entries.ts`, `tests/server/sleep-entries.test.ts`

- [ ] **Step 1: Failing tests**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import {
  upsertEntry,
  getEntryForBabyDate,
  listEntriesInRange,
  summariesForBaby
} from '../../src/lib/server/sleep-entries';

function setup(tdb: ReturnType<typeof makeTestDb>) {
  const t = Math.floor(Date.now() / 1000);
  const u = Number(tdb.sqlite.prepare("INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES ('a@x', 'x', 0, ?, ?)").run(t, t).lastInsertRowid);
  const b = Number(tdb.sqlite.prepare("INSERT INTO babies (user_id, name, birth_date, created_at, updated_at) VALUES (?, 'L', '2025-01-15', ?, ?)").run(u, t, t).lastInsertRowid);
  return { userId: u, babyId: b };
}

describe('sleep-entries', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('upsertEntry inserts then updates the same (baby, date)', () => {
    const { babyId } = setup(tdb);
    upsertEntry(tdb.db, babyId, '2025-07-15', { wakeTime: '07:00', notes: 'ok' });
    upsertEntry(tdb.db, babyId, '2025-07-15', { wakeTime: '07:30' });
    const row = getEntryForBabyDate(tdb.db, babyId, '2025-07-15');
    expect(row?.wakeTime).toBe('07:30');
    expect(row?.notes).toBe('ok');
  });

  it('listEntriesInRange returns entries between from..to inclusive desc', () => {
    const { babyId } = setup(tdb);
    upsertEntry(tdb.db, babyId, '2025-07-15', { wakeTime: '07:00' });
    upsertEntry(tdb.db, babyId, '2025-07-16', { wakeTime: '07:30' });
    upsertEntry(tdb.db, babyId, '2025-07-20', { wakeTime: '08:00' });
    const r = listEntriesInRange(tdb.db, babyId, '2025-07-15', '2025-07-17');
    expect(r.map((e) => e.date)).toEqual(['2025-07-16', '2025-07-15']);
  });

  it('summariesForBaby computes mean wake/bedtime in HH:MM', () => {
    const { babyId } = setup(tdb);
    upsertEntry(tdb.db, babyId, '2025-07-15', { wakeTime: '07:00', bedtime: '20:00' });
    upsertEntry(tdb.db, babyId, '2025-07-16', { wakeTime: '07:30', bedtime: '20:30' });
    const s = summariesForBaby(tdb.db, babyId, '2025-07-15', '2025-07-31');
    expect(s.entryCount).toBe(2);
    expect(s.meanWakeHHMM).toBe('07:15');
    expect(s.meanBedtimeHHMM).toBe('20:15');
  });
});
```

- [ ] **Step 2: Run, fail**

- [ ] **Step 3: Implement**

```ts
import { and, eq, gte, lte, desc } from 'drizzle-orm';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './db/schema';
import { parseHHMM, formatHHMM } from '$lib/time';

type DB = ReturnType<typeof drizzle<typeof schema>>;

export type EntryPatch = Partial<{
  wakeTime: string | null;
  nap1End: string | null;
  nap2End: string | null;
  nap3End: string | null;
  nap4End: string | null;
  bedtime: string | null;
  notes: string | null;
}>;

export function upsertEntry(db: DB, babyId: number, date: string, patch: EntryPatch) {
  const existing = getEntryForBabyDate(db, babyId, date);
  const t = Math.floor(Date.now() / 1000);
  if (!existing) {
    db.insert(schema.sleepEntries).values({
      babyId, date,
      wakeTime: patch.wakeTime ?? null,
      nap1End: patch.nap1End ?? null,
      nap2End: patch.nap2End ?? null,
      nap3End: patch.nap3End ?? null,
      nap4End: patch.nap4End ?? null,
      bedtime: patch.bedtime ?? null,
      notes: patch.notes ?? null,
      createdAt: t, updatedAt: t
    }).run();
  } else {
    db.update(schema.sleepEntries).set({ ...patch, updatedAt: t })
      .where(eq(schema.sleepEntries.id, existing.id)).run();
  }
}

export function getEntryForBabyDate(db: DB, babyId: number, date: string) {
  return db.select().from(schema.sleepEntries)
    .where(and(eq(schema.sleepEntries.babyId, babyId), eq(schema.sleepEntries.date, date)))
    .all()[0] ?? null;
}

export function listEntriesInRange(db: DB, babyId: number, from: string, to: string) {
  return db.select().from(schema.sleepEntries)
    .where(and(
      eq(schema.sleepEntries.babyId, babyId),
      gte(schema.sleepEntries.date, from),
      lte(schema.sleepEntries.date, to)
    ))
    .orderBy(desc(schema.sleepEntries.date))
    .all();
}

export function summariesForBaby(db: DB, babyId: number, from: string, to: string) {
  const rows = listEntriesInRange(db, babyId, from, to);
  const wakes = rows.map((r) => r.wakeTime).filter((s): s is string => !!s);
  const beds = rows.map((r) => r.bedtime).filter((s): s is string => !!s);
  const napCounts = rows.map((r) => [r.nap1End, r.nap2End, r.nap3End, r.nap4End].filter(Boolean).length);

  const mean = (arr: string[]) => arr.length ? formatHHMM(Math.round(arr.map(parseHHMM).reduce((a, b) => a + b, 0) / arr.length)) : '';

  let totalPrevNightMin = 0;
  let prevNightCount = 0;
  for (let i = 0; i < rows.length - 1; i++) {
    const cur = rows[i];
    const prev = rows[i + 1];
    if (cur.wakeTime && prev.bedtime && /^\d{4}-\d{2}-\d{2}$/.test(cur.date) && /^\d{4}-\d{2}-\d{2}$/.test(prev.date)) {
      const dayDiff = (Date.UTC(...iso(cur.date)) - Date.UTC(...iso(prev.date))) / 86400000;
      if (dayDiff === 1) {
        const dur = ((parseHHMM(cur.wakeTime) - parseHHMM(prev.bedtime)) % 1440 + 1440) % 1440;
        totalPrevNightMin += dur;
        prevNightCount += 1;
      }
    }
  }

  return {
    entryCount: rows.length,
    meanWakeHHMM: mean(wakes),
    meanBedtimeHHMM: mean(beds),
    meanNaps: napCounts.length ? Math.round((napCounts.reduce((a, b) => a + b, 0) / napCounts.length) * 10) / 10 : 0,
    meanPrevNightHHMM: prevNightCount ? formatHHMM(Math.round(totalPrevNightMin / prevNightCount)) : ''
  };
}

function iso(s: string): [number, number, number] {
  const [y, m, d] = s.split('-').map(Number);
  return [y, m - 1, d];
}
```

- [ ] **Step 4: Tests pass, commit**

```bash
npm test
git add -A
git commit -m "feat(sleep-entries): upsert, range list, summaries"
```

---

### Task 33: `/app/babies/[id]/today` — calculator page

**Files:**
- Create: `src/routes/app/babies/[id]/today/+page.server.ts`, `src/routes/app/babies/[id]/today/+page.svelte`

- [ ] **Step 1: Server**

```ts
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser } from '$lib/server/babies';
import { getEntryForBabyDate, listEntriesInRange, upsertEntry } from '$lib/server/sleep-entries';
import { ageInMonths } from '$lib/sleep-calc';
import { paramsForAge } from '$lib/age-params';
import { isValidHHMM } from '$lib/time';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

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
  const today = todayISO();
  const entry = getEntryForBabyDate(db, baby.id, today);
  const months = ageInMonths(baby.birthDate, baby.ageOverrideMonths ?? undefined);
  const params_ = paramsForAge(months);
  const recent = listEntriesInRange(db, baby.id, addDays(today, -7), today);
  return { baby, today, entry, ageMonths: months, ageParams: params_, recent };
};

export const actions: Actions = {
  save: async ({ request, locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');
    const id = Number(params.id);
    const { db } = getDb();
    const baby = getBabyForUser(db, locals.user.id, id);
    if (!baby) throw error(404);
    const form = await request.formData();
    const fields = ['wake_time', 'nap1_end', 'nap2_end', 'nap3_end', 'nap4_end', 'bedtime'] as const;
    const patch: Record<string, string | null> = {};
    for (const f of fields) {
      const v = String(form.get(f) ?? '').trim();
      if (v === '') patch[camel(f)] = null;
      else if (!isValidHHMM(v)) return fail(400, { error: `Heure invalide (${f}): ${v}` });
      else patch[camel(f)] = v;
    }
    const notes = String(form.get('notes') ?? '').trim();
    patch.notes = notes || null;
    const date = String(form.get('date') ?? todayISO());
    upsertEntry(db, baby.id, date, patch as any);
    return { success: 'Journée enregistrée.' };
  }
};

function camel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
```

- [ ] **Step 2: Page**

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import { idealBedtime, suggestNextNap, suggestedBedtime } from '$lib/sleep-calc';
  let { data, form } = $props();

  let wake = $state(data.entry?.wakeTime ?? '');
  let nap1 = $state(data.entry?.nap1End ?? '');
  let nap2 = $state(data.entry?.nap2End ?? '');
  let nap3 = $state(data.entry?.nap3End ?? '');
  let nap4 = $state(data.entry?.nap4End ?? '');
  let bedtime = $state(data.entry?.bedtime ?? '');
  let notes = $state(data.entry?.notes ?? '');

  const ideal = $derived(wake ? idealBedtime(wake, data.ageParams.nightSleepH) : '');
  const sugg1 = $derived(wake ? suggestNextNap(wake, data.ageParams.awakeWindowMin) : '');
  const sugg2 = $derived(nap1 ? suggestNextNap(nap1, data.ageParams.awakeWindowMin) : '');
  const sugg3 = $derived(nap2 ? suggestNextNap(nap2, data.ageParams.awakeWindowMin) : '');
  const sugg4 = $derived(nap3 ? suggestNextNap(nap3, data.ageParams.awakeWindowMin) : '');
  const suggBed = $derived(
    wake
      ? suggestedBedtime({ wake, napEnds: [nap1, nap2, nap3, nap4] }, data.ageParams) ?? ''
      : ''
  );
</script>

<h1>{data.baby.name} — {data.today}</h1>
<p>Âge : <strong>{data.ageMonths} mois</strong> ({data.ageParams.label}). Recommandé : {data.ageParams.naps} sieste(s), fenêtre {data.ageParams.awakeWindowMin} min, nuit {data.ageParams.nightSleepH}h.</p>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form method="POST" action="?/save" use:enhance>
  <input type="hidden" name="date" value={data.today} />

  <label>Réveil <input type="time" name="wake_time" bind:value={wake} /></label>

  <div class="hint">💤 Sieste 1 suggérée vers <strong>{sugg1 || '—'}</strong></div>
  <label>Fin sieste 1 <input type="time" name="nap1_end" bind:value={nap1} /></label>

  <div class="hint">💤 Sieste 2 suggérée vers <strong>{sugg2 || '—'}</strong></div>
  <label>Fin sieste 2 <input type="time" name="nap2_end" bind:value={nap2} /></label>

  <div class="hint">💤 Sieste 3 suggérée vers <strong>{sugg3 || '—'}</strong></div>
  <label>Fin sieste 3 <input type="time" name="nap3_end" bind:value={nap3} /></label>

  <div class="hint">💤 Sieste 4 suggérée vers <strong>{sugg4 || '—'}</strong></div>
  <label>Fin sieste 4 <input type="time" name="nap4_end" bind:value={nap4} /></label>

  <div class="key">⭐ Coucher idéal : <strong>{ideal || '—'}</strong></div>
  <div class="key">⭐ Coucher suggéré : <strong>{suggBed || '—'}</strong></div>
  <label>Coucher effectif <input type="time" name="bedtime" bind:value={bedtime} /></label>

  <label>Notes <textarea name="notes" bind:value={notes} rows="2"></textarea></label>

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
  .error { color: #b91c1c; } .ok { color: #047857; }
  button { padding: 0.5rem 1rem; background: #1F4E78; color: white; border: 0; border-radius: 4px; }
</style>
```

- [ ] **Step 3: Commit**

```bash
npm run check
git add -A
git commit -m "feat(today): calculator page with live suggestions"
```

---

### Task 34: `/app/babies/[id]/history` — paginated history + filters

**Files:**
- Create: `src/routes/app/babies/[id]/history/+page.server.ts`, `src/routes/app/babies/[id]/history/+page.svelte`

- [ ] **Step 1: Server**

```ts
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser } from '$lib/server/babies';
import { listEntriesInRange, summariesForBaby } from '$lib/server/sleep-entries';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function addDaysISO(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
}

export const load: PageServerLoad = ({ locals, params, url }) => {
  if (!locals.user) throw redirect(303, '/login');
  const id = Number(params.id);
  const { db } = getDb();
  const baby = getBabyForUser(db, locals.user.id, id);
  if (!baby) throw error(404);
  const to = url.searchParams.get('to') ?? todayISO();
  const from = url.searchParams.get('from') ?? addDaysISO(to, -29);
  const entries = listEntriesInRange(db, baby.id, from, to);
  const summary = summariesForBaby(db, baby.id, from, to);
  return { baby, from, to, entries, summary };
};
```

- [ ] **Step 2: Page**

```svelte
<script lang="ts">
  let { data } = $props();

  function napCount(r: any) {
    return [r.nap1End, r.nap2End, r.nap3End, r.nap4End].filter(Boolean).length;
  }
</script>

<h1>Historique — {data.baby.name}</h1>

<form method="GET">
  <label>De <input type="date" name="from" value={data.from} /></label>
  <label>À <input type="date" name="to" value={data.to} /></label>
  <button type="submit">Filtrer</button>
  <a class="btn" href="/api/babies/{data.baby.id}/export.csv?from={data.from}&to={data.to}">Télécharger CSV</a>
</form>

<section class="summary">
  <div>📅 {data.summary.entryCount} jour(s)</div>
  <div>🌅 Réveil moyen : {data.summary.meanWakeHHMM || '—'}</div>
  <div>🌙 Coucher moyen : {data.summary.meanBedtimeHHMM || '—'}</div>
  <div>🛏️ Nuit moyenne : {data.summary.meanPrevNightHHMM || '—'}</div>
  <div>💤 Siestes / jour : {data.summary.meanNaps}</div>
</section>

<table>
  <thead>
    <tr><th>Date</th><th>Réveil</th><th>S1</th><th>S2</th><th>S3</th><th>S4</th><th>Coucher</th><th>Nb</th><th>Notes</th></tr>
  </thead>
  <tbody>
    {#each data.entries as r}
      <tr>
        <td>{r.date}</td>
        <td>{r.wakeTime ?? ''}</td>
        <td>{r.nap1End ?? ''}</td>
        <td>{r.nap2End ?? ''}</td>
        <td>{r.nap3End ?? ''}</td>
        <td>{r.nap4End ?? ''}</td>
        <td>{r.bedtime ?? ''}</td>
        <td>{napCount(r)}</td>
        <td>{r.notes ?? ''}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  form { display: flex; gap: 0.5rem; align-items: end; flex-wrap: wrap; margin-bottom: 1rem; }
  .summary { display: flex; gap: 1rem; flex-wrap: wrap; background: #DDEBF7; padding: 0.5rem; margin-bottom: 1rem; }
  table { border-collapse: collapse; width: 100%; }
  th, td { padding: 0.35rem; border-bottom: 1px solid #e5e7eb; text-align: left; }
  .btn { padding: 0.4rem 0.6rem; background: #1F4E78; color: white; text-decoration: none; border-radius: 4px; }
</style>
```

- [ ] **Step 3: Commit**

```bash
npm run check
git add -A
git commit -m "feat(history): paginated history + filters + summary"
```

---

## Phase 7 — CSV export

### Task 35: `server/csv.ts` builder

**Files:**
- Create: `src/lib/server/csv.ts`, `tests/server/csv.test.ts`

- [ ] **Step 1: Failing tests**

```ts
import { describe, it, expect } from 'vitest';
import { buildSleepCsv } from '../../src/lib/server/csv';

describe('buildSleepCsv', () => {
  it('produces UTF-8 BOM + ; separator', () => {
    const out = buildSleepCsv([], 'Léa');
    expect(out.startsWith('﻿')).toBe(true);
    const firstLine = out.split('\r\n')[0].slice(1);
    expect(firstLine.split(';')).toEqual([
      'Date', 'Réveil', 'Sieste 1', 'Sieste 2', 'Sieste 3', 'Sieste 4',
      'Coucher', 'Nb siestes', 'Durée nuit préc.', 'Notes'
    ]);
  });

  it('escapes notes containing semicolons or quotes', () => {
    const rows = [{
      date: '2025-07-15', wakeTime: '07:00', nap1End: null, nap2End: null, nap3End: null, nap4End: null,
      bedtime: '20:00', notes: 'note avec ; et "guillemets"'
    }];
    const out = buildSleepCsv(rows, 'X');
    expect(out).toContain('"note avec ; et ""guillemets"""');
  });

  it('computes Nb siestes from non-null nap fields', () => {
    const rows = [{
      date: '2025-07-15', wakeTime: '07:00', nap1End: '09:00', nap2End: '13:00', nap3End: null, nap4End: null,
      bedtime: '20:00', notes: null
    }];
    const out = buildSleepCsv(rows, 'X');
    const line = out.split('\r\n')[1].split(';');
    expect(line[7]).toBe('2');
  });

  it('computes durée nuit préc. across two consecutive days', () => {
    const rows = [
      { date: '2025-07-16', wakeTime: '07:00', nap1End: null, nap2End: null, nap3End: null, nap4End: null, bedtime: '20:30', notes: null },
      { date: '2025-07-15', wakeTime: '06:30', nap1End: null, nap2End: null, nap3End: null, nap4End: null, bedtime: '20:00', notes: null }
    ];
    const out = buildSleepCsv(rows, 'X');
    const lines = out.split('\r\n').filter(Boolean);
    // first data line corresponds to 2025-07-16 (rows desc order)
    expect(lines[1].split(';')[8]).toBe('10:30');
    // second data line (oldest) has empty prev-night
    expect(lines[2].split(';')[8]).toBe('');
  });
});
```

- [ ] **Step 2: Run, fail**

- [ ] **Step 3: Implement**

```ts
import { parseHHMM, formatHHMM } from '$lib/time';

type Row = {
  date: string;
  wakeTime: string | null;
  nap1End: string | null;
  nap2End: string | null;
  nap3End: string | null;
  nap4End: string | null;
  bedtime: string | null;
  notes: string | null;
};

function escape(v: string | null): string {
  if (v == null) return '';
  if (/[";\r\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function napCount(r: Row): number {
  return [r.nap1End, r.nap2End, r.nap3End, r.nap4End].filter(Boolean).length;
}

function durationPrevNight(curr: Row, prev: Row | null): string {
  if (!prev || !curr.wakeTime || !prev.bedtime) return '';
  const [y1, m1, d1] = curr.date.split('-').map(Number);
  const [y2, m2, d2] = prev.date.split('-').map(Number);
  const dayDiff = (Date.UTC(y1, m1 - 1, d1) - Date.UTC(y2, m2 - 1, d2)) / 86400000;
  if (dayDiff !== 1) return '';
  const dur = ((parseHHMM(curr.wakeTime) - parseHHMM(prev.bedtime)) % 1440 + 1440) % 1440;
  return formatHHMM(dur);
}

export function buildSleepCsv(rows: Row[], _babyName: string): string {
  const sortedDesc = [...rows].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  // We need the row PRECEDING (in date order) the current row → for desc order, that's the next item.
  const lines: string[] = [];
  lines.push([
    'Date', 'Réveil', 'Sieste 1', 'Sieste 2', 'Sieste 3', 'Sieste 4',
    'Coucher', 'Nb siestes', 'Durée nuit préc.', 'Notes'
  ].join(';'));
  for (let i = 0; i < sortedDesc.length; i++) {
    const cur = sortedDesc[i];
    const prev = sortedDesc[i + 1] ?? null; // older date (immediately preceding)
    lines.push([
      escape(cur.date),
      escape(cur.wakeTime),
      escape(cur.nap1End),
      escape(cur.nap2End),
      escape(cur.nap3End),
      escape(cur.nap4End),
      escape(cur.bedtime),
      String(napCount(cur)),
      durationPrevNight(cur, prev),
      escape(cur.notes)
    ].join(';'));
  }
  return '﻿' + lines.join('\r\n') + '\r\n';
}
```

- [ ] **Step 4: Tests pass, commit**

```bash
npm test
git add -A
git commit -m "feat(csv): builder with BOM + ; + notes escaping"
```

---

### Task 36: `/api/babies/[id]/export.csv` endpoint

**Files:**
- Create: `src/routes/api/babies/[id]/export.csv/+server.ts`, `tests/server/routes-csv.test.ts`

- [ ] **Step 1: Write the route**

```ts
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser } from '$lib/server/babies';
import { listEntriesInRange } from '$lib/server/sleep-entries';
import { buildSleepCsv } from '$lib/server/csv';

function isISODate(s: string | null): boolean {
  return !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function slug(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'baby';
}

export const GET: RequestHandler = async ({ locals, params, url }) => {
  if (!locals.user) throw redirect(303, '/login');
  const id = Number(params.id);
  const { db } = getDb();
  const baby = getBabyForUser(db, locals.user.id, id);
  if (!baby) throw error(404);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  if (!isISODate(from) || !isISODate(to)) throw error(400, 'from/to required as YYYY-MM-DD');
  const rows = listEntriesInRange(db, baby.id, from!, to!);
  const csv = buildSleepCsv(rows, baby.name);
  const filename = `babysleep_${slug(baby.name)}_${from}_${to}.csv`;
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
};
```

- [ ] **Step 2: Integration test** (`tests/server/routes-csv.test.ts`)

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { buildSleepCsv } from '../../src/lib/server/csv';
import { listEntriesInRange, upsertEntry } from '../../src/lib/server/sleep-entries';

describe('CSV export pipeline', () => {
  let tdb: ReturnType<typeof makeTestDb>;
  beforeEach(() => { tdb = makeTestDb(); });

  it('produces a non-empty CSV for one entry', () => {
    const t = Math.floor(Date.now() / 1000);
    const u = Number(tdb.sqlite.prepare("INSERT INTO users (email, password_hash, is_admin, created_at, updated_at) VALUES ('a@x', 'x', 0, ?, ?)").run(t, t).lastInsertRowid);
    const b = Number(tdb.sqlite.prepare("INSERT INTO babies (user_id, name, birth_date, created_at, updated_at) VALUES (?, 'Léa', '2025-01-15', ?, ?)").run(u, t, t).lastInsertRowid);
    upsertEntry(tdb.db, b, '2025-07-15', { wakeTime: '07:00', bedtime: '20:00' });
    const rows = listEntriesInRange(tdb.db, b, '2025-07-01', '2025-07-31');
    const csv = buildSleepCsv(rows, 'Léa');
    expect(csv).toContain('2025-07-15');
    expect(csv).toContain('07:00');
  });
});
```

- [ ] **Step 3: Tests pass, commit**

```bash
npm test
npm run check
git add -A
git commit -m "feat(csv): /api/babies/[id]/export.csv endpoint"
```

---

## Phase 8 — PWA

### Task 37: `vite-plugin-pwa` + icons + manifest

**Files:**
- Modify: `vite.config.ts`, `src/app.html`; create `static/icon-192.png`, `static/icon-512.png`, `static/apple-touch-icon.png`

- [ ] **Step 1: Update `vite.config.ts`**

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      manifest: {
        name: 'BabySleep',
        short_name: 'BabySleep',
        start_url: '/',
        display: 'standalone',
        background_color: '#1F4E78',
        theme_color: '#1F4E78',
        lang: 'fr',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        navigateFallback: '/login',
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff2}']
      }
    })
  ],
  server: { port: 5173 },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' }
});
```

Install the SvelteKit-specific PWA plugin:

```bash
npm install --save-dev @vite-pwa/sveltekit
```

- [ ] **Step 2: Generate placeholder PNG icons**

Run from project root (uses ImageMagick if available, otherwise a tiny generator):

```bash
node -e "
const fs = require('node:fs');
const png = require('zlib').deflateRawSync;
// Generate a minimal solid-color PNG. For real icons replace these later.
function makePng(size, rgb) {
  // Use a base64 1x1 PNG and let browsers scale — placeholder only.
  const oneByOne = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
  return oneByOne;
}
fs.mkdirSync('static', { recursive: true });
fs.writeFileSync('static/icon-192.png', makePng());
fs.writeFileSync('static/icon-512.png', makePng());
fs.writeFileSync('static/apple-touch-icon.png', makePng());
console.log('placeholder PNGs written');
"
```

(The placeholder icons are intentionally tiny — replace with real 192/512 PNGs before publishing. They're functional enough for install-prompt testing.)

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: build succeeds; `build/client/manifest.webmanifest` and a service worker file are emitted.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(pwa): manifest + service worker via @vite-pwa/sveltekit"
```

---

### Task 38: `/healthz` endpoint

**Files:**
- Create: `src/routes/healthz/+server.ts`

- [ ] **Step 1: Write**

```ts
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';

export const GET: RequestHandler = () => {
  try {
    const { sqlite } = getDb();
    sqlite.prepare('SELECT 1').get();
    return new Response('ok', { status: 200 });
  } catch (e) {
    return new Response('db error', { status: 503 });
  }
};
```

- [ ] **Step 2: Commit**

```bash
npm run check
git add -A
git commit -m "feat(ops): /healthz endpoint"
```

---

## Phase 9 — Rate limiting

### Task 39: In-memory rate limiter applied to /login and /signup

**Files:**
- Create: `src/lib/server/rate-limit.ts`; modify `src/hooks.server.ts`

- [ ] **Step 1: Implement**

```ts
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowSec: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowSec });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}
```

- [ ] **Step 2: Wire into `hooks.server.ts`**

Add this block inside the handle, right after the bootstrap call:

```ts
import { rateLimit } from '$lib/server/rate-limit';

// ... inside handle, before reading the session cookie:
const path = event.url.pathname;
if ((path === '/login' || path === '/signup') && event.request.method === 'POST') {
  const ip = event.getClientAddress();
  if (!rateLimit(`${path}:${ip}`, 5, 15 * 60)) {
    return new Response('Trop de tentatives, réessaie dans 15 minutes.', {
      status: 429,
      headers: { 'Retry-After': '900' }
    });
  }
}
```

- [ ] **Step 3: Test the limiter**

Add `tests/server/rate-limit.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { rateLimit } from '../../src/lib/server/rate-limit';

describe('rateLimit', () => {
  it('allows up to limit then denies', () => {
    const key = 'k1';
    for (let i = 0; i < 5; i++) expect(rateLimit(key, 5, 60)).toBe(true);
    expect(rateLimit(key, 5, 60)).toBe(false);
  });
  it('separate keys independent', () => {
    expect(rateLimit('a', 1, 60)).toBe(true);
    expect(rateLimit('a', 1, 60)).toBe(false);
    expect(rateLimit('b', 1, 60)).toBe(true);
  });
});
```

- [ ] **Step 4: Tests pass, commit**

```bash
npm test
npm run check
git add -A
git commit -m "feat(security): rate limit /login and /signup"
```

---

## Phase 10 — Docker, scripts, README

### Task 40: Dockerfile

**Files:**
- Create: `Dockerfile`, `.dockerignore`

- [ ] **Step 1: Write `.dockerignore`**

```
node_modules
.svelte-kit
build
.git
.env
.env.local
data
coverage
*.sqlite*
```

- [ ] **Step 2: Write `Dockerfile`**

```dockerfile
# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_PATH=/data/babysleep.sqlite
ENV PORT=3000

# Production deps only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Built app + migrations
COPY --from=build /app/build ./build
COPY drizzle ./drizzle
COPY src/lib/server/db/migrate.ts ./migrate.ts
COPY scripts ./scripts

# Migrate at startup then run
COPY <<'EOF' /app/start.sh
#!/bin/sh
set -e
mkdir -p /data
node --import tsx /app/migrate.ts
exec node /app/build/index.js
EOF
RUN chmod +x /app/start.sh

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/healthz || exit 1

CMD ["/app/start.sh"]
```

- [ ] **Step 3: Verify build**

```bash
docker build -t babysleep:test .
```

Expected: image builds successfully.

- [ ] **Step 4: Commit**

```bash
git add Dockerfile .dockerignore
git commit -m "build(docker): multi-stage Dockerfile with healthcheck"
```

---

### Task 41: docker-compose.yml + .env.example

**Files:**
- Create: `docker-compose.yml`, `.env.example`

- [ ] **Step 1: `.env.example`**

```bash
# Random ≥ 32 chars (e.g. `openssl rand -base64 36`)
SESSION_SECRET=replace-me-with-a-random-string

# Created at first start ONLY if users table is empty
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-please-10-chars-min

# Optional overrides
TZ=Europe/Paris
DISABLE_SIGNUP=false
```

- [ ] **Step 2: `docker-compose.yml`**

```yaml
services:
  app:
    build: .
    image: babysleep:latest
    container_name: babysleep
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_PATH=/data/babysleep.sqlite
      - SESSION_SECRET=${SESSION_SECRET}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - DISABLE_SIGNUP=${DISABLE_SIGNUP:-false}
      - TZ=${TZ:-Europe/Paris}
    volumes:
      - babysleep_data:/data
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/healthz"]
      interval: 30s
      timeout: 5s
      retries: 3

volumes:
  babysleep_data:
```

- [ ] **Step 3: Smoke test**

```bash
cp .env.example .env
docker compose up -d
curl -fsS http://localhost:3000/healthz
docker compose down
```

Expected: healthcheck returns `ok`.

- [ ] **Step 4: Commit**

```bash
git add docker-compose.yml .env.example
git commit -m "build(docker): compose file with named volume"
```

---

### Task 42: CLI scripts (reset-password, backup)

**Files:**
- Create: `scripts/reset-password.ts`, `scripts/backup.sh`

- [ ] **Step 1: `scripts/reset-password.ts`**

```ts
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { getDb } from '../src/lib/server/db';
import * as schema from '../src/lib/server/db/schema';
import { hashPassword, isStrongEnough } from '../src/lib/server/auth/password';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: npm run reset-password -- <email>');
    process.exit(1);
  }
  const rl = createInterface({ input: stdin, output: stdout });
  const password = await rl.question('New password (≥ 10 chars): ');
  rl.close();
  if (!isStrongEnough(password)) {
    console.error('Password too short.');
    process.exit(1);
  }
  const { db } = getDb();
  const user = db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase().trim())).all()[0];
  if (!user) {
    console.error(`No user with email ${email}`);
    process.exit(1);
  }
  const hash = await hashPassword(password);
  const t = Math.floor(Date.now() / 1000);
  db.update(schema.users).set({ passwordHash: hash, updatedAt: t }).where(eq(schema.users.id, user.id)).run();
  db.delete(schema.sessions).where(eq(schema.sessions.userId, user.id)).run();
  console.log(`Password reset for ${email}. All sessions revoked.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: `scripts/backup.sh`**

```bash
#!/bin/sh
# Usage: scripts/backup.sh /path/to/backup-dir
# Copies the SQLite DB safely (uses sqlite3 .backup command).
set -e
DEST="${1:-./backups}"
SRC="${DATABASE_PATH:-/data/babysleep.sqlite}"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$DEST"
sqlite3 "$SRC" ".backup '$DEST/babysleep-$TS.sqlite'"
echo "Backup written to $DEST/babysleep-$TS.sqlite"
```

- [ ] **Step 3: Make script executable, commit**

```bash
chmod +x scripts/backup.sh
git add scripts/
git commit -m "feat(ops): reset-password + backup scripts"
```

---

### Task 43: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README**

```markdown
# BabySleep

Petite app web de suivi de sommeil bébé (calculateur + historique), dockerisée, PWA, multi-bébés, auth privée.

## Démarrage rapide

```bash
cp .env.example .env
# Édite SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
docker compose up -d
```

L'app écoute sur http://localhost:3000. Mets un reverse proxy (Caddy, Traefik) devant pour HTTPS.

À la première montée, le compte admin est créé depuis `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Ensuite, génère des invitations dans `/admin/invitations` pour ajouter d'autres comptes.

## Variables d'environnement

| Variable | Description |
|---|---|
| `SESSION_SECRET` | Clé aléatoire ≥ 32 chars |
| `ADMIN_EMAIL` | Email du compte admin créé au premier démarrage |
| `ADMIN_PASSWORD` | Mot de passe initial (≥ 10 chars) |
| `DATABASE_PATH` | Défaut `/data/babysleep.sqlite` |
| `DISABLE_SIGNUP` | `true` pour couper `/signup` |
| `TZ` | Défaut `Europe/Paris` |

## Mot de passe oublié

```bash
docker compose exec app sh -c "node --import tsx /app/scripts/reset-password.ts ton@email"
```

## Backup

```bash
docker compose exec app /app/scripts/backup.sh /data/backups
```

ou copie le fichier `/data/babysleep.sqlite` depuis le volume Docker.

## Développement local

```bash
npm install
cp .env.example .env
mkdir -p data
npm run db:migrate
npm run dev
```

Tests : `npm test`. Type-check : `npm run check`.

## Stack

SvelteKit (adapter-node) + TypeScript strict + Drizzle ORM + SQLite (better-sqlite3) + argon2id + vite-plugin-pwa.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README with quickstart and ops"
```

---

## Final smoke test

### Task 44: End-to-end happy path manual verification

- [ ] **Step 1: Fresh DB, fresh container**

```bash
docker compose down -v
docker compose up -d --build
```

- [ ] **Step 2: Verify healthz**

```bash
curl -fsS http://localhost:3000/healthz
```

Expected: `ok`.

- [ ] **Step 3: Login as admin**

Browser → http://localhost:3000/login → `ADMIN_EMAIL` + `ADMIN_PASSWORD`. Should redirect to `/app/babies` (no babies yet).

- [ ] **Step 4: Create a baby**

Fill form, click Create → redirected to `/app/babies/1/today`.

- [ ] **Step 5: Save a day**

Fill `wake_time` = `07:00`, `nap1_end` = `09:00`, `bedtime` = `20:00` → submit. See "Journée enregistrée."

- [ ] **Step 6: View history**

Go to `/app/babies/1/history`. See 1 row.

- [ ] **Step 7: Download CSV**

Click "Télécharger CSV". Open in LibreOffice/Excel — Latin chars OK, `;` separated.

- [ ] **Step 8: Change password**

`/account` → change password to a new 10+ char string. Log out. Log in with new password.

- [ ] **Step 9: Create invitation**

`/admin/invitations` → Generate → copy link → open in private window → sign up → log in.

- [ ] **Step 10: PWA install**

In Chrome desktop, click install icon in address bar. Standalone window opens.

- [ ] **Step 11: Tests + check**

```bash
npm test
npm run check
```

Expected: all green.

- [ ] **Step 12: Final commit (if any cleanups)**

```bash
git status
# If clean, you're done.
```

---

## Self-Review

**Spec coverage check** (run mentally before execution):
- §2 web app + Docker → Tasks 40–41 ✓
- §2 DB + Drizzle → Tasks 12–14 ✓
- §2 auth + password change → Tasks 16, 17, 25, 26 ✓
- §2 multi-baby → Tasks 28–31 ✓
- §2 CSV export → Tasks 35, 36 ✓
- §2 PWA → Task 37 ✓
- §2 long sessions (multi-day) → Task 17 (30d sliding, 90d cap) ✓
- §5 bootstrap admin via env → Task 19, 20 ✓
- §6 invitations → Task 18, 23, 24 ✓
- §6 password change revokes others → Task 26 ✓
- §6 rate limit → Task 39 ✓
- §7 last_baby_id cookie → Task 31 ✓
- §10 CSV BOM + `;` → Task 35 ✓
- §11 Docker volume + healthcheck → Task 40, 41 ✓
- §12 tests (vitest unit + integration) → Tasks 5–11, 16–19, 26, 28, 32, 35, 39 ✓
- §13 hors-scope → not implemented (as expected) ✓

**Placeholder scan**: no TBDs, all code complete.

**Type consistency**: `AgeParams`, `LoginResult`, `SignupResult`, `ChangeResult`, `EntryPatch`, `Row` all referenced consistently. Function names match between definition and call sites.
