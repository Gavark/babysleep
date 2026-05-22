# BabySleep Wake-Window Timer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sticky live-timer card to `/app/babies/[id]/today` that derives a 4-state timer (empty / awake / napping / bedtime) from the form's current `$state` values, refreshes every 30s, and exposes one-tap "Démarrer / Terminer sieste" actions that auto-submit the form.

**Architecture:** A pure-function module `src/lib/wake-timer.ts` computes the timer state from form inputs + `now`. A `WakeTimer.svelte` component renders the state and owns the `setInterval` for refresh. The Today page passes form `$state` as props and provides setter callbacks; the component never mutates the form directly. Toast feedback for actions is rendered inside the card.

**Tech Stack:** SvelteKit 2 + Svelte 5 runes ($state, $derived, $effect, $props, onMount) + TypeScript strict + Vitest. Reuses existing `parseHHMM`, `isValidHHMM`, `formatHHMM`, `formatDuration` from `$lib/time` and `$lib/sleep-calc`.

**Spec:** `docs/superpowers/specs/2026-05-21-wake-window-timer-design.md`.

---

## File Structure

```
src/
├── lib/
│   ├── wake-timer.ts                                    [NEW — pure functions]
│   └── components/
│       └── WakeTimer.svelte                             [NEW — UI card]
└── routes/
    └── app/
        └── babies/
            └── [id]/
                └── today/
                    └── +page.svelte                     [MODIFY — embed WakeTimer]

tests/
└── wake-timer.test.ts                                   [NEW]
```

---

## Phase 0 — Pure functions (TDD)

### Task 1: Types, helpers, and skeleton

**Files:**
- Create: `d:/Dev/Gavark/CalculateurSommeilBebe/src/lib/wake-timer.ts`
- Create: `d:/Dev/Gavark/CalculateurSommeilBebe/tests/wake-timer.test.ts`

- [ ] **Step 1: Write the failing tests for the slot helpers**

Create `tests/wake-timer.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { nextEmptyNapSlot, inProgressNapSlot, type TimerInput } from '../src/lib/wake-timer';

function mkNaps(naps: Array<[string, string]>): TimerInput['naps'] {
  return naps.map(([s, e]) => ({ start: s, end: e }));
}

describe('nextEmptyNapSlot', () => {
  it('returns 0 when all four slots are empty', () => {
    expect(nextEmptyNapSlot(mkNaps([['', ''], ['', ''], ['', ''], ['', '']]))).toBe(0);
  });

  it('returns 1 when nap1 is filled (start only)', () => {
    expect(nextEmptyNapSlot(mkNaps([['09:00', ''], ['', ''], ['', ''], ['', '']]))).toBe(1);
  });

  it('returns 2 when nap1 and nap2 are filled', () => {
    expect(nextEmptyNapSlot(mkNaps([['09:00', '10:00'], ['12:00', ''], ['', ''], ['', '']]))).toBe(2);
  });

  it('returns null when all four slots have a start time', () => {
    expect(nextEmptyNapSlot(mkNaps([['09:00', '10:00'], ['12:00', '13:00'], ['15:00', '16:00'], ['17:00', '']]))).toBeNull();
  });
});

describe('inProgressNapSlot', () => {
  it('returns null when no slot is in progress', () => {
    expect(inProgressNapSlot(mkNaps([['09:00', '10:00'], ['', ''], ['', ''], ['', '']]))).toBeNull();
  });

  it('returns 0 when nap1 has start but no end', () => {
    expect(inProgressNapSlot(mkNaps([['09:00', ''], ['', ''], ['', ''], ['', '']]))).toBe(0);
  });

  it('returns 2 when nap1 and nap2 are complete and nap3 has start only', () => {
    expect(inProgressNapSlot(mkNaps([['09:00', '10:00'], ['12:00', '13:00'], ['15:00', ''], ['', '']]))).toBe(2);
  });

  it('returns null when all four slots are empty', () => {
    expect(inProgressNapSlot(mkNaps([['', ''], ['', ''], ['', ''], ['', '']]))).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && npx vitest run tests/wake-timer.test.ts
```

Expected: FAIL with "Cannot find module '../src/lib/wake-timer'".

- [ ] **Step 3: Create `src/lib/wake-timer.ts` with types + helpers**

Create `d:/Dev/Gavark/CalculateurSommeilBebe/src/lib/wake-timer.ts`:

```ts
import { isValidHHMM, parseHHMM, formatHHMM } from '$lib/time';

export type TimerInput = {
  wakeTime: string;
  naps: Array<{ start: string; end: string }>;
  bedtime: string;
  awakeWindowMin: number;
};

export type TimerState =
  | { kind: 'empty' }
  | { kind: 'awake'; elapsedMin: number; remainingMin: number; nextNapAt: string; overWindow: boolean }
  | { kind: 'napping'; napIdx: number; elapsedMin: number }
  | { kind: 'bedtime'; bedtime: string };

/** Returns 0..3 for the first empty slot (start is ''), or null if all 4 are filled. */
export function nextEmptyNapSlot(naps: TimerInput['naps']): number | null {
  for (let i = 0; i < naps.length; i++) {
    if (!naps[i].start) return i;
  }
  return null;
}

/** Returns 0..3 for the first slot with start filled but end empty, or null. */
export function inProgressNapSlot(naps: TimerInput['naps']): number | null {
  for (let i = 0; i < naps.length; i++) {
    if (isValidHHMM(naps[i].start) && !naps[i].end) return i;
  }
  return null;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && npx vitest run tests/wake-timer.test.ts
```

Expected: PASS — 8 tests for the two helpers.

- [ ] **Step 5: Commit**

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && git add src/lib/wake-timer.ts tests/wake-timer.test.ts && git commit -m "$(cat <<'EOF'
feat(timer): add wake-timer module skeleton with slot helpers

TimerInput / TimerState types and two pure helpers — nextEmptyNapSlot
and inProgressNapSlot — used by the WakeTimer component to find the
right slot for "Démarrer sieste" and "Terminer sieste" actions.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: `deriveTimerState`

**Files:**
- Modify: `d:/Dev/Gavark/CalculateurSommeilBebe/src/lib/wake-timer.ts`
- Modify: `d:/Dev/Gavark/CalculateurSommeilBebe/tests/wake-timer.test.ts`

- [ ] **Step 1: Add failing tests for `deriveTimerState`**

In `tests/wake-timer.test.ts`, extend the imports at the top:

```ts
import { nextEmptyNapSlot, inProgressNapSlot, deriveTimerState, type TimerInput } from '../src/lib/wake-timer';
```

Then append at the END of the file:

```ts
function mkInput(patch: Partial<TimerInput>): TimerInput {
  return {
    wakeTime: '',
    naps: [
      { start: '', end: '' },
      { start: '', end: '' },
      { start: '', end: '' },
      { start: '', end: '' }
    ],
    bedtime: '',
    awakeWindowMin: 165,
    ...patch
  };
}

function at(hhmm: string): Date {
  // Build a Date for today at the given local HH:MM (used for `now` in tests)
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

describe('deriveTimerState', () => {
  it('returns empty when wakeTime is missing and all naps are empty', () => {
    const state = deriveTimerState(mkInput({}), at('09:00'));
    expect(state.kind).toBe('empty');
  });

  it('returns awake from wakeTime when no nap finished yet', () => {
    const state = deriveTimerState(mkInput({ wakeTime: '07:00' }), at('09:00'));
    expect(state).toEqual({
      kind: 'awake',
      elapsedMin: 120,
      remainingMin: 45,
      nextNapAt: '09:45',
      overWindow: false
    });
  });

  it('returns awake from latest napEnd when a nap has finished', () => {
    const state = deriveTimerState(
      mkInput({
        wakeTime: '07:00',
        naps: [
          { start: '09:00', end: '10:00' },
          { start: '', end: '' },
          { start: '', end: '' },
          { start: '', end: '' }
        ]
      }),
      at('11:00')
    );
    expect(state).toMatchObject({ kind: 'awake', elapsedMin: 60, remainingMin: 105 });
  });

  it('uses the most recent napEnd when several naps finished', () => {
    const state = deriveTimerState(
      mkInput({
        wakeTime: '07:00',
        naps: [
          { start: '09:00', end: '10:00' },
          { start: '12:00', end: '13:00' },
          { start: '', end: '' },
          { start: '', end: '' }
        ]
      }),
      at('14:00')
    );
    expect(state).toMatchObject({ kind: 'awake', elapsedMin: 60 });
  });

  it('marks overWindow when elapsed exceeds awakeWindowMin', () => {
    const state = deriveTimerState(
      mkInput({ wakeTime: '07:00', awakeWindowMin: 120 }),
      at('10:00')
    );
    expect(state).toMatchObject({ kind: 'awake', elapsedMin: 180, remainingMin: -60, overWindow: true });
  });

  it('formats nextNapAt with leading zeros', () => {
    const state = deriveTimerState(mkInput({ wakeTime: '07:00' }), at('07:05'));
    expect((state as { kind: 'awake'; nextNapAt: string }).nextNapAt).toBe('09:45');
  });

  it('returns napping when nap1Start is filled and nap1End is empty', () => {
    const state = deriveTimerState(
      mkInput({
        wakeTime: '07:00',
        naps: [
          { start: '09:00', end: '' },
          { start: '', end: '' },
          { start: '', end: '' },
          { start: '', end: '' }
        ]
      }),
      at('09:30')
    );
    expect(state).toEqual({ kind: 'napping', napIdx: 0, elapsedMin: 30 });
  });

  it('returns napping with napIdx=2 when only nap3 is in progress', () => {
    const state = deriveTimerState(
      mkInput({
        wakeTime: '07:00',
        naps: [
          { start: '09:00', end: '10:00' },
          { start: '12:00', end: '13:00' },
          { start: '15:00', end: '' },
          { start: '', end: '' }
        ]
      }),
      at('15:45')
    );
    expect(state).toEqual({ kind: 'napping', napIdx: 2, elapsedMin: 45 });
  });

  it('returns bedtime even when a nap is technically in progress', () => {
    const state = deriveTimerState(
      mkInput({
        wakeTime: '07:00',
        naps: [{ start: '09:00', end: '' }, { start: '', end: '' }, { start: '', end: '' }, { start: '', end: '' }],
        bedtime: '19:30'
      }),
      at('19:31')
    );
    expect(state).toEqual({ kind: 'bedtime', bedtime: '19:30' });
  });

  it('returns empty when wakeTime is invalid HH:MM', () => {
    const state = deriveTimerState(mkInput({ wakeTime: 'bogus' }), at('09:00'));
    expect(state.kind).toBe('empty');
  });

  it('clamps napping elapsedMin to 0 when nap start is in the future', () => {
    const state = deriveTimerState(
      mkInput({
        wakeTime: '07:00',
        naps: [{ start: '14:00', end: '' }, { start: '', end: '' }, { start: '', end: '' }, { start: '', end: '' }]
      }),
      at('13:00')
    );
    expect(state).toEqual({ kind: 'napping', napIdx: 0, elapsedMin: 0 });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && npx vitest run tests/wake-timer.test.ts
```

Expected: 11 new tests FAIL because `deriveTimerState` is not exported yet. Existing 8 still pass.

- [ ] **Step 3: Implement `deriveTimerState` in `src/lib/wake-timer.ts`**

Append at the END of `src/lib/wake-timer.ts`:

```ts
/**
 * Convert a HH:MM string into a Date on the same calendar day as `now`,
 * with local hours/minutes set. Used for computing elapsed minutes against
 * `now`. Does NOT handle midnight rollover — the timer is used during the
 * day (06:00–22:00 typically).
 */
function hhmmOnSameDay(hhmm: string, now: Date): Date {
  const m = parseHHMM(hhmm); // minutes since midnight
  const d = new Date(now);
  d.setHours(Math.floor(m / 60), m % 60, 0, 0);
  return d;
}

function minutesBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / 60_000);
}

export function deriveTimerState(input: TimerInput, now: Date): TimerState {
  // 1. bedtime overrides everything else
  if (isValidHHMM(input.bedtime)) {
    return { kind: 'bedtime', bedtime: input.bedtime };
  }

  // 2. napping if a nap has a valid start without an end
  const inProgress = inProgressNapSlot(input.naps);
  if (inProgress !== null) {
    const startStr = input.naps[inProgress].start;
    const elapsed = minutesBetween(hhmmOnSameDay(startStr, now), now);
    return {
      kind: 'napping',
      napIdx: inProgress,
      elapsedMin: Math.max(0, elapsed)
    };
  }

  // 3. awake if wakeTime is valid
  if (!isValidHHMM(input.wakeTime)) {
    return { kind: 'empty' };
  }

  // origin = latest of wakeTime and all valid napEnd values
  const candidates: string[] = [input.wakeTime];
  for (const nap of input.naps) {
    if (isValidHHMM(nap.end)) candidates.push(nap.end);
  }
  const originStr = candidates.reduce((acc, cur) => (parseHHMM(cur) > parseHHMM(acc) ? cur : acc));
  const origin = hhmmOnSameDay(originStr, now);
  const elapsedMin = Math.max(0, minutesBetween(origin, now));
  const remainingMin = input.awakeWindowMin - elapsedMin;
  const overWindow = elapsedMin > input.awakeWindowMin;
  const nextNapAt = formatHHMM(parseHHMM(originStr) + input.awakeWindowMin);

  return { kind: 'awake', elapsedMin, remainingMin, nextNapAt, overWindow };
}
```

- [ ] **Step 4: Run tests to verify all pass**

Run:
```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && npx vitest run tests/wake-timer.test.ts
```

Expected: 19 tests pass (8 helpers + 11 `deriveTimerState`).

- [ ] **Step 5: Commit**

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && git add src/lib/wake-timer.ts tests/wake-timer.test.ts && git commit -m "$(cat <<'EOF'
feat(timer): add deriveTimerState pure function

State machine returns one of four states (empty / awake / napping /
bedtime) based on the form's current values + a reference time.
Priority: bedtime > napping > awake > empty. Elapsed durations clamp
to >= 0 so future-dated nap starts (data entry mistakes) don't render
as negative durations.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 1 — Component

### Task 3: `WakeTimer.svelte` — UI rendering

**Files:**
- Create: `d:/Dev/Gavark/CalculateurSommeilBebe/src/lib/components/WakeTimer.svelte`

This task renders the four states without any interactivity or auto-refresh (those come in Task 4).

- [ ] **Step 1: Create the component**

Create `d:/Dev/Gavark/CalculateurSommeilBebe/src/lib/components/WakeTimer.svelte`:

```svelte
<script lang="ts">
  import type { AgeParams } from '$lib/age-params';
  import { formatDuration } from '$lib/sleep-calc';
  import { deriveTimerState, type TimerInput } from '$lib/wake-timer';
  import Sun from 'phosphor-svelte/lib/Sun';
  import Cloud from 'phosphor-svelte/lib/Cloud';
  import Moon from 'phosphor-svelte/lib/Moon';
  import Warning from 'phosphor-svelte/lib/Warning';

  type Props = {
    wakeTime: string;
    naps: Array<{ start: string; end: string }>;
    bedtime: string;
    ageParams: AgeParams;
    effectiveTz: string;
    onNapStart: (slotIdx: number, hhmm: string) => void;
    onNapEnd: (slotIdx: number, hhmm: string) => void;
  };
  let { wakeTime, naps, bedtime, ageParams, effectiveTz: _effectiveTz, onNapStart: _onNapStart, onNapEnd: _onNapEnd }: Props = $props();

  // `now` will be wired to a setInterval in Task 4. For Task 3 we render against the current Date once.
  const now = new Date();

  const input: TimerInput = $derived({
    wakeTime,
    naps,
    bedtime,
    awakeWindowMin: ageParams.awakeWindowMin
  });

  const state = $derived(deriveTimerState(input, now));
</script>

<section class="wake-timer-card" aria-label="Timer fenêtre d'éveil">
  {#if state.kind === 'empty'}
    <p class="msg-empty">
      Saisis l'heure de réveil pour démarrer le suivi.
    </p>
  {:else if state.kind === 'awake'}
    <div class="row-label"><Sun size={18} weight="duotone" /> Éveillé depuis</div>
    <div class="counter primary">{formatDuration(state.elapsedMin)}</div>
    {#if state.overWindow}
      <div class="row-sub danger">
        <Warning size={14} weight="fill" /> Fenêtre dépassée de {formatDuration(state.elapsedMin - ageParams.awakeWindowMin)}
      </div>
    {:else}
      <div class="row-sub muted">
        Prochaine sieste dans {formatDuration(state.remainingMin)} (à {state.nextNapAt})
      </div>
    {/if}
  {:else if state.kind === 'napping'}
    <div class="row-label honey"><Cloud size={18} weight="duotone" /> En sieste depuis</div>
    <div class="counter honey">{formatDuration(state.elapsedMin)}</div>
    <div class="row-sub muted">Sieste {state.napIdx + 1}</div>
  {:else if state.kind === 'bedtime'}
    <div class="row-label night"><Moon size={18} weight="duotone" /> Couché à {state.bedtime} · bonne nuit 🌙</div>
  {/if}
</section>

<style>
  .wake-timer-card {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--c-bg-card);
    box-shadow: var(--shadow-md);
    border-radius: var(--r-lg);
    padding: var(--s-3) var(--s-4);
    margin-bottom: var(--s-3);
    display: grid;
    gap: var(--s-2);
    text-align: center;
  }
  .msg-empty {
    margin: 0;
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
  }
  .row-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-2);
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }
  .row-label.honey { color: var(--c-accent-honey); }
  .row-label.night { color: var(--c-cal-seg-night); font-size: var(--fs-md); }
  .counter {
    font-size: var(--fs-2xl);
    font-weight: 700;
    line-height: 1;
    font-feature-settings: "tnum" 1;
  }
  .counter.primary { color: var(--c-primary); }
  .counter.honey { color: var(--c-accent-honey); }
  .row-sub {
    font-size: var(--fs-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-1);
  }
  .row-sub.muted { color: var(--c-text-muted); }
  .row-sub.danger { color: var(--c-danger); font-weight: 600; }
</style>
```

(Note: the `effectiveTz`, `onNapStart`, `onNapEnd` props are unused in this task — they're prefixed with `_` to suppress the unused-warning. Task 4 will wire them up.)

- [ ] **Step 2: Run svelte-check to verify compilation**

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && npm run check 2>&1 | tail -5
```

Expected: 0 new errors. (Pre-existing 4 warnings in `today/+page.svelte` are unrelated.)

- [ ] **Step 3: Commit**

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && git add src/lib/components/WakeTimer.svelte && git commit -m "$(cat <<'EOF'
feat(timer): add WakeTimer component rendering 4 states

Sticky card that renders empty / awake / napping / bedtime states with
appropriate colors (primary terracotta, honey, night violet, muted).
Auto-refresh and quick actions land in the next commit.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: WakeTimer — auto-refresh, quick actions, toast

**Files:**
- Modify: `d:/Dev/Gavark/CalculateurSommeilBebe/src/lib/components/WakeTimer.svelte`

This task adds the `setInterval` refresh, the two quick-action buttons, and the toast feedback.

- [ ] **Step 1: Replace the script block to wire up state + actions**

Open `src/lib/components/WakeTimer.svelte`. Replace the existing `<script lang="ts">…</script>` block with:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import type { AgeParams } from '$lib/age-params';
  import { formatDuration } from '$lib/sleep-calc';
  import { deriveTimerState, nextEmptyNapSlot, inProgressNapSlot, type TimerInput } from '$lib/wake-timer';
  import Sun from 'phosphor-svelte/lib/Sun';
  import Cloud from 'phosphor-svelte/lib/Cloud';
  import Moon from 'phosphor-svelte/lib/Moon';
  import Warning from 'phosphor-svelte/lib/Warning';
  import Play from 'phosphor-svelte/lib/Play';
  import Check from 'phosphor-svelte/lib/Check';

  type Props = {
    wakeTime: string;
    naps: Array<{ start: string; end: string }>;
    bedtime: string;
    ageParams: AgeParams;
    effectiveTz: string;
    onNapStart: (slotIdx: number, hhmm: string) => void;
    onNapEnd: (slotIdx: number, hhmm: string) => void;
  };
  let { wakeTime, naps, bedtime, ageParams, effectiveTz, onNapStart, onNapEnd }: Props = $props();

  let now = $state(new Date());

  onMount(() => {
    const id = setInterval(() => { now = new Date(); }, 30_000);
    return () => clearInterval(id);
  });

  const input: TimerInput = $derived({
    wakeTime,
    naps,
    bedtime,
    awakeWindowMin: ageParams.awakeWindowMin
  });

  const state = $derived(deriveTimerState(input, now));
  const emptySlot = $derived(nextEmptyNapSlot(naps));
  const progressSlot = $derived(inProgressNapSlot(naps));

  let submitting = $state(false);
  let toastMessage = $state('');
  let toastVisible = $state(false);

  function formatNowHHMM(tz: string): string {
    const fmt = new Intl.DateTimeFormat('fr-FR', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false
    });
    // fr-FR formats as "14:30" already
    return fmt.format(new Date());
  }

  function showToast(message: string) {
    toastMessage = message;
    toastVisible = true;
    setTimeout(() => { toastVisible = false; }, 3000);
  }

  function handleStart() {
    if (submitting) return;
    if (emptySlot === null) return;
    submitting = true;
    const hhmm = formatNowHHMM(effectiveTz);
    onNapStart(emptySlot, hhmm);
    showToast(`Sieste ${emptySlot + 1} démarrée à ${hhmm}`);
    setTimeout(() => { submitting = false; }, 2000);
  }

  function handleEnd() {
    if (submitting) return;
    if (progressSlot === null) return;
    submitting = true;
    const hhmm = formatNowHHMM(effectiveTz);
    onNapEnd(progressSlot, hhmm);
    showToast(`Sieste ${progressSlot + 1} terminée à ${hhmm}`);
    setTimeout(() => { submitting = false; }, 2000);
  }
</script>
```

- [ ] **Step 2: Replace the template to add the action buttons and toast**

In the same `WakeTimer.svelte` file, replace the existing `<section class="wake-timer-card" …>…</section>` template block with:

```svelte
<section class="wake-timer-card" aria-label="Timer fenêtre d'éveil">
  {#if state.kind === 'empty'}
    <p class="msg-empty">
      Saisis l'heure de réveil pour démarrer le suivi.
    </p>
  {:else if state.kind === 'awake'}
    <div class="row-label"><Sun size={18} weight="duotone" /> Éveillé depuis</div>
    <div class="counter primary">{formatDuration(state.elapsedMin)}</div>
    {#if state.overWindow}
      <div class="row-sub danger">
        <Warning size={14} weight="fill" /> Fenêtre dépassée de {formatDuration(state.elapsedMin - ageParams.awakeWindowMin)}
      </div>
    {:else}
      <div class="row-sub muted">
        Prochaine sieste dans {formatDuration(state.remainingMin)} (à {state.nextNapAt})
      </div>
    {/if}
    <button
      type="button"
      class="btn btn-secondary action-btn"
      onclick={handleStart}
      disabled={submitting || emptySlot === null}
      title={emptySlot === null ? '4 siestes déjà saisies aujourd\'hui' : 'Démarrer une sieste maintenant'}
    >
      <Play size={16} weight="fill" /> Démarrer sieste maintenant
    </button>
  {:else if state.kind === 'napping'}
    <div class="row-label honey"><Cloud size={18} weight="duotone" /> En sieste depuis</div>
    <div class="counter honey">{formatDuration(state.elapsedMin)}</div>
    <div class="row-sub muted">Sieste {state.napIdx + 1}</div>
    <button
      type="button"
      class="btn btn-secondary action-btn"
      onclick={handleEnd}
      disabled={submitting}
    >
      <Check size={16} weight="bold" /> Terminer sieste maintenant
    </button>
  {:else if state.kind === 'bedtime'}
    <div class="row-label night"><Moon size={18} weight="duotone" /> Couché à {state.bedtime} · bonne nuit 🌙</div>
  {/if}

  {#if toastVisible}
    <div class="toast" role="status" aria-live="polite">{toastMessage}</div>
  {/if}
</section>
```

- [ ] **Step 3: Add the CSS for buttons and toast**

In the same file, replace the existing `<style>…</style>` block with:

```svelte
<style>
  .wake-timer-card {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--c-bg-card);
    box-shadow: var(--shadow-md);
    border-radius: var(--r-lg);
    padding: var(--s-3) var(--s-4);
    margin-bottom: var(--s-3);
    display: grid;
    gap: var(--s-2);
    text-align: center;
  }
  .msg-empty {
    margin: 0;
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
  }
  .row-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-2);
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }
  .row-label.honey { color: var(--c-accent-honey); }
  .row-label.night { color: var(--c-cal-seg-night); font-size: var(--fs-md); }
  .counter {
    font-size: var(--fs-2xl);
    font-weight: 700;
    line-height: 1;
    font-feature-settings: "tnum" 1;
  }
  .counter.primary { color: var(--c-primary); }
  .counter.honey { color: var(--c-accent-honey); }
  .row-sub {
    font-size: var(--fs-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-1);
  }
  .row-sub.muted { color: var(--c-text-muted); }
  .row-sub.danger { color: var(--c-danger); font-weight: 600; }
  .action-btn {
    margin-top: var(--s-2);
    justify-self: center;
    display: inline-flex;
    align-items: center;
    gap: var(--s-1);
  }
  .toast {
    margin-top: var(--s-2);
    padding: var(--s-2) var(--s-3);
    background: var(--c-bg-soft);
    color: var(--c-text);
    border-radius: var(--r-sm);
    font-size: var(--fs-sm);
  }
  @media (prefers-reduced-motion: reduce) {
    .wake-timer-card { transition: none; }
  }
</style>
```

- [ ] **Step 4: Run svelte-check to verify compilation**

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && npm run check 2>&1 | tail -5
```

Expected: 0 new errors.

- [ ] **Step 5: Commit**

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && git add src/lib/components/WakeTimer.svelte && git commit -m "$(cat <<'EOF'
feat(timer): add auto-refresh, quick actions, toast feedback

setInterval at 30s ticks now → $derived recomputes the timer state.
"Démarrer sieste" / "Terminer sieste" buttons compute current HH:MM in
the effective timezone, fire onNapStart / onNapEnd callbacks (parent
mutates the form $state and submits), and display a 3-second toast.
Buttons disabled during submission (2-second self-clear) to prevent
double-tap.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Page integration

### Task 5: Embed WakeTimer in the Today page

**Files:**
- Modify: `d:/Dev/Gavark/CalculateurSommeilBebe/src/routes/app/babies/[id]/today/+page.svelte`

- [ ] **Step 1: Add the WakeTimer import**

Open `src/routes/app/babies/[id]/today/+page.svelte`. After the existing imports (around the existing `import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk';` line), add:

```ts
  import WakeTimer from '$lib/components/WakeTimer.svelte';
```

- [ ] **Step 2: Add a normalized naps derived, the form ref, and the callback handlers**

The page already has a `napsArr` `$derived` of type `NapPair[]`. However, `NapPair` in `src/lib/sleep-calc.ts` is `{ start?: string | null; end?: string | null }` — fields are nullable. The WakeTimer expects strict `Array<{ start: string; end: string }>`. So we add a thin normalize step that coerces null/undefined to empty strings.

Locate the function `function read(e: Event)` near the end of the `<script>` (around line 130). Right before it, add a normalized naps derived, a `formEl` declaration, and the handler functions:

```ts
  // Strict-shape naps for WakeTimer (which expects non-null strings).
  const wakeTimerNaps = $derived([
    { start: nap1Start ?? '', end: nap1End ?? '' },
    { start: nap2Start ?? '', end: nap2End ?? '' },
    { start: nap3Start ?? '', end: nap3End ?? '' },
    { start: nap4Start ?? '', end: nap4End ?? '' }
  ]);

  let formEl = $state<HTMLFormElement | null>(null);

  function setNapStart(slotIdx: number, hhmm: string) {
    if (slotIdx === 0) nap1Start = hhmm;
    else if (slotIdx === 1) nap2Start = hhmm;
    else if (slotIdx === 2) nap3Start = hhmm;
    else if (slotIdx === 3) nap4Start = hhmm;
  }
  function setNapEnd(slotIdx: number, hhmm: string) {
    if (slotIdx === 0) nap1End = hhmm;
    else if (slotIdx === 1) nap2End = hhmm;
    else if (slotIdx === 2) nap3End = hhmm;
    else if (slotIdx === 3) nap4End = hhmm;
  }
  function handleNapStart(slotIdx: number, hhmm: string) {
    setNapStart(slotIdx, hhmm);
    // Defer submit by one microtask so Svelte applies the $state mutation first.
    setTimeout(() => formEl?.requestSubmit(), 0);
  }
  function handleNapEnd(slotIdx: number, hhmm: string) {
    setNapEnd(slotIdx, hhmm);
    setTimeout(() => formEl?.requestSubmit(), 0);
  }
```

- [ ] **Step 3: Insert the WakeTimer component before the form**

In the template section, find the existing line:

```svelte
<p class="tz-info"><Globe size={12} /> Fuseau actif : <strong>{data.effectiveTz}</strong></p>
```

Right after that (and before `{#if form?.error}` / the `<form>`), insert:

```svelte
<WakeTimer
  {wake}
  naps={napsArr}
  {bedtime}
  ageParams={data.ageParams}
  effectiveTz={data.effectiveTz}
  onNapStart={handleNapStart}
  onNapEnd={handleNapEnd}
/>
```

Note: SvelteKit uses `wakeTime` as the prop name on WakeTimer, but the local `$state` here is named `wake`. Adjust the binding accordingly. Replace the shorthand `{wake}` with the explicit form:

```svelte
<WakeTimer
  wakeTime={wake}
  naps={wakeTimerNaps}
  {bedtime}
  ageParams={data.ageParams}
  effectiveTz={data.effectiveTz}
  onNapStart={handleNapStart}
  onNapEnd={handleNapEnd}
/>
```

- [ ] **Step 4: Add `bind:this={formEl}` to the form tag**

Locate the existing form opening tag:

```svelte
<form
  method="POST"
  action="?/save"
  use:enhance={() => {
    dbg('form submit start');
    return async ({ update, result }) => {
      dbg('form action result:', result.type, result.type === 'failure' ? result.data : '');
      await update({ reset: false });
      dbg('form action update() done');
    };
  }}
  autocomplete="off"
  class="today-form"
>
```

Add `bind:this={formEl}` as an attribute (anywhere in the open tag, e.g. right after `class="today-form"`):

```svelte
<form
  bind:this={formEl}
  method="POST"
  action="?/save"
  use:enhance={() => {
    dbg('form submit start');
    return async ({ update, result }) => {
      dbg('form action result:', result.type, result.type === 'failure' ? result.data : '');
      await update({ reset: false });
      dbg('form action update() done');
    };
  }}
  autocomplete="off"
  class="today-form"
>
```

- [ ] **Step 5: Run svelte-check and full test suite**

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && npm run check 2>&1 | tail -5
```

Expected: 0 new errors. Pre-existing 4 warnings remain.

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && npx vitest run 2>&1 | tail -10
```

Expected: all tests pass (the wake-timer test count adds 19 to the previous total).

- [ ] **Step 6: Smoke-test dev server**

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && npm run dev
```

Boot the dev server briefly to confirm the page compiles without runtime errors. Then Ctrl+C to stop.

- [ ] **Step 7: Commit**

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && git add src/routes/app/babies/\[id\]/today/+page.svelte && git commit -m "$(cat <<'EOF'
feat(timer): embed WakeTimer on the Today page

WakeTimer card sits between the meta-info row and the form, observes
the form's $state values via props, and triggers handleNapStart /
handleNapEnd callbacks which mutate the corresponding nap $state and
auto-submit via formEl.requestSubmit().

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Verification

### Task 6: QA acceptance pass

**Files:** None (verification only)

- [ ] **Step 1: Run the full test suite**

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && npx vitest run 2>&1 | tail -10
```

Expected: all tests pass (≥ 172 tests = 153 prior + 19 new wake-timer tests). Report the exact count.

- [ ] **Step 2: Run svelte-check**

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && npm run check 2>&1 | tail -5
```

Expected: 0 errors. The 4 pre-existing warnings in `today/+page.svelte` are acceptable.

- [ ] **Step 3: Run a production build**

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && npm run build 2>&1 | tail -10
```

Expected: build completes successfully (`✓ built in …`, `adapter-node ✔ done`). Report any error lines.

- [ ] **Step 4: Code-level acceptance check**

Read the relevant files and confirm each criterion is implemented (no need to run a browser):

a. WakeTimer is imported and rendered in `src/routes/app/babies/[id]/today/+page.svelte`:
   ```bash
   grep -n 'WakeTimer' src/routes/app/babies/\[id\]/today/+page.svelte
   ```
   Expected: import line + component usage line.

b. `bind:this={formEl}` is present on the form:
   ```bash
   grep -n 'bind:this={formEl}' src/routes/app/babies/\[id\]/today/+page.svelte
   ```
   Expected: 1 match.

c. The handler functions exist:
   ```bash
   grep -n 'handleNapStart\|handleNapEnd' src/routes/app/babies/\[id\]/today/+page.svelte
   ```
   Expected: 2+ matches each (definition + prop pass).

d. `WakeTimer.svelte` uses `setInterval(... 30_000)`:
   ```bash
   grep -n '30_000' src/lib/components/WakeTimer.svelte
   ```
   Expected: 1 match in `onMount`.

e. `wake-timer.ts` has no `$lib/server/*` imports:
   ```bash
   grep -n '\$lib/server' src/lib/wake-timer.ts
   ```
   Expected: 0 matches.

f. The 4 states are rendered (look for the `state.kind === ` branches in the template):
   ```bash
   grep -n "state.kind ===" src/lib/components/WakeTimer.svelte
   ```
   Expected: 4 matches (empty, awake, napping, bedtime).

g. The toast uses `role="status" aria-live="polite"`:
   ```bash
   grep -n 'role="status"' src/lib/components/WakeTimer.svelte
   ```
   Expected: 1 match.

- [ ] **Step 5: Git log audit**

```bash
cd d:/Dev/Gavark/CalculateurSommeilBebe && git log --oneline 354f96c..HEAD
```

(`354f96c` is the spec commit; `HEAD` is the current state.) Expected: 5 implementation commits (Tasks 1-5). All should be `feat(timer)`.

- [ ] **Step 6: Final report**

Provide:
- ✅ / ❌ for each verification step
- Total test count
- Production build outcome
- Total commits since spec commit
- One-line GO / NO-GO recommendation for deployment

If any check fails, report NO-GO with details.

---

## Self-review checklist (controller, not executed)

Confirmed before delivering the plan:

- **Spec coverage**: Sections 1-8 of the spec map to tasks
  - State machine (spec §3) → Task 2 (`deriveTimerState` + tests for each state)
  - Placement and visual (spec §4) → Tasks 3 (markup + CSS) and 5 (page integration)
  - Quick actions (spec §5) → Task 4 (buttons + handlers + toast)
  - Architecture (spec §6) → Tasks 1-5 collectively
  - Acceptance criteria (spec §7) → Task 6
  - Out-of-scope (spec §8) → explicitly excluded
- **Placeholder scan**: No "TBD", no "etc.", no "similar to". All code shown in full. No "add appropriate error handling" — error handling is explicit (e.g., `Math.max(0, ...)` clamps for invalid times).
- **Type consistency**: `TimerInput`, `TimerState`, `nextEmptyNapSlot`, `inProgressNapSlot`, `deriveTimerState`, `handleNapStart`, `handleNapEnd` all referenced consistently between definition and consumer code.
- **`napsArr` reuse**: NapPair in `sleep-calc.ts` is `{ start?: string | null; end?: string | null }` (nullable), but WakeTimer expects strict `{ start: string; end: string }`. Task 5 adds a thin `wakeTimerNaps` derived that coerces null/undefined to `''`. Avoids both a type error and a pollution of the pure module's API.
- **Auto-submit timing**: explicit `setTimeout(..., 0)` to let Svelte apply the `$state` mutation before `requestSubmit()`. Avoids submitting the old value.
