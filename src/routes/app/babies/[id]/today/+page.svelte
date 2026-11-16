<script lang="ts">
  import { enhance, type SubmitFunction } from '$app/forms';
  import { refreshAll } from '$app/navigation';
  import { onMount, untrack } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import { computeDaySleepBudget, formatDuration } from '$lib/sleep-calc';
  import { COMMON_TIMEZONES } from '$lib/tz';
  import { formatAgeBracket, formatLongDay } from '$lib/format';
  import {
    FIELD_NAMES,
    fieldsFromEntry,
    mergeServer,
    napPairs,
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

  let { data, form } = $props();

  let pushHighlighted = $state(false);

  onMount(() => {
    if (!('serviceWorker' in navigator)) return;
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'wake-window-exceeded' && event.data.payload?.babyId === data.baby.id) {
        pushHighlighted = true;
        setTimeout(() => { pushHighlighted = false; }, 8000);
      }
    };
    navigator.serviceWorker.addEventListener('message', handler);
    return () => navigator.serviceWorker.removeEventListener('message', handler);
  });

  const MAX_NAPS = 8;

  // Seeded once; the effect below keeps them in step with the server.
  let fields = $state<DayFields>(untrack(() => fieldsFromEntry(data.entry)));
  let napCount = $state(untrack(() => visibleNapCount(fields, data.ageParams.naps)));
  /** Fields emptied with ✕: posted with a `clear` so the server nulls them. */
  const clears = new SvelteSet<string>();
  /** Open row key: 'wake', 'nap1'…'nap8', 'bedtime', 'notes', 'tz'. */
  let openRow = $state<string | null>(null);
  let saveState = $state<SaveState>('idle');
  /** Name of the form field holding focus: never overwritten by server data. */
  let focused = $state<string | null>(null);

  let formEl = $state<HTMLFormElement | null>(null);
  /** Fields the scheduler asked to send, picked up by the next submit event. */
  let requested: string[] | null = null;
  /** Settles the promise of the save in flight. */
  let settle: ((ok: boolean) => void) | null = null;

  function save(names: string[]): Promise<boolean> {
    // Only one save is ever in flight; never leave an older promise hanging.
    settle?.(false);
    return new Promise<boolean>((resolve) => {
      settle = resolve;
      requested = names;
      formEl?.requestSubmit();
      // `enhance` consumes `requested` synchronously in the submit event; if it
      // is still set, no submission started and none will settle this promise.
      if (requested) {
        requested = null;
        settle = null;
        resolve(false);
      }
    });
  }

  const autosave = createAutosave({ delayMs: 600, onState: (s) => (saveState = s), save });

  const submitForm: SubmitFunction = ({ formData, cancel }) => {
    const names = requested;
    requested = null;
    if (!names) {
      // Enter pressed in a field: send only what changed, not the whole form.
      cancel();
      autosave.flush();
      return;
    }
    const resolve = settle ?? (() => {});
    const sent = new Set(names);
    // Values come from `fields`, not the DOM, which may not reflect a change
    // made in the same tick (✕, "now" card actions).
    for (const name of FIELD_NAMES) {
      if (sent.has(name)) formData.set(name, fields[name] ?? '');
      else formData.delete(name);
    }
    formData.delete('clear');
    const clearedSent = names.filter((name) => clears.has(name));
    for (const name of clearedSent) formData.append('clear', name);

    return async ({ result, update }) => {
      const ok = result.type === 'success';
      if (ok) for (const name of clearedSent) clears.delete(name);
      try {
        // An `error` result (network down, server unreachable) would swap the
        // page for the error page: keep the values on screen and show the banner.
        if (result.type !== 'error') await update({ reset: false });
      } finally {
        if (settle === resolve) settle = null;
        resolve(ok);
      }
    };
  };

  $effect(() => {
    const server = fieldsFromEntry(data.entry);
    untrack(() => {
      const keep = new Set([...autosave.dirty(), ...(focused ? [focused] : [])]);
      fields = mergeServer(fields, server, keep);
      napCount = Math.max(napCount, visibleNapCount(fields, data.ageParams.naps));
    });
  });

  onMount(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void refreshAll();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      autosave.dispose();
    };
  });

  function setField(name: string, value: string) {
    fields[name] = value;
    clears.delete(name);
    autosave.touch(name);
  }

  function clearField(name: string) {
    fields[name] = '';
    clears.add(name);
    autosave.touch(name);
    autosave.flush();
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
  const budget = $derived(computeDaySleepBudget(pairs, data.ageParams));
  const timeline = $derived(
    buildTimeline({
      fields,
      napCount,
      ageParams: data.ageParams,
      desiredWakeTime: data.baby.desiredWakeTime ?? null
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
    <h1>{formatLongDay(data.today, data.locale)}</h1>
    <p class="page-meta">
      <strong>{m.today_page_meta_months({ months: data.ageMonths })}</strong> {m.today_page_meta_label({ label: formatAgeBracket(data.ageParams) })} ·
      {m.today_page_meta_naps({ count: data.ageParams.naps })} · {m.today_page_meta_window({ window: data.ageParams.awakeWindowMin })} · {m.today_page_meta_night({ night: data.ageParams.nightSleepH })}
    </p>
  </div>
  <BudgetRing completedMin={budget.completedMin} totalMin={budget.totalMin} remainingMin={budget.remainingMin} />
</header>
{#if budget.ratio > 1}
  <p class="budget-warn">{m.today_day_budget_exceeded({ amount: formatDuration(budget.completedMin - budget.totalMin) })}</p>
{/if}

{#if saveState === 'error' || form?.error}
  <p class="error save-banner" role="alert">
    <span>{form?.error ?? m.today_entry_save_failed()}</span>
    <button type="button" class="btn btn-secondary btn-sm" onclick={() => autosave.flush()}>{m.today_save_retry()}</button>
  </p>
{/if}

<form
  bind:this={formEl}
  method="POST"
  action="?/save"
  novalidate
  autocomplete="off"
  class="today-form"
  use:enhance={submitForm}
  onfocusin={onFocusIn}
  onfocusout={onFocusOut}
>
  <input type="hidden" name="date" value={data.today} />

  <div class="timeline">
    {#each items as item (item.key)}
      {#if item.row === null}
        <div class="now">
          <WakeTimer
            wakeTime={fields.wake_time}
            naps={pairs}
            bedtime={fields.bedtime}
            ageParams={data.ageParams}
            effectiveTz={data.effectiveTz}
            locale={data.locale}
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
              onchange={(v) => setField(`nap${nap.n}_pause_min`, v.trim())}
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
              <span class="reminder-sub">{m.today_ideal_bedtime_sub({ time: data.baby.desiredWakeTime ?? m.today_value_empty() })}</span>
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
          onchange={(e) => setField('notes', e.currentTarget.value)}
        ></textarea>
      </label>
    </TimelineRow>

    <TimelineRow state="done" open={openRow === 'tz'} ontoggle={() => toggleRow('tz')} {saveState} onsave={saveRow}>
      {#snippet label()}{m.today_tz_row({ tz: data.effectiveTz })}{/snippet}
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
          <option value="">{m.today_tz_inherit_option({ tz: data.effectiveTz })}</option>
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
