<script lang="ts">
  import { applyAction, deserialize, type ActionResult } from '$app/forms';
  import { beforeNavigate, refreshAll } from '$app/navigation';
  import { onMount, untrack } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import { computeDaySleepBudget, formatDuration } from '$lib/sleep-calc';
  import { COMMON_TIMEZONES, todayISOInTZ } from '$lib/tz';
  import { formatAgeBracket, formatLongDay } from '$lib/format';
  import {
    FIELD_NAMES,
    PAUSE_FIELDS,
    buildSaveBody,
    fieldsFromEntry,
    mergeServer,
    napPairs,
    readPauseInput,
    restoreEmptied,
    visibleNapCount,
    type DayFields
  } from '$lib/day-form';
  import { buildTimeline, type TimelineRow as Row } from '$lib/timeline';
  import { createAutosave, type SaveState } from '$lib/autosave';
  import WakeTimer from '$lib/components/WakeTimer.svelte';
  import TimelineRow from '$lib/components/timeline/TimelineRow.svelte';
  import ClearableInput from '$lib/components/timeline/ClearableInput.svelte';
  import BudgetRing from '$lib/components/timeline/BudgetRing.svelte';
  import EnablePushButton from '$lib/components/EnablePushButton.svelte';
  import * as m from '$paraglide/messages';
  import type { PageData } from './$types';

  type Entry = PageData['entry'];
  type Props = Pick<PageData, 'baby' | 'entry' | 'ageMonths' | 'ageParams' | 'effectiveTz' | 'locale'> & {
    /** The day shown, `YYYY-MM-DD`. */
    date: string;
  };

  let { baby, date, entry, ageMonths, ageParams, effectiveTz, locale }: Props = $props();

  // Captured once, on purpose: the parent keys this component on baby + date,
  // so every save, even one that finishes or chains after leaving the page,
  // goes to this baby and this day. Nothing in the save path reads live props.
  // svelte-ignore state_referenced_locally
  const babyId = baby.id;
  // svelte-ignore state_referenced_locally
  const saveDate = date;
  const saveUrl = `/app/babies/${babyId}/today?/save`;
  const entryUrl = `/api/babies/${babyId}/entries/${saveDate}`;

  let pushHighlighted = $state(false);

  onMount(() => {
    if (!('serviceWorker' in navigator)) return;
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'wake-window-exceeded' && event.data.payload?.babyId === babyId) {
        pushHighlighted = true;
        setTimeout(() => { pushHighlighted = false; }, 8000);
      }
    };
    navigator.serviceWorker.addEventListener('message', handler);
    return () => navigator.serviceWorker.removeEventListener('message', handler);
  });

  const MAX_NAPS = 8;

  /** Last entry the server sent (load, save result or foreground fetch). */
  let serverEntry: Entry = untrack(() => entry);
  let fields = $state<DayFields>(fieldsFromEntry(serverEntry));
  let napCount = $state(untrack(() => visibleNapCount(fields, ageParams.naps)));
  /** Fields emptied with ✕: posted with a `clear` so the server nulls them. */
  const clears = new SvelteSet<string>();
  /** Open row key: 'wake', 'nap1'…'nap8', 'bedtime', 'notes', 'tz'. */
  let openRow = $state<string | null>(null);
  let saveState = $state<SaveState>('idle');
  /** Set by a failed save, cleared only by a successful one: drives the banner. */
  let saveFailed = $state(false);
  /** Validation message from the server's last `failure`, cleared by a success. */
  let serverError = $state<string | null>(null);
  /** Name of the form field holding focus: never overwritten by server data. */
  let focused = $state<string | null>(null);
  let formEl: HTMLFormElement | undefined = $state();

  /** False once the page is gone: a save still in flight then skips all UI work. */
  let mounted = false;
  /** Bumped by each successful save: a foreground fetch started before it is stale. */
  let savesDone = 0;

  /**
   * Takes a fresh entry from the server: its values replace the screen's,
   * except for fields still waiting to be sent or being edited.
   */
  function applyServerEntry(next: Entry) {
    serverEntry = next;
    const keep = new Set([...autosave.dirty(), ...(focused ? [focused] : [])]);
    fields = mergeServer(fields, fieldsFromEntry(serverEntry), keep);
    napCount = Math.max(napCount, visibleNapCount(fields, ageParams.naps));
  }

  /**
   * Posts the requested fields straight to the `save` action, without the
   * <form>, so a save started while leaving the page still goes out.
   * Resolves as soon as the POST's result is handled. Never rejects.
   */
  async function save(names: string[]): Promise<boolean> {
    const clearedSent = names.filter((name) => clears.has(name));
    const body = buildSaveBody(fields, names, clears, saveDate);
    let result: ActionResult;
    try {
      const response = await fetch(saveUrl, {
        method: 'POST',
        headers: { accept: 'application/json', 'x-sveltekit-action': 'true' },
        body,
        cache: 'no-store',
        keepalive: true
      });
      result = deserialize(await response.text());
    } catch {
      // Network down, aborted, or not an action result (e.g. a proxy page).
      saveFailed = true;
      serverError = null;
      return false;
    }

    if (result.type !== 'success') {
      saveFailed = true;
      // The server's validation message, shown in the banner. Not through
      // `applyAction`: that would move focus away from the field being edited.
      const message = result.type === 'failure' ? result.data?.error : null;
      serverError = typeof message === 'string' ? message : null;
      // An expired session redirects: follow it, without holding the save
      // lock. An `error` result would swap the page for the error page: keep
      // the values on screen instead.
      if (mounted && result.type === 'redirect') applyAction(result).catch(() => {});
      return false;
    }

    // Success. No `applyAction` here: it resets focus.
    for (const name of clearedSent) clears.delete(name);
    saveFailed = false;
    serverError = null;
    savesDone++;
    const next = result.data?.entry as Entry | undefined;
    if (mounted && next !== undefined) {
      applyServerEntry(next);
      // A field emptied with the keyboard kept its server value: show it
      // again, unless it was cleared with ✕ or is being edited.
      const keepEmpty = new Set([...clearedSent, ...clears, ...(focused ? [focused] : [])]);
      fields = restoreEmptied(fields, fieldsFromEntry(serverEntry), names, keepEmpty);
    }
    return true;
  }

  const autosave = createAutosave({
    delayMs: 600,
    onState: (s) => {
      saveState = s;
      if (s === 'error') saveFailed = true;
    },
    save
  });

  /**
   * Fetches this day's entry to show what the other phone wrote. Any failure
   * (offline, expired session, server down) leaves the screen as it is.
   */
  async function fetchServerEntry() {
    const savesAtStart = savesDone;
    try {
      const response = await fetch(entryUrl, { headers: { accept: 'application/json' }, cache: 'no-store' });
      if (!response.ok) return;
      const body: unknown = await response.json();
      if (!body || typeof body !== 'object' || !('entry' in body)) return;
      // A save that landed meanwhile already brought a newer entry.
      if (!mounted || savesDone !== savesAtStart) return;
      applyServerEntry(body.entry as Entry);
    } catch {
      // Keep the screen as it is.
    }
  }

  /** New day the page last tried to move to, so a clock the server disagrees with cannot reload in a loop. */
  let rolloverTriedFor: string | null = null;

  /**
   * The page was left open past midnight: move to the new day, so a morning
   * entry is not written to yesterday. Reloading goes through SvelteKit, whose
   * fallback when the server is unreachable is a full page reload that would
   * drop unsent edits; so reload only once the server has just answered.
   * Edits pending for yesterday were flushed before and still go to yesterday.
   */
  async function rollOverIfNewDay(): Promise<boolean> {
    const today = todayISOInTZ(effectiveTz);
    if (today === saveDate || rolloverTriedFor === today) return false;
    try {
      const response = await fetch(entryUrl, { headers: { accept: 'application/json' }, cache: 'no-store' });
      if (!response.ok || !mounted) return true;
      rolloverTriedFor = today;
      await refreshAll();
    } catch {
      // Offline: stay on this day and try again on the next return.
    }
    return true;
  }

  /** Back to the foreground or back online: retry what failed, then catch up. */
  async function onReturn() {
    autosave.flush();
    if (await rollOverIfNewDay()) return;
    void fetchServerEntry();
  }

  /**
   * Sends everything before the page goes away. A value typed in the focused
   * field has had no `change` event yet: take it first.
   */
  function onLeave() {
    const el = document.activeElement;
    if (
      formEl &&
      (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) &&
      formEl.contains(el) &&
      FIELD_NAMES.includes(el.name) &&
      el.value !== fields[el.name]
    ) {
      inputField(el.name, el.value);
    }
    autosave.flush();
  }

  function onSubmit(e: SubmitEvent) {
    // Enter pressed in a field: send only what changed, never the whole form.
    // A macrotask, so the flush runs after the browser's submit handling.
    e.preventDefault();
    setTimeout(() => autosave.flush(), 0);
  }

  beforeNavigate(onLeave);

  onMount(() => {
    mounted = true;
    const onVisibility = () => {
      if (document.visibilityState === 'visible') onReturn();
      else onLeave();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onLeave);
    window.addEventListener('online', onReturn);
    // A page kept on screen past midnight (tablet, desktop) never "returns".
    const dayCheck = setInterval(() => {
      if (document.visibilityState === 'visible') void rollOverIfNewDay();
    }, 60_000);
    return () => {
      clearInterval(dayCheck);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onLeave);
      window.removeEventListener('online', onReturn);
      onLeave();
      autosave.dispose();
      mounted = false;
    };
  });

  function setField(name: string, value: string) {
    fields[name] = value;
    clears.delete(name);
    autosave.touch(name);
    napCount = Math.max(napCount, visibleNapCount(fields, ageParams.naps));
  }

  function clearField(name: string) {
    fields[name] = '';
    clears.add(name);
    autosave.touch(name);
    autosave.flush();
  }

  /** A value typed in field `name`. A pause that is not a positive integer clears it, like ✕. */
  function inputField(name: string, value: string) {
    if (!PAUSE_FIELDS.includes(name)) {
      setField(name, value);
      return;
    }
    const pause = readPauseInput(value);
    if (pause.clear) clearField(name);
    else setField(name, pause.value);
  }

  function onNapStart(slotIdx: number, hhmm: string) {
    setField(`nap${slotIdx + 1}_start`, hhmm);
    autosave.flush();
  }
  function onNapEnd(slotIdx: number, hhmm: string) {
    setField(`nap${slotIdx + 1}_end`, hhmm);
    autosave.flush();
  }
  function onAddPause(slotIdx: number, deltaMin: number) {
    const name = `nap${slotIdx + 1}_pause_min`;
    setField(name, String((Number(fields[name]) || 0) + deltaMin));
    autosave.flush();
  }

  /** Opens `key` (or closes it if already open); closing a row sends what waited. */
  function toggleRow(key: string) {
    const closing = openRow !== null;
    openRow = openRow === key ? null : key;
    if (closing) autosave.flush();
  }
  function saveRow() {
    openRow = null;
    autosave.flush();
  }
  function addNap() {
    napCount = Math.min(MAX_NAPS, napCount + 1);
    const closing = openRow !== null;
    openRow = `nap${napCount}`;
    if (closing) autosave.flush();
  }

  function onFocusIn(e: FocusEvent) {
    focused = (e.target as HTMLElement).getAttribute('name');
  }
  function onFocusOut() {
    focused = null;
  }

  const pairs = $derived(napPairs(fields));
  const budget = $derived(computeDaySleepBudget(pairs, ageParams));
  const timeline = $derived(
    buildTimeline({
      fields,
      napCount,
      ageParams,
      desiredWakeTime: baby.desiredWakeTime ?? null
    })
  );

  function rowKey(row: Row): string {
    return row.kind === 'nap' ? `nap${row.n}` : row.kind;
  }
  // The "now" card is a keyed item among the rows so that moving it (a nap
  // starts or ends) keeps the same WakeTimer instance and its double-tap guard.
  const items = $derived.by(() => {
    const list: Array<{ key: string; row: Row | null }> = timeline.rows.map((row) => ({ key: rowKey(row), row }));
    list.splice(timeline.nowAfter + 1, 0, { key: 'now', row: null });
    return list;
  });
</script>

<header class="day-head">
  <div>
    <h1>{formatLongDay(date, locale)}</h1>
    <p class="page-meta">
      <strong>{m.today_page_meta_months({ months: ageMonths })}</strong> {m.today_page_meta_label({ label: formatAgeBracket(ageParams) })} ·
      {m.today_page_meta_naps({ count: ageParams.naps })} · {m.today_page_meta_window({ window: ageParams.awakeWindowMin })} · {m.today_page_meta_night({ night: ageParams.nightSleepH })}
    </p>
  </div>
  <BudgetRing completedMin={budget.completedMin} totalMin={budget.totalMin} remainingMin={budget.remainingMin} />
</header>
{#if budget.ratio > 1}
  <p class="budget-warn">{m.today_day_budget_exceeded({ amount: formatDuration(budget.completedMin - budget.totalMin) })}</p>
{/if}

{#if saveFailed || serverError}
  <p class="error save-banner" role="alert">
    <span>{serverError ?? m.today_entry_save_failed()}</span>
    <button type="button" class="btn btn-secondary btn-sm" onclick={() => autosave.flush()}>{m.today_save_retry()}</button>
  </p>
{/if}

<form
  bind:this={formEl}
  novalidate
  autocomplete="off"
  class="today-form"
  onsubmit={onSubmit}
  onfocusin={onFocusIn}
  onfocusout={onFocusOut}
>

  <div class="timeline">
    {#each items as item (item.key)}
      {#if item.row === null}
        <div class="now">
          <WakeTimer
            wakeTime={fields.wake_time}
            naps={pairs}
            bedtime={fields.bedtime}
            ageParams={ageParams}
            effectiveTz={effectiveTz}
            locale={locale}
            {onNapStart}
            {onNapEnd}
            {onAddPause}
          />
        </div>
      {:else if item.row.kind === 'wake'}
        {@const wake = item.row}
        <TimelineRow state={wake.state} open={openRow === item.key} ontoggle={() => toggleRow(item.key)} {saveState} onsave={saveRow}>
          {#snippet label()}{m.today_wake_label()}{/snippet}
          {#snippet value()}{wake.time || m.today_value_empty()}{/snippet}
          <ClearableInput
            name="wake_time"
            type="time"
            label={m.today_wake_label()}
            value={fields.wake_time}
            onchange={(v) => setField('wake_time', v)}
            onclear={() => clearField('wake_time')}
          />
        </TimelineRow>
      {:else if item.row.kind === 'nap'}
        {@const nap = item.row}
        <TimelineRow state={nap.state} open={openRow === item.key} ontoggle={() => toggleRow(item.key)} {saveState} onsave={saveRow}>
          {#snippet label()}
            {m.today_nap_label_n({ n: nap.n })}{#if nap.state === 'done' && nap.durationMin !== null}{' · '}{formatDuration(nap.durationMin)}{/if}
          {/snippet}
          {#snippet value()}
            {#if nap.state === 'done'}
              {m.today_row_range({ start: nap.start, end: nap.end })}
            {:else if nap.state === 'progress'}
              {m.today_row_nap_progress({ start: nap.start })}
            {:else if nap.suggestedStart}
              {m.today_row_upcoming_at({ time: nap.suggestedStart })}
            {/if}
          {/snippet}
          <p class="hint">{m.today_nap_suggested_at()} <strong>{nap.suggestedStart || m.today_value_empty()}</strong></p>
          <div class="nap-fields">
            <ClearableInput
              name="nap{nap.n}_start"
              type="time"
              label={m.today_nap_start_label()}
              value={fields[`nap${nap.n}_start`]}
              onchange={(v) => setField(`nap${nap.n}_start`, v)}
              onclear={() => clearField(`nap${nap.n}_start`)}
            />
            <ClearableInput
              name="nap{nap.n}_end"
              type="time"
              label={m.today_nap_end_label()}
              value={fields[`nap${nap.n}_end`]}
              onchange={(v) => setField(`nap${nap.n}_end`, v)}
              onclear={() => clearField(`nap${nap.n}_end`)}
            />
            <ClearableInput
              name="nap{nap.n}_pause_min"
              type="number"
              label={m.today_nap_pause_label()}
              value={fields[`nap${nap.n}_pause_min`]}
              onchange={(v) => inputField(`nap${nap.n}_pause_min`, v)}
              onclear={() => clearField(`nap${nap.n}_pause_min`)}
            />
          </div>
          {#if nap.state === 'progress' && nap.suggestedEnd}
            <p class="hint">{m.today_nap_end_suggested_at()} <strong>{nap.suggestedEnd}</strong></p>
          {/if}
        </TimelineRow>
      {:else}
        {@const bed = item.row}
        <TimelineRow state={bed.state} tone="night" open={openRow === item.key} ontoggle={() => toggleRow(item.key)} {saveState} onsave={saveRow}>
          {#snippet label()}
            {m.today_bedtime_row_label()}{#if bed.ideal}{' · '}{m.today_bedtime_ideal_short({ time: bed.ideal })}{/if}
          {/snippet}
          {#snippet value()}
            {#if bed.time}
              {bed.time}
            {:else if bed.suggested}
              {m.today_row_upcoming_at({ time: bed.suggested })}
            {/if}
          {/snippet}
          <ClearableInput
            name="bedtime"
            type="time"
            label={m.today_bedtime_label()}
            value={fields.bedtime}
            onchange={(v) => setField('bedtime', v)}
            onclear={() => clearField('bedtime')}
          />
          <div class="reminder">
            <div class="reminder-meta">
              <span class="reminder-label">{m.today_suggested_bedtime_label()}</span>
              <span class="reminder-sub">{m.today_suggested_bedtime_sub()}</span>
            </div>
            <span class="reminder-value">{bed.suggested || m.today_value_empty()}</span>
          </div>
          <div class="reminder">
            <div class="reminder-meta">
              <span class="reminder-label">{m.today_ideal_bedtime_label()}</span>
              <span class="reminder-sub">{m.today_ideal_bedtime_sub({ time: baby.desiredWakeTime ?? m.today_value_empty() })}</span>
            </div>
            <span class="reminder-value">{bed.ideal || m.today_value_empty()}</span>
          </div>
        </TimelineRow>
      {/if}
    {/each}

    {#if napCount < MAX_NAPS}
      <button type="button" class="btn btn-ghost btn-sm add-nap" onclick={addNap}>+ {m.today_add_nap()}</button>
    {/if}
  </div>

  <div class="extras">
    <TimelineRow
      state={fields.notes ? 'done' : 'upcoming'}
      open={openRow === 'notes'}
      ontoggle={() => toggleRow('notes')}
      {saveState}
      onsave={saveRow}
    >
      {#snippet label()}
        {#if fields.notes}<span class="note-preview">{fields.notes}</span>{:else}{m.today_note_add()}{/if}
      {/snippet}
      {#snippet value()}{/snippet}
      <label class="field">
        <span class="field-label">{m.today_notes_label()}</span>
        <textarea
          class="field-textarea"
          name="notes"
          autocomplete="off"
          rows="2"
          value={fields.notes}
          onchange={(e) => inputField('notes', e.currentTarget.value)}
        ></textarea>
      </label>
    </TimelineRow>

    <TimelineRow state="done" open={openRow === 'tz'} ontoggle={() => toggleRow('tz')} {saveState} onsave={saveRow}>
      {#snippet label()}{m.today_tz_row({ tz: fields.timezone || effectiveTz })}{/snippet}
      {#snippet value()}{/snippet}
      <label class="field">
        <span class="field-label">{m.today_tz_field_label()}</span>
        <select
          class="field-select"
          name="timezone"
          autocomplete="off"
          value={fields.timezone}
          onchange={(e) => { setField('timezone', e.currentTarget.value); autosave.flush(); }}
        >
          <option value="">{m.today_tz_inherit_option({ tz: effectiveTz })}</option>
          {#each COMMON_TIMEZONES as tz}
            <option value={tz} selected={fields.timezone === tz}>{tz}</option>
          {/each}
        </select>
      </label>
    </TimelineRow>
  </div>
</form>

<div class="push-area" class:push-highlight={pushHighlighted}>
  <EnablePushButton />
</div>

<style>
  .day-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--s-3);
  }
  .budget-warn {
    color: var(--c-danger);
    font-size: var(--fs-sm);
    margin: 0 0 var(--s-3);
  }
  .save-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--s-2) var(--s-3);
  }

  .today-form {
    display: grid;
    gap: var(--s-4);
    margin-bottom: var(--s-4);
  }

  /* Rows put their dot at their left edge; the rail runs through the dots. */
  .timeline {
    position: relative;
    display: grid;
    gap: var(--s-1);
    padding-left: var(--s-2);
  }
  .timeline::before {
    content: '';
    position: absolute;
    left: var(--s-2);
    top: var(--s-3);
    bottom: var(--s-3);
    width: 2px;
    background: var(--c-border);
    transform: translateX(-50%);
  }
  .now { padding-left: var(--s-5); }
  .add-nap {
    justify-self: start;
    width: fit-content;
    margin-left: var(--s-5);
  }

  .nap-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--s-2);
  }
  .nap-fields > :global(:last-child) { grid-column: 1 / -1; }
  @media (min-width: 480px) {
    .nap-fields { grid-template-columns: 1fr 1fr 1fr; }
    .nap-fields > :global(:last-child) { grid-column: auto; }
  }

  .reminder {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-3);
  }
  .reminder-meta { display: grid; gap: 2px; }
  .reminder-label { font-size: var(--fs-sm); font-weight: 600; }
  .reminder-sub { font-size: var(--fs-xs); color: var(--c-text-muted); }
  .reminder-value {
    font-size: var(--fs-lg);
    font-weight: 700;
    color: var(--c-primary);
    font-feature-settings: "tnum" 1;
  }

  /* Notes and time zone sit under the rail, without dots. */
  .extras {
    display: grid;
    gap: var(--s-1);
    padding-left: var(--s-2);
  }
  .extras :global(.row > .dot) { display: none; }
  .note-preview {
    display: block;
    max-width: min(32ch, 60vw);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 400;
  }

  .push-area {
    margin-bottom: var(--s-2);
    transition: background 0.2s ease;
    padding: var(--s-1) var(--s-2);
    border-radius: var(--r-sm);
  }
  .push-highlight {
    background: var(--c-accent-honey);
    animation: pulse 1s ease-in-out 3;
  }
  @keyframes pulse {
    0%, 100% { background: var(--c-accent-honey); }
    50% { background: transparent; }
  }
</style>
