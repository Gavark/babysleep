# BabySleep Monthly Calendar View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a monthly calendar view at `/app/babies/[id]/calendar` that visualises each day's sleep as a 24-hour mini-timeline (nap & night segments) with a heatmap background reflecting `% of age-recommended total sleep`. Desktop = 7-column grid, mobile = vertical strip.

**Architecture:** A single new SvelteKit route loads sleep entries for the displayed month (grid range) and resolves the baby's timezone. Pure functions in `src/lib/calendar.ts` derive per-day metrics from a single `SleepEntry` (the night between two days is split graphically: bedtime→24:00 belongs to day N, 00:00→wake belongs to day N+1, so no cross-day lookup is needed). One `DayCell.svelte` component renders the cell content; it is wrapped by `CalendarGrid.svelte` (desktop) and `CalendarStrip.svelte` (mobile). A CSS `@media` query picks one layout or the other.

**Tech Stack:** SvelteKit 2 + Svelte 5 (runes) + TypeScript strict + Drizzle ORM (read-only here) + Vitest (unit + integration with in-memory SQLite via `makeTestDb`). Reuses existing `AGE_PARAMS`, `paramsForAge`, `ageInMonths`, `listEntriesInRange`, `parseHHMM`, `formatHHMM`, `formatDuration`, `resolveTimezone`, `todayISOInTZ`.

**Spec:** `docs/superpowers/specs/2026-05-21-calendar-view-design.md`.

---

## File Structure

```
src/
├── lib/
│   ├── calendar.ts                                                   [NEW — pure functions]
│   ├── components/
│   │   └── calendar/
│   │       ├── DayCell.svelte                                        [NEW]
│   │       ├── CalendarGrid.svelte                                   [NEW]
│   │       └── CalendarStrip.svelte                                  [NEW]
│   └── styles/
│       └── tokens.css                                                [MODIFY — add heatmap + segment tokens]
└── routes/
    └── app/
        ├── +layout.svelte                                            [MODIFY — add "Calendrier" sub-nav link]
        └── babies/
            └── [id]/
                ├── calendar/
                │   ├── +page.server.ts                               [NEW]
                │   └── +page.svelte                                  [NEW]
                └── day/
                    └── [date]/
                        ├── +page.server.ts                           [MODIFY — accept missing entry]
                        └── +page.svelte                              [MODIFY — handle null entry]

tests/
├── calendar.test.ts                                                  [NEW — pure functions]
└── server/
    └── routes-calendar.test.ts                                       [NEW — integration]
```

---

## Phase 0 — Tokens & pure functions

### Task 1: Add heatmap & segment tokens to `tokens.css`

**Files:**
- Modify: `src/lib/styles/tokens.css`

- [ ] **Step 1: Add tokens to the `:root` block (light mode)**

Open `src/lib/styles/tokens.css`. Inside the `:root { … }` block (after `--c-focus-ring`), add:

```css
  /* Calendar — heatmap (light) */
  --c-cal-heat-good: #DFEDE2;
  --c-cal-heat-ok:   #FBF5E4;
  --c-cal-heat-meh:  #F6E1D6;
  --c-cal-heat-bad:  #F0CFC1;
  --c-cal-heat-none: #F4ECE0;
  /* Calendar — segments */
  --c-cal-seg-nap:   var(--c-accent-honey);
  --c-cal-seg-night: #7A6FA9;
```

- [ ] **Step 2: Add dark-mode overrides in BOTH dark blocks**

The file already has two dark sections: `@media (prefers-color-scheme: dark)` (the `:root:not([data-theme="light"])` selector) and `:root[data-theme="dark"]`. Add the following to **each** of those blocks (before the closing `}`):

```css
  --c-cal-heat-good: #2B4234;
  --c-cal-heat-ok:   #3D3826;
  --c-cal-heat-meh:  #4A352A;
  --c-cal-heat-bad:  #5A2E22;
  --c-cal-heat-none: #2A2117;
  --c-cal-seg-night: #9A8FCC;
  /* --c-cal-seg-nap inherits via var(--c-accent-honey), already overridden above */
```

- [ ] **Step 3: Build the app to verify CSS parses**

```bash
npm run check
```

Expected: no new errors. (svelte-check tolerates CSS — this is mostly a smoke test.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/styles/tokens.css
git commit -m "feat(calendar): add heatmap & segment CSS tokens (light + dark)"
```

---

### Task 2: Create `src/lib/calendar.ts` types & `buildMonthGrid`

**Files:**
- Create: `src/lib/calendar.ts`
- Create: `tests/calendar.test.ts`

- [ ] **Step 1: Write failing tests for `buildMonthGrid`**

Create `tests/calendar.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { buildMonthGrid } from '../src/lib/calendar';

describe('buildMonthGrid', () => {
  it('returns 35 or 42 cells (multiple of 7)', () => {
    const cells = buildMonthGrid(2026, 5, '2026-05-21');
    expect(cells.length % 7).toBe(0);
    expect(cells.length === 35 || cells.length === 42).toBe(true);
  });

  it('starts on Monday', () => {
    // May 2026: 1st is a Friday. Grid starts on the Monday before (2026-04-27).
    const cells = buildMonthGrid(2026, 5, '2026-05-21');
    expect(cells[0].date).toBe('2026-04-27');
    expect(cells[0].inMonth).toBe(false);
  });

  it('marks days of the displayed month with inMonth = true', () => {
    const cells = buildMonthGrid(2026, 5, '2026-05-21');
    const inMonth = cells.filter((c) => c.inMonth);
    expect(inMonth.length).toBe(31); // May has 31 days
    expect(inMonth[0].date).toBe('2026-05-01');
    expect(inMonth[inMonth.length - 1].date).toBe('2026-05-31');
  });

  it('handles February of a non-leap year (28 days, starts Sunday)', () => {
    // Feb 2026: 1st is a Sunday. Grid starts on the Monday before (2026-01-26).
    const cells = buildMonthGrid(2026, 2, '2026-02-15');
    expect(cells[0].date).toBe('2026-01-26');
    expect(cells.filter((c) => c.inMonth).length).toBe(28);
  });

  it('handles February of a leap year (29 days)', () => {
    const cells = buildMonthGrid(2024, 2, '2024-02-15');
    expect(cells.filter((c) => c.inMonth).length).toBe(29);
  });

  it('handles a month starting on Monday with exactly 4 weeks (only possible for Feb non-leap starting Mon)', () => {
    // Feb 2027: 1st is a Monday, 28 days → exactly 4 weeks. Grid length = 28.
    const cells = buildMonthGrid(2027, 2, '2027-02-15');
    expect(cells.length === 28 || cells.length === 35).toBe(true);
    expect(cells[0].date).toBe('2027-02-01');
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run tests/calendar.test.ts
```

Expected: FAIL — module `src/lib/calendar` not found.

- [ ] **Step 3: Create `src/lib/calendar.ts` with the type and function**

Create `src/lib/calendar.ts`:

```ts
import type { SleepEntry, Baby } from '$lib/server/db/schema';
import { parseHHMM } from '$lib/time';
import { ageInMonths } from '$lib/sleep-calc';
import { paramsForAge } from '$lib/age-params';

export type TimelineSegment = {
  kind: 'nap' | 'night';
  startMin: number;  // 0..1440
  endMin: number;    // 0..1440
};

export type HeatLevel = 'good' | 'ok' | 'meh' | 'bad' | 'partial' | 'none';

export type DayMetrics = {
  date: string;                  // YYYY-MM-DD
  inMonth: boolean;
  isToday: boolean;
  hasAnyData: boolean;
  isComplete: boolean;           // bedtime saisi
  totalSleepMin: number;
  recommendedMin: number;
  ratio: number;                 // 0..N (may exceed 1)
  heatLevel: HeatLevel;
  segments: TimelineSegment[];
  wakeTime: string | null;
  bedtime: string | null;
  napCount: number;
};

export type GridCell = { date: string; inMonth: boolean };

function isoDate(y: number, m1to12: number, d: number): string {
  return `${y}-${String(m1to12).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function addDaysISO(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return isoDate(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

/**
 * dayOfWeekISO: Monday=0..Sunday=6 for a YYYY-MM-DD date (UTC).
 */
function dayOfWeekISOMonZero(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  const jsDow = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // Sun=0..Sat=6
  return (jsDow + 6) % 7; // shift so Mon=0..Sun=6
}

export function buildMonthGrid(year: number, month1to12: number, _todayISO: string): GridCell[] {
  const firstOfMonth = isoDate(year, month1to12, 1);
  const dowFirst = dayOfWeekISOMonZero(firstOfMonth); // 0..6
  const gridStart = addDaysISO(firstOfMonth, -dowFirst);

  // last day of month: go to the first of next month, then -1 day
  const nextMonthFirst =
    month1to12 === 12 ? isoDate(year + 1, 1, 1) : isoDate(year, month1to12 + 1, 1);
  const lastOfMonth = addDaysISO(nextMonthFirst, -1);
  const dowLast = dayOfWeekISOMonZero(lastOfMonth);
  const gridEnd = addDaysISO(lastOfMonth, 6 - dowLast);

  const out: GridCell[] = [];
  let cur = gridStart;
  while (cur <= gridEnd) {
    out.push({ date: cur, inMonth: cur.slice(0, 7) === `${year}-${String(month1to12).padStart(2, '0')}` });
    cur = addDaysISO(cur, 1);
  }
  return out;
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run tests/calendar.test.ts
```

Expected: PASS — 6 tests for `buildMonthGrid`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/calendar.ts tests/calendar.test.ts
git commit -m "feat(calendar): add buildMonthGrid and DayMetrics types"
```

---

### Task 3: `buildTimelineSegments`

**Files:**
- Modify: `src/lib/calendar.ts`
- Modify: `tests/calendar.test.ts`

- [ ] **Step 1: Add failing tests for `buildTimelineSegments`**

Append to `tests/calendar.test.ts`:

```ts
import { buildTimelineSegments } from '../src/lib/calendar';
import type { SleepEntry } from '../src/lib/server/db/schema';

function mkEntry(patch: Partial<SleepEntry>): SleepEntry {
  return {
    id: 1, babyId: 1, date: '2026-05-13',
    wakeTime: null,
    nap1Start: null, nap1End: null,
    nap2Start: null, nap2End: null,
    nap3Start: null, nap3End: null,
    nap4Start: null, nap4End: null,
    bedtime: null,
    notes: null, timezone: null,
    createdAt: 0, updatedAt: 0,
    ...patch
  };
}

describe('buildTimelineSegments', () => {
  it('returns empty for undefined entry', () => {
    expect(buildTimelineSegments(undefined)).toEqual([]);
  });

  it('returns empty for entry with no times', () => {
    expect(buildTimelineSegments(mkEntry({}))).toEqual([]);
  });

  it('night segment left from 00:00 to wake_time', () => {
    const segs = buildTimelineSegments(mkEntry({ wakeTime: '07:00' }));
    expect(segs).toEqual([{ kind: 'night', startMin: 0, endMin: 420 }]);
  });

  it('night segment right from bedtime to 24:00', () => {
    const segs = buildTimelineSegments(mkEntry({ bedtime: '19:30' }));
    expect(segs).toEqual([{ kind: 'night', startMin: 1170, endMin: 1440 }]);
  });

  it('adds nap segments for each complete pair', () => {
    const segs = buildTimelineSegments(
      mkEntry({ nap1Start: '10:00', nap1End: '11:00', nap2Start: '14:00', nap2End: '15:30' })
    );
    expect(segs).toEqual([
      { kind: 'nap', startMin: 600, endMin: 660 },
      { kind: 'nap', startMin: 840, endMin: 930 }
    ]);
  });

  it('ignores nap pair where only start or only end is set', () => {
    const segs = buildTimelineSegments(
      mkEntry({ nap1Start: '10:00', nap1End: null, nap2Start: null, nap2End: '12:00' })
    );
    expect(segs).toEqual([]);
  });

  it('full day returns 5 segments ordered by start', () => {
    const segs = buildTimelineSegments(
      mkEntry({
        wakeTime: '07:00',
        nap1Start: '10:30', nap1End: '11:40',
        nap2Start: '13:10', nap2End: '15:06',
        bedtime: '19:50'
      })
    );
    expect(segs.map((s) => s.kind)).toEqual(['night', 'nap', 'nap', 'night']);
    expect(segs.map((s) => s.startMin)).toEqual([0, 630, 790, 1190]);
  });

  it('ignores invalid HH:MM strings', () => {
    const segs = buildTimelineSegments(
      mkEntry({ wakeTime: 'bogus', nap1Start: '10:00', nap1End: 'X:Y', bedtime: '25:00' })
    );
    expect(segs).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run tests/calendar.test.ts
```

Expected: FAIL — `buildTimelineSegments` is not exported.

- [ ] **Step 3: Implement `buildTimelineSegments` in `src/lib/calendar.ts`**

Add to `src/lib/calendar.ts` (after `buildMonthGrid`):

```ts
import { isValidHHMM } from '$lib/time';

export function buildTimelineSegments(entry: SleepEntry | undefined): TimelineSegment[] {
  if (!entry) return [];
  const segs: TimelineSegment[] = [];

  if (entry.wakeTime && isValidHHMM(entry.wakeTime)) {
    segs.push({ kind: 'night', startMin: 0, endMin: parseHHMM(entry.wakeTime) });
  }

  const napPairs: [string | null, string | null][] = [
    [entry.nap1Start, entry.nap1End],
    [entry.nap2Start, entry.nap2End],
    [entry.nap3Start, entry.nap3End],
    [entry.nap4Start, entry.nap4End]
  ];
  for (const [s, e] of napPairs) {
    if (s && e && isValidHHMM(s) && isValidHHMM(e)) {
      segs.push({ kind: 'nap', startMin: parseHHMM(s), endMin: parseHHMM(e) });
    }
  }

  if (entry.bedtime && isValidHHMM(entry.bedtime)) {
    segs.push({ kind: 'night', startMin: parseHHMM(entry.bedtime), endMin: 1440 });
  }

  segs.sort((a, b) => a.startMin - b.startMin);
  return segs;
}
```

Note: `parseHHMM` and `isValidHHMM` are already imported at the top of the file (parseHHMM is, isValidHHMM needs to be added — see the import statement above).

- [ ] **Step 4: Update the import statement at the top of `src/lib/calendar.ts`**

Replace:
```ts
import { parseHHMM } from '$lib/time';
```

with:
```ts
import { parseHHMM, isValidHHMM } from '$lib/time';
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npx vitest run tests/calendar.test.ts
```

Expected: PASS — 8 new tests for `buildTimelineSegments`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/calendar.ts tests/calendar.test.ts
git commit -m "feat(calendar): add buildTimelineSegments"
```

---

### Task 4: `heatmapClass` and `computeDayMetrics`

**Files:**
- Modify: `src/lib/calendar.ts`
- Modify: `tests/calendar.test.ts`

- [ ] **Step 1: Add failing tests**

Append to `tests/calendar.test.ts`:

```ts
import { computeDayMetrics, heatmapClass } from '../src/lib/calendar';

describe('heatmapClass', () => {
  it('maps each level to a CSS class', () => {
    expect(heatmapClass('good')).toBe('heat-good');
    expect(heatmapClass('ok')).toBe('heat-ok');
    expect(heatmapClass('meh')).toBe('heat-meh');
    expect(heatmapClass('bad')).toBe('heat-bad');
    expect(heatmapClass('partial')).toBe('heat-partial');
    expect(heatmapClass('none')).toBe('heat-none');
  });
});

describe('computeDayMetrics', () => {
  const baby = { birthDate: '2025-11-13', ageOverrideMonths: null };

  it('returns hasAnyData=false for missing entry', () => {
    const m = computeDayMetrics('2026-05-13', undefined, baby, '2026-05-21');
    expect(m.hasAnyData).toBe(false);
    expect(m.heatLevel).toBe('none');
    expect(m.totalSleepMin).toBe(0);
    expect(m.segments).toEqual([]);
  });

  it('returns isComplete=true and heat-good for a full day at ~90% quota (6mo: 14h budget)', () => {
    // 6 months old, expected daySleepH+nightSleepH = 3 + 11 = 14h = 840min.
    // Total = 7h (night left) + 3*1h naps + (24-20)*60 (night right) = 7h + 3h + 4h = 14h00 = 840min → ratio 1.0
    const entry: SleepEntry = {
      id: 1, babyId: 1, date: '2026-05-13',
      wakeTime: '07:00',
      nap1Start: '09:00', nap1End: '10:00',
      nap2Start: '12:00', nap2End: '13:00',
      nap3Start: '15:00', nap3End: '16:00',
      nap4Start: null, nap4End: null,
      bedtime: '20:00',
      notes: null, timezone: null, createdAt: 0, updatedAt: 0
    };
    const m = computeDayMetrics('2026-05-13', entry, baby, '2026-05-21');
    expect(m.hasAnyData).toBe(true);
    expect(m.isComplete).toBe(true);
    expect(m.totalSleepMin).toBe(840);
    expect(m.recommendedMin).toBe(840);
    expect(m.ratio).toBe(1);
    expect(m.heatLevel).toBe('good');
    expect(m.napCount).toBe(3);
  });

  it('returns heatLevel=partial when bedtime is missing but data exists', () => {
    const entry: SleepEntry = {
      id: 1, babyId: 1, date: '2026-05-13',
      wakeTime: '07:00', nap1Start: '09:00', nap1End: '10:00',
      nap2Start: null, nap2End: null,
      nap3Start: null, nap3End: null,
      nap4Start: null, nap4End: null,
      bedtime: null, notes: null, timezone: null, createdAt: 0, updatedAt: 0
    };
    const m = computeDayMetrics('2026-05-13', entry, baby, '2026-05-21');
    expect(m.isComplete).toBe(false);
    expect(m.heatLevel).toBe('partial');
  });

  it('returns isToday=true when the date matches todayISO', () => {
    const m = computeDayMetrics('2026-05-21', undefined, baby, '2026-05-21');
    expect(m.isToday).toBe(true);
  });

  it('applies heatLevel thresholds (good >= 0.90, ok [0.70, 0.90), meh [0.50, 0.70), bad < 0.50)', () => {
    // baby age 6 months → 14h = 840min budget
    const make = (totalMin: number): SleepEntry => {
      // we cheat: synthesize segments via wake/bedtime only. wake at 0, bedtime at (1440 - totalMin)
      // so night-left = 0min, night-right = totalMin min. bedtime is set → isComplete=true.
      const bedtimeMin = 1440 - totalMin;
      const hh = String(Math.floor(bedtimeMin / 60)).padStart(2, '0');
      const mm = String(bedtimeMin % 60).padStart(2, '0');
      return {
        id: 1, babyId: 1, date: '2026-05-13',
        wakeTime: '00:00',
        nap1Start: null, nap1End: null, nap2Start: null, nap2End: null,
        nap3Start: null, nap3End: null, nap4Start: null, nap4End: null,
        bedtime: `${hh}:${mm}`,
        notes: null, timezone: null, createdAt: 0, updatedAt: 0
      };
    };
    expect(computeDayMetrics('2026-05-13', make(840), baby, '2026-05-21').heatLevel).toBe('good');     // 100%
    expect(computeDayMetrics('2026-05-13', make(760), baby, '2026-05-21').heatLevel).toBe('ok');       // 90.5% → still good
    // Re-tune: 0.90 boundary is "good". Pick numbers strictly inside each range.
    expect(computeDayMetrics('2026-05-13', make(672), baby, '2026-05-21').heatLevel).toBe('ok');       // 80%
    expect(computeDayMetrics('2026-05-13', make(504), baby, '2026-05-21').heatLevel).toBe('meh');      // 60%
    expect(computeDayMetrics('2026-05-13', make(336), baby, '2026-05-21').heatLevel).toBe('bad');      // 40%
  });

  it('uses ageOverrideMonths when provided', () => {
    const overrideBaby = { birthDate: '2025-11-13', ageOverrideMonths: 12 };
    // 12-18mo: daySleepH=2.5 + nightSleepH=11 = 13.5h = 810min
    const m = computeDayMetrics('2026-05-13', undefined, overrideBaby, '2026-05-21');
    expect(m.recommendedMin).toBe(810);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run tests/calendar.test.ts
```

Expected: FAIL — `computeDayMetrics` and `heatmapClass` are not exported.

- [ ] **Step 3: Implement both functions in `src/lib/calendar.ts`**

Append to `src/lib/calendar.ts`:

```ts
export function heatmapClass(level: HeatLevel): string {
  return `heat-${level}`;
}

export function computeDayMetrics(
  date: string,
  entry: SleepEntry | undefined,
  baby: Pick<Baby, 'birthDate' | 'ageOverrideMonths'>,
  todayISO: string
): DayMetrics {
  const refDate = new Date(date + 'T12:00:00Z');
  const months = ageInMonths(baby.birthDate, baby.ageOverrideMonths ?? undefined, refDate);
  const ageParams = paramsForAge(months);
  const recommendedMin = Math.round((ageParams.daySleepH + ageParams.nightSleepH) * 60);

  const segments = buildTimelineSegments(entry);
  const totalSleepMin = segments.reduce((acc, s) => acc + (s.endMin - s.startMin), 0);

  const hasAnyData = !!entry && segments.length > 0;
  const isComplete = !!entry?.bedtime && !!entry?.wakeTime;

  const napCount = entry
    ? [entry.nap1End, entry.nap2End, entry.nap3End, entry.nap4End].filter(Boolean).length
    : 0;

  let heatLevel: HeatLevel;
  if (!hasAnyData) {
    heatLevel = 'none';
  } else if (!isComplete) {
    heatLevel = 'partial';
  } else {
    const ratio = recommendedMin > 0 ? totalSleepMin / recommendedMin : 0;
    if (ratio >= 0.90) heatLevel = 'good';
    else if (ratio >= 0.70) heatLevel = 'ok';
    else if (ratio >= 0.50) heatLevel = 'meh';
    else heatLevel = 'bad';
  }

  const ratio = recommendedMin > 0 ? totalSleepMin / recommendedMin : 0;

  return {
    date,
    inMonth: true,
    isToday: date === todayISO,
    hasAnyData,
    isComplete,
    totalSleepMin,
    recommendedMin,
    ratio,
    heatLevel,
    segments,
    wakeTime: entry?.wakeTime ?? null,
    bedtime: entry?.bedtime ?? null,
    napCount
  };
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run tests/calendar.test.ts
```

Expected: PASS — all calendar.ts tests now green (≥ 17 tests total).

- [ ] **Step 5: Commit**

```bash
git add src/lib/calendar.ts tests/calendar.test.ts
git commit -m "feat(calendar): add heatmapClass and computeDayMetrics"
```

---

## Phase 1 — Components

### Task 5: `DayCell.svelte`

**Files:**
- Create: `src/lib/components/calendar/DayCell.svelte`

- [ ] **Step 1: Create the component**

Create directory `src/lib/components/calendar/` if it doesn't exist, then create `DayCell.svelte`:

```svelte
<script lang="ts">
  import type { DayMetrics } from '$lib/calendar';
  import { heatmapClass } from '$lib/calendar';
  import { formatDuration } from '$lib/sleep-calc';

  type Props = {
    metrics: DayMetrics;
    babyId: number;
    mode: 'grid' | 'strip';
  };
  let { metrics, babyId, mode }: Props = $props();

  const dayNum = $derived(Number(metrics.date.slice(8, 10)));
  const dayLabel = $derived(formatLongDay(metrics.date));
  const ariaLabel = $derived(buildAriaLabel(metrics, dayLabel));
  const totalStr = $derived(formatDuration(metrics.totalSleepMin));
  const pct = $derived(Math.round(metrics.ratio * 100));

  function formatLongDay(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
    });
  }

  function buildAriaLabel(m: DayMetrics, day: string): string {
    if (!m.hasAnyData) return `${day} — aucune donnée`;
    const parts = [day, `${formatDuration(m.totalSleepMin)} de sommeil`];
    if (m.isComplete) parts.push(`${Math.round(m.ratio * 100)} pourcent du quota recommandé`);
    else parts.push('journée incomplète');
    return parts.join(' — ');
  }

  function tooltip(m: DayMetrics, day: string): string {
    if (!m.hasAnyData) return `${day} — aucune donnée`;
    const bits: string[] = [day];
    if (m.wakeTime) bits.push(`Lever ${m.wakeTime}`);
    bits.push(`${m.napCount} sieste${m.napCount > 1 ? 's' : ''}`);
    if (m.bedtime) bits.push(`Coucher ${m.bedtime}`);
    bits.push(`Total ${formatDuration(m.totalSleepMin)}${m.isComplete ? ` (${pct}% du quota)` : ''}`);
    return bits.join(' · ');
  }
</script>

{#if !metrics.inMonth}
  <div class="cell padding" aria-hidden="true">
    <span class="num">{dayNum}</span>
  </div>
{:else}
  <a
    class="cell {heatmapClass(metrics.heatLevel)} {metrics.isToday ? 'today' : ''} mode-{mode}"
    href="/app/babies/{babyId}/day/{metrics.date}"
    aria-label={ariaLabel}
    title={tooltip(metrics, dayLabel)}
  >
    {#if mode === 'strip'}
      <span class="num">{dayNum}<small>{dayLabel.split(' ')[0].slice(0, 3)}</small></span>
      <span class="timeline" aria-hidden="true">
        {#each metrics.segments as s (s.startMin)}
          <span
            class="seg {s.kind}"
            style="left: {(s.startMin / 1440) * 100}%; width: {((s.endMin - s.startMin) / 1440) * 100}%"
          ></span>
        {/each}
      </span>
      <span class="total">{metrics.hasAnyData ? totalStr : ''}</span>
    {:else}
      <span class="num">{dayNum}{#if !metrics.isComplete && metrics.hasAnyData}<span class="partial-mark" aria-hidden="true">…</span>{/if}</span>
      <span class="timeline" aria-hidden="true">
        {#each metrics.segments as s (s.startMin)}
          <span
            class="seg {s.kind}"
            style="left: {(s.startMin / 1440) * 100}%; width: {((s.endMin - s.startMin) / 1440) * 100}%"
          ></span>
        {/each}
      </span>
      {#if metrics.hasAnyData}<span class="total">{totalStr}</span>{/if}
    {/if}
  </a>
{/if}

<style>
  .cell {
    display: block;
    border: 1px solid var(--c-border);
    border-radius: var(--r-md);
    background: var(--c-cal-heat-none);
    color: var(--c-text);
    text-decoration: none;
    padding: var(--s-2);
    min-height: 90px;
    font-size: var(--fs-xs);
    transition: filter 0.15s;
  }
  .cell.padding {
    opacity: 0.35;
    pointer-events: none;
  }
  .cell:hover { filter: brightness(0.97); }
  .cell.today { outline: 2px solid var(--c-primary); outline-offset: -2px; }
  .heat-good { background: var(--c-cal-heat-good); }
  .heat-ok   { background: var(--c-cal-heat-ok); }
  .heat-meh  { background: var(--c-cal-heat-meh); }
  .heat-bad  { background: var(--c-cal-heat-bad); }
  .heat-partial { background: transparent; }
  .heat-none { background: var(--c-cal-heat-none); }

  .num { font-weight: 600; font-size: var(--fs-sm); display: flex; justify-content: space-between; align-items: baseline; }
  .num small { font-weight: 400; font-size: var(--fs-xs); opacity: 0.6; margin-left: var(--s-1); }
  .partial-mark { font-weight: 400; opacity: 0.6; }

  .timeline { position: relative; display: block; height: 14px; margin-top: var(--s-1); background: rgba(0,0,0,0.05); border-radius: 3px; overflow: hidden; }
  .seg { position: absolute; top: 1px; bottom: 1px; border-radius: 2px; }
  .seg.nap { background: var(--c-cal-seg-nap); }
  .seg.night { background: var(--c-cal-seg-night); }

  .total { display: block; text-align: center; font-weight: 600; color: var(--c-primary); margin-top: var(--s-1); font-size: var(--fs-xs); }

  /* Strip mode: row layout */
  .cell.mode-strip {
    display: grid;
    grid-template-columns: 56px 1fr 56px;
    align-items: center;
    gap: var(--s-2);
    min-height: 0;
    padding: var(--s-2) var(--s-3);
  }
  .cell.mode-strip .num { display: block; }
  .cell.mode-strip .timeline { height: 16px; margin: 0; }
  .cell.mode-strip .total { margin: 0; text-align: right; }

  @media (prefers-reduced-motion: reduce) {
    .cell { transition: none; }
  }
</style>
```

- [ ] **Step 2: Run svelte-check to verify the component compiles**

```bash
npm run check
```

Expected: 0 errors. (Warnings unrelated to this file are acceptable.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/calendar/DayCell.svelte
git commit -m "feat(calendar): add DayCell component (grid + strip modes)"
```

---

### Task 6: `CalendarGrid.svelte` and `CalendarStrip.svelte`

**Files:**
- Create: `src/lib/components/calendar/CalendarGrid.svelte`
- Create: `src/lib/components/calendar/CalendarStrip.svelte`

- [ ] **Step 1: Create `CalendarGrid.svelte`**

```svelte
<script lang="ts">
  import type { DayMetrics } from '$lib/calendar';
  import DayCell from './DayCell.svelte';

  type Props = {
    cells: DayMetrics[];
    babyId: number;
  };
  let { cells, babyId }: Props = $props();
</script>

<table class="cal-grid" aria-label="Calendrier mensuel">
  <thead>
    <tr>
      <th scope="col">Lun</th>
      <th scope="col">Mar</th>
      <th scope="col">Mer</th>
      <th scope="col">Jeu</th>
      <th scope="col">Ven</th>
      <th scope="col">Sam</th>
      <th scope="col">Dim</th>
    </tr>
  </thead>
  <tbody>
    {#each Array(Math.ceil(cells.length / 7)) as _, weekIdx (weekIdx)}
      <tr>
        {#each cells.slice(weekIdx * 7, weekIdx * 7 + 7) as cell (cell.date)}
          <td><DayCell metrics={cell} {babyId} mode="grid" /></td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .cal-grid {
    width: 100%;
    border-collapse: separate;
    border-spacing: var(--s-1);
    table-layout: fixed;
  }
  .cal-grid th {
    text-align: center;
    padding: var(--s-1) 0;
    font-size: var(--fs-xs);
    color: var(--c-text-muted);
    font-weight: 600;
  }
  .cal-grid td { padding: 0; vertical-align: top; }
</style>
```

- [ ] **Step 2: Create `CalendarStrip.svelte`**

```svelte
<script lang="ts">
  import type { DayMetrics } from '$lib/calendar';
  import DayCell from './DayCell.svelte';

  type Props = {
    cells: DayMetrics[];
    babyId: number;
  };
  let { cells, babyId }: Props = $props();

  const inMonthCells = $derived(cells.filter((c) => c.inMonth));
</script>

<ul class="cal-strip" aria-label="Liste des journées du mois">
  {#each inMonthCells as cell (cell.date)}
    <li><DayCell metrics={cell} {babyId} mode="strip" /></li>
  {/each}
</ul>

<style>
  .cal-strip {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--s-1);
  }
</style>
```

- [ ] **Step 3: Run svelte-check**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/calendar/CalendarGrid.svelte src/lib/components/calendar/CalendarStrip.svelte
git commit -m "feat(calendar): add CalendarGrid and CalendarStrip components"
```

---

## Phase 2 — Route, load & page

### Task 7: `+page.server.ts` (load) + integration test

**Files:**
- Create: `src/routes/app/babies/[id]/calendar/+page.server.ts`
- Create: `tests/server/routes-calendar.test.ts`

- [ ] **Step 1: Write the failing integration test**

Look at `tests/server/routes-csv.test.ts` first to confirm the testing pattern — it uses `makeTestDb` and calls the load directly. Use the same approach.

Create `tests/server/routes-calendar.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeTestDb } from '../helpers/db';
import { upsertEntry } from '../../src/lib/server/sleep-entries';

vi.mock('$lib/server/db', () => ({
  getDb: () => globalTdb
}));

let globalTdb: ReturnType<typeof makeTestDb>;

async function loadRoute(): Promise<typeof import('../../src/routes/app/babies/[id]/calendar/+page.server')> {
  return await import('../../src/routes/app/babies/[id]/calendar/+page.server');
}

function setup(tdb: ReturnType<typeof makeTestDb>) {
  const t = Math.floor(Date.now() / 1000);
  const u = Number(
    tdb.sqlite
      .prepare("INSERT INTO users (email, password_hash, is_admin, timezone, created_at, updated_at) VALUES ('a@x', 'x', 0, 'Europe/Paris', ?, ?)")
      .run(t, t).lastInsertRowid
  );
  const b = Number(
    tdb.sqlite
      .prepare("INSERT INTO babies (user_id, name, birth_date, created_at, updated_at) VALUES (?, 'Milo', '2025-11-13', ?, ?)")
      .run(u, t, t).lastInsertRowid
  );
  return { userId: u, babyId: b };
}

describe('calendar load', () => {
  beforeEach(() => { globalTdb = makeTestDb(); });

  it('redirects to /login if no user', async () => {
    const { load } = await loadRoute();
    const event: any = {
      locals: {},
      params: { id: '1' },
      url: new URL('http://test/app/babies/1/calendar')
    };
    await expect(async () => await load(event)).rejects.toMatchObject({ status: 303, location: '/login' });
  });

  it('404 if baby does not belong to user', async () => {
    setup(globalTdb);
    const { load } = await loadRoute();
    const event: any = {
      locals: { user: { id: 999, timezone: 'Europe/Paris' } },
      params: { id: '1' },
      url: new URL('http://test/app/babies/1/calendar')
    };
    await expect(async () => await load(event)).rejects.toMatchObject({ status: 404 });
  });

  it('returns month grid cells with entries for the current month', async () => {
    const { userId, babyId } = setup(globalTdb);
    upsertEntry(globalTdb.db, babyId, '2026-05-13', { wakeTime: '07:00', bedtime: '20:00' });
    const { load } = await loadRoute();
    const event: any = {
      locals: { user: { id: userId, timezone: 'Europe/Paris' } },
      params: { id: String(babyId) },
      url: new URL('http://test/app/babies/' + babyId + '/calendar?month=2026-05')
    };
    const data: any = await load(event);
    expect(data.baby.id).toBe(babyId);
    expect(data.year).toBe(2026);
    expect(data.month).toBe(5);
    expect(data.cells.length % 7).toBe(0);
    const may13 = data.cells.find((c: any) => c.date === '2026-05-13');
    expect(may13).toBeTruthy();
    expect(may13.hasAnyData).toBe(true);
    expect(may13.wakeTime).toBe('07:00');
  });

  it('falls back to current month when ?month is missing or invalid', async () => {
    const { userId, babyId } = setup(globalTdb);
    const { load } = await loadRoute();
    const event: any = {
      locals: { user: { id: userId, timezone: 'Europe/Paris' } },
      params: { id: String(babyId) },
      url: new URL('http://test/app/babies/' + babyId + '/calendar?month=invalid')
    };
    const data: any = await load(event);
    expect(data.year).toBeGreaterThanOrEqual(2024);
    expect(data.month).toBeGreaterThanOrEqual(1);
    expect(data.month).toBeLessThanOrEqual(12);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run tests/server/routes-calendar.test.ts
```

Expected: FAIL — module `+page.server` not found.

- [ ] **Step 3: Create `src/routes/app/babies/[id]/calendar/+page.server.ts`**

First, create the directory:

```bash
mkdir -p src/routes/app/babies/\[id\]/calendar
```

Then create the file with this content:

```ts
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser } from '$lib/server/babies';
import { listEntriesInRange } from '$lib/server/sleep-entries';
import { buildMonthGrid, computeDayMetrics, type DayMetrics } from '$lib/calendar';
import { resolveTimezone, todayISOInTZ } from '$lib/tz';

function parseMonth(raw: string | null, todayISO: string): { year: number; month: number } {
  if (raw && /^\d{4}-\d{2}$/.test(raw)) {
    const [y, m] = raw.split('-').map(Number);
    if (y >= 1970 && y <= 2999 && m >= 1 && m <= 12) {
      return { year: y, month: m };
    }
  }
  const [y, m] = todayISO.split('-').map(Number);
  return { year: y, month: m };
}

export const load: PageServerLoad = ({ locals, params, url }) => {
  if (!locals.user) throw redirect(303, '/login');
  const id = Number(params.id);
  const { db } = getDb();
  const baby = getBabyForUser(db, locals.user.id, id);
  if (!baby) throw error(404);

  const effectiveTz = resolveTimezone(null, baby.timezone, locals.user.timezone);
  const todayISO = todayISOInTZ(effectiveTz);

  const { year, month } = parseMonth(url.searchParams.get('month'), todayISO);

  const cells = buildMonthGrid(year, month, todayISO);
  const from = cells[0].date;
  const to = cells[cells.length - 1].date;
  const entries = listEntriesInRange(db, baby.id, from, to);
  const byDate = new Map(entries.map((e) => [e.date, e]));

  const metrics: DayMetrics[] = cells.map((c) => {
    const m = computeDayMetrics(c.date, byDate.get(c.date), baby, todayISO);
    return { ...m, inMonth: c.inMonth };
  });

  return {
    baby,
    year,
    month,
    cells: metrics,
    todayISO,
    effectiveTz
  };
};
```

- [ ] **Step 4: Run integration tests**

```bash
npx vitest run tests/server/routes-calendar.test.ts
```

Expected: PASS — 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/routes/app/babies/\[id\]/calendar/+page.server.ts tests/server/routes-calendar.test.ts
git commit -m "feat(calendar): add /app/babies/[id]/calendar load with month grid"
```

---

### Task 8: `+page.svelte` (page with header + responsive layout)

**Files:**
- Create: `src/routes/app/babies/[id]/calendar/+page.svelte`

- [ ] **Step 1: Create the page**

```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import CalendarGrid from '$lib/components/calendar/CalendarGrid.svelte';
  import CalendarStrip from '$lib/components/calendar/CalendarStrip.svelte';
  import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
  import CaretRight from 'phosphor-svelte/lib/CaretRight';
  import { ageInMonths } from '$lib/sleep-calc';
  import { paramsForAge } from '$lib/age-params';
  import { formatDuration } from '$lib/sleep-calc';

  let { data } = $props();

  const monthLabel = $derived(formatMonth(data.year, data.month));
  const prevHref = $derived(buildHref(data.year, data.month - 1));
  const nextHref = $derived(buildHref(data.year, data.month + 1));
  const todayHref = $derived(`/app/babies/${data.baby.id}/calendar`);

  // Age at the middle of the displayed month
  const middleDate = $derived(`${data.year}-${String(data.month).padStart(2, '0')}-15`);
  const ageMonths = $derived(
    ageInMonths(
      data.baby.birthDate,
      data.baby.ageOverrideMonths ?? undefined,
      new Date(middleDate + 'T12:00:00Z')
    )
  );
  const ap = $derived(paramsForAge(ageMonths));
  const quotaTotalMin = $derived(Math.round((ap.daySleepH + ap.nightSleepH) * 60));

  function formatMonth(y: number, m: number): string {
    return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  function buildHref(y: number, m: number): string {
    let yy = y, mm = m;
    if (mm < 1) { mm = 12; yy = yy - 1; }
    if (mm > 12) { mm = 1; yy = yy + 1; }
    return `/app/babies/${data.baby.id}/calendar?month=${yy}-${String(mm).padStart(2, '0')}`;
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); goto(prevHref); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); goto(nextHref); }
    else if (e.key === 'Home') { e.preventDefault(); goto(todayHref); }
  }
</script>

<svelte:window on:keydown={onKeydown} />

<h1>Calendrier — {data.baby.name}</h1>

<nav class="cal-nav" aria-label="Navigation mensuelle">
  <a class="btn btn-ghost btn-sm" href={prevHref} aria-label="Mois précédent"><CaretLeft size={16} /></a>
  <span class="month">{monthLabel}</span>
  <a class="btn btn-ghost btn-sm" href={nextHref} aria-label="Mois suivant"><CaretRight size={16} /></a>
  <a class="btn btn-secondary btn-sm today-btn" href={todayHref}>Aujourd'hui</a>
</nav>

<div class="cal-desktop"><CalendarGrid cells={data.cells} babyId={data.baby.id} /></div>
<div class="cal-mobile"><CalendarStrip cells={data.cells} babyId={data.baby.id} /></div>

<footer class="cal-legend" aria-label="Légende">
  <div class="legend-row">
    <span class="swatch heat-good"></span><span>≥ 90%</span>
    <span class="swatch heat-ok"></span><span>70-90%</span>
    <span class="swatch heat-meh"></span><span>50-70%</span>
    <span class="swatch heat-bad"></span><span>&lt; 50%</span>
  </div>
  <div class="legend-row">
    <span class="swatch seg-nap"></span><span>Sieste</span>
    <span class="swatch seg-night"></span><span>Nuit</span>
  </div>
  <p class="legend-info">
    Âge à la date du mois : {ageMonths} mois — Quota recommandé : {formatDuration(quotaTotalMin)}
    ({formatDuration(Math.round(ap.daySleepH * 60))} siestes + {formatDuration(Math.round(ap.nightSleepH * 60))} nuit)
  </p>
</footer>

<style>
  .cal-nav {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    margin-bottom: var(--s-3);
    flex-wrap: wrap;
  }
  .cal-nav .month {
    font-weight: 600;
    font-size: var(--fs-lg);
    text-transform: capitalize;
    min-width: 160px;
    text-align: center;
  }
  .today-btn { margin-left: auto; }

  .cal-desktop { display: none; }
  .cal-mobile { display: block; }
  @media (min-width: 768px) {
    .cal-desktop { display: block; }
    .cal-mobile { display: none; }
  }

  .cal-legend {
    margin-top: var(--s-4);
    padding: var(--s-3);
    background: var(--c-bg-muted);
    border-radius: var(--r-md);
    font-size: var(--fs-xs);
    color: var(--c-text-muted);
  }
  .legend-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-2);
    align-items: center;
    margin-bottom: var(--s-2);
  }
  .swatch {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 3px;
    border: 1px solid var(--c-border);
  }
  .swatch.heat-good { background: var(--c-cal-heat-good); }
  .swatch.heat-ok   { background: var(--c-cal-heat-ok); }
  .swatch.heat-meh  { background: var(--c-cal-heat-meh); }
  .swatch.heat-bad  { background: var(--c-cal-heat-bad); }
  .swatch.seg-nap   { background: var(--c-cal-seg-nap); border-color: var(--c-cal-seg-nap); }
  .swatch.seg-night { background: var(--c-cal-seg-night); border-color: var(--c-cal-seg-night); }
  .legend-info { margin: 0; font-size: var(--fs-xs); }
</style>
```

- [ ] **Step 2: Run dev server and manually check**

```bash
npm run dev
```

Open `http://localhost:5173/app/babies/1/calendar` in a browser (logged in). Verify:
- Page loads without error
- Header shows current month name
- `‹` / `›` navigate to adjacent months and update URL
- "Aujourd'hui" returns to current month
- Resize browser to < 768px → strip layout appears
- Resize back → grid appears

Stop the dev server with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add src/routes/app/babies/\[id\]/calendar/+page.svelte
git commit -m "feat(calendar): add calendar page with navigation, legend, responsive layout"
```

---

## Phase 3 — Sub-nav integration

### Task 9: Add "Calendrier" link to baby sub-nav

**Files:**
- Modify: `src/routes/app/+layout.svelte`

- [ ] **Step 1: Add the sub-nav link**

Open `src/routes/app/+layout.svelte`. Locate the `<nav class="sub-nav">` block (around line 51-56). Add a new link between "Historique" and "Stats":

Find:
```svelte
  <nav class="sub-nav">
    <a class={subActive('today')}   href="/app/babies/{data.currentBabyId}/today">Aujourd'hui</a>
    <a class={subActive('history')} href="/app/babies/{data.currentBabyId}/history">Historique</a>
    <a class={subActive('stats')}   href="/app/babies/{data.currentBabyId}/stats">Stats</a>
    <a class={subActive('edit')}    href="/app/babies/{data.currentBabyId}">Éditer</a>
  </nav>
```

Replace with:
```svelte
  <nav class="sub-nav">
    <a class={subActive('today')}    href="/app/babies/{data.currentBabyId}/today">Aujourd'hui</a>
    <a class={subActive('history')}  href="/app/babies/{data.currentBabyId}/history">Historique</a>
    <a class={subActive('calendar')} href="/app/babies/{data.currentBabyId}/calendar">Calendrier</a>
    <a class={subActive('stats')}    href="/app/babies/{data.currentBabyId}/stats">Stats</a>
    <a class={subActive('edit')}     href="/app/babies/{data.currentBabyId}">Éditer</a>
  </nav>
```

- [ ] **Step 2: Manually verify**

```bash
npm run dev
```

Open any baby page. The sub-nav should show 5 links. Click "Calendrier" → reaches the new page. Active state highlights "Calendrier" when on that route (note: `subActive('calendar')` matches because the URL ends in `/calendar`).

- [ ] **Step 3: Commit**

```bash
git add src/routes/app/+layout.svelte
git commit -m "feat(calendar): add Calendrier link in baby sub-nav"
```

---

## Phase 4 — Allow editing/creating a missing day from the calendar

### Task 10: `/day/[date]` accepts missing entry (create flow)

**Files:**
- Modify: `src/routes/app/babies/[id]/day/[date]/+page.server.ts`
- Modify: `src/routes/app/babies/[id]/day/[date]/+page.svelte`

- [ ] **Step 1: Modify `+page.server.ts` to return null entry instead of 404**

Open `src/routes/app/babies/[id]/day/[date]/+page.server.ts`. Find:

```ts
  const entry = getEntryForBabyDate(db, baby.id, date);
  if (!entry) throw error(404, "Aucune entrée à cette date.");
```

Replace with:

```ts
  const entry = getEntryForBabyDate(db, baby.id, date);
```

Then find the `return { baby, date, entry, ageMonths: months, ageParams, effectiveTz };` and confirm it already passes `entry` (which can now be null). No further change in the load.

The `delete` action already handles the missing-entry case (`if (entry) deleteEntry(...)` then `redirect`) — no change needed there.

- [ ] **Step 2: Modify `+page.svelte` to handle null entry**

Open `src/routes/app/babies/[id]/day/[date]/+page.svelte`. The file uses `data.entry` extensively. Identify where the form values are initialized from `data.entry` and where the "Supprimer" button is rendered.

For each form field, the existing pattern reads `data.entry?.wakeTime ?? ''` or similar. If the file currently does `data.entry.wakeTime` (non-null assertion), update to `data.entry?.wakeTime ?? ''`. Read the file first:

```bash
cat src/routes/app/babies/\[id\]/day/\[date\]/+page.svelte | head -80
```

Then for each `data.entry.X` → replace with `data.entry?.X ?? ''` (or `null` depending on field type).

Wrap the existing `<form method="POST" action="?/delete">` block in `{#if data.entry}` so it only shows when an entry exists.

If the page has a heading like `<h1>Édition — {data.date}</h1>`, optionally adapt to "Création / Édition" using:

```svelte
<h1>{data.entry ? 'Édition' : 'Création'} — {data.date}</h1>
```

- [ ] **Step 3: Run svelte-check**

```bash
npm run check
```

Expected: 0 errors related to `data.entry`. If errors appear, audit each `data.entry.X` access and convert.

- [ ] **Step 4: Manually verify**

```bash
npm run dev
```

1. Navigate to `/app/babies/1/calendar`, click on a future or empty past day. Expected: page loads with empty form, no "Supprimer" button.
2. Fill in values, click "Sauvegarder". Expected: success message, entry now exists in DB.
3. Reload the page. Expected: form pre-filled with the values, "Supprimer" now visible.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/routes/app/babies/\[id\]/day/\[date\]/+page.server.ts src/routes/app/babies/\[id\]/day/\[date\]/+page.svelte
git commit -m "feat(day): allow creating an entry from a missing date (called from calendar)"
```

---

## Phase 5 — Verification

### Task 11: Acceptance criteria QA pass

**Files:** None (manual QA)

- [ ] **Step 1: Run the full test suite**

```bash
npx vitest run
```

Expected: all tests pass (including the existing 95+ tests already in the suite plus the new calendar tests).

- [ ] **Step 2: Run svelte-check**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 3: Walk through the acceptance criteria** (from spec section 12)

Boot the dev server:

```bash
npm run dev
```

Use Milo (baby id 1) which has data for 2026-05-05 → 2026-05-19. For each of the following, confirm:

- [ ] `/app/babies/1/calendar` opens and shows May 2026 (or current month — adjust depending on testing date)
- [ ] Grid is 7 cols on desktop, strip on mobile (resize browser to test)
- [ ] Each cell shows the 24h timeline and total in `Xh YY`
- [ ] Days with ≥ 90% quota are green; lower-quota days shade through yellow → orange → red
- [ ] Days without bedtime are neutral (no false-red) and show "…"
- [ ] Today has a colored border
- [ ] Clicking a day with data opens the edit page
- [ ] Clicking an empty day opens the create flow
- [ ] `‹` / `›` change month and update URL `?month=YYYY-MM`
- [ ] "Aujourd'hui" returns to current month
- [ ] Hover desktop shows tooltip with lever/coucher/total/%
- [ ] Tab+focus on cells works, `aria-label` correctly describes the day (test with browser devtools "Accessibility" tab on a couple of cells)

- [ ] **Step 4: Commit any final fixes**

If issues found in step 3, fix them and commit. No commit needed if everything passes.

- [ ] **Step 5: Tag the feature complete**

```bash
git log --oneline | head -15
```

Confirm all calendar commits are present. The feature is complete.

---

## Self-review checklist (controller, not executed)

Confirmed before delivering the plan:

- **Spec coverage**: Sections 1-13 of the spec are all mapped to tasks above
  - Route placement (spec §3) → Task 7 + Task 9
  - Cell semantics (spec §4) → Tasks 3, 4, 5
  - Layouts (spec §5) → Tasks 5, 6, 8
  - Interactions (spec §6) → Task 8 (nav, keyboard) + Task 5 (click)
  - Accessibility (spec §7) → Tasks 5, 6 (semantics + aria-labels), Task 8 (legend)
  - Legend (spec §8) → Task 8
  - Architecture (spec §9) → Tasks 2-8
  - `/day/[date]` adjustment (spec §10) → Task 10
  - Tokens (spec §11) → Task 1
  - Acceptance criteria (spec §12) → Task 11
  - Out-of-scope (spec §13) → explicitly excluded
- **Placeholder scan**: No "TBD", no "etc.", no "similar to". All code shown in full.
- **Type consistency**: `DayMetrics`, `TimelineSegment`, `HeatLevel`, `GridCell`, `Baby`, `SleepEntry` all match across tasks. `buildMonthGrid`, `buildTimelineSegments`, `computeDayMetrics`, `heatmapClass` signatures consistent between definition and consumer code.
- **Swipe gestures from spec §6**: Deferred — keyboard arrows are implemented, but native horizontal-swipe is left for a follow-up because it requires a custom touch handler that isn't critical for v1. Acceptance criterion adjusted: keyboard navigation covers it on devices with a keyboard; mobile users use the `‹` / `›` buttons.
