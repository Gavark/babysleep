<script lang="ts">
  import { enhance } from '$app/forms';
  import { idealBedtime, suggestNextNap, suggestedBedtime, suggestNapEnd, computeDaySleepBudget, formatDuration, type NapPair } from '$lib/sleep-calc';
  import { isValidHHMM } from '$lib/time';
  import { COMMON_TIMEZONES } from '$lib/tz';
  import Clock from 'phosphor-svelte/lib/Clock';
  import Sun from 'phosphor-svelte/lib/Sun';
  import Moon from 'phosphor-svelte/lib/Moon';
  import Star from 'phosphor-svelte/lib/Star';
  import Globe from 'phosphor-svelte/lib/Globe';
  import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk';
  import Cloud from 'phosphor-svelte/lib/Cloud';
  import WakeTimer from '$lib/components/WakeTimer.svelte';
  import * as m from '$paraglide/messages';
  import { onMount } from 'svelte';
  import EnablePushButton from '$lib/components/EnablePushButton.svelte';

  let { data, form } = $props();

  let pushHighlighted = $state(false);
  let saveError = $state<string | null>(null);

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

  let wake       = $state('');
  let nap1Start  = $state('');
  let nap1End    = $state('');
  let nap2Start  = $state('');
  let nap2End    = $state('');
  let nap3Start  = $state('');
  let nap3End    = $state('');
  let nap4Start  = $state('');
  let nap4End    = $state('');
  let nap5Start  = $state('');
  let nap5End    = $state('');
  let nap6Start  = $state('');
  let nap6End    = $state('');
  let nap7Start  = $state('');
  let nap7End    = $state('');
  let nap8Start  = $state('');
  let nap8End    = $state('');
  let nap1Pause  = $state(0);
  let nap2Pause  = $state(0);
  let nap3Pause  = $state(0);
  let nap4Pause  = $state(0);
  let nap5Pause  = $state(0);
  let nap6Pause  = $state(0);
  let nap7Pause  = $state(0);
  let nap8Pause  = $state(0);
  let bedtime    = $state('');
  let notes      = $state('');
  let entryTz    = $state('');

  // Number of nap rows visible in the form. Defaults to the bracket-expected
  // count; reveals extra rows on demand via the "+ Ajouter une sieste" button.
  // When loading a day that already has data in slots beyond the bracket
  // count, we extend visibleNapCount so saved extras don't appear hidden.
  function computeInitialVisibleNaps(): number {
    const entry = data.entry;
    const expected = data.ageParams.naps;
    if (!entry) return Math.min(8, Math.max(1, expected));
    const slots = [
      entry.nap1Start || entry.nap1End || entry.nap1PauseMin,
      entry.nap2Start || entry.nap2End || entry.nap2PauseMin,
      entry.nap3Start || entry.nap3End || entry.nap3PauseMin,
      entry.nap4Start || entry.nap4End || entry.nap4PauseMin,
      entry.nap5Start || entry.nap5End || entry.nap5PauseMin,
      entry.nap6Start || entry.nap6End || entry.nap6PauseMin,
      entry.nap7Start || entry.nap7End || entry.nap7PauseMin,
      entry.nap8Start || entry.nap8End || entry.nap8PauseMin
    ];
    let highest = expected;
    for (let i = 7; i >= 0; i--) {
      if (slots[i]) { highest = Math.max(highest, i + 1); break; }
    }
    return Math.min(8, Math.max(1, highest));
  }
  let visibleNapCount = $state(computeInitialVisibleNaps());

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
      nap5Start = data.entry?.nap5Start ?? '';
      nap5End   = data.entry?.nap5End   ?? '';
      nap6Start = data.entry?.nap6Start ?? '';
      nap6End   = data.entry?.nap6End   ?? '';
      nap7Start = data.entry?.nap7Start ?? '';
      nap7End   = data.entry?.nap7End   ?? '';
      nap8Start = data.entry?.nap8Start ?? '';
      nap8End   = data.entry?.nap8End   ?? '';
      nap1Pause = data.entry?.nap1PauseMin ?? 0;
      nap2Pause = data.entry?.nap2PauseMin ?? 0;
      nap3Pause = data.entry?.nap3PauseMin ?? 0;
      nap4Pause = data.entry?.nap4PauseMin ?? 0;
      nap5Pause = data.entry?.nap5PauseMin ?? 0;
      nap6Pause = data.entry?.nap6PauseMin ?? 0;
      nap7Pause = data.entry?.nap7PauseMin ?? 0;
      nap8Pause = data.entry?.nap8PauseMin ?? 0;
      bedtime   = data.entry?.bedtime   ?? '';
      notes     = data.entry?.notes     ?? '';
      entryTz   = data.entry?.timezone  ?? '';
      visibleNapCount = computeInitialVisibleNaps();
    }
  });

  function safeNextNap(t: string, windowMin: number) {
    return isValidHHMM(t) ? suggestNextNap(t, windowMin) : '';
  }
  function safeIdeal(t: string) {
    return isValidHHMM(t) ? idealBedtime(t, data.ageParams.nightSleepH) : '';
  }

  const ideal = $derived(safeIdeal(data.baby.desiredWakeTime ?? '') || safeIdeal(wake));
  // Sieste 1 uses the shorter first-of-day window; later naps use the general one.
  const sugg1 = $derived(safeNextNap(wake, data.ageParams.firstAwakeWindowMin));
  const sugg2 = $derived(safeNextNap(nap1End, data.ageParams.awakeWindowMin));
  const sugg3 = $derived(safeNextNap(nap2End, data.ageParams.awakeWindowMin));
  const sugg4 = $derived(safeNextNap(nap3End, data.ageParams.awakeWindowMin));
  const sugg5 = $derived(safeNextNap(nap4End, data.ageParams.awakeWindowMin));
  const sugg6 = $derived(safeNextNap(nap5End, data.ageParams.awakeWindowMin));
  const sugg7 = $derived(safeNextNap(nap6End, data.ageParams.awakeWindowMin));
  const sugg8 = $derived(safeNextNap(nap7End, data.ageParams.awakeWindowMin));

  const napsArr = $derived<NapPair[]>([
    { start: nap1Start, end: nap1End, pauseMin: nap1Pause },
    { start: nap2Start, end: nap2End, pauseMin: nap2Pause },
    { start: nap3Start, end: nap3End, pauseMin: nap3Pause },
    { start: nap4Start, end: nap4End, pauseMin: nap4Pause },
    { start: nap5Start, end: nap5End, pauseMin: nap5Pause },
    { start: nap6Start, end: nap6End, pauseMin: nap6Pause },
    { start: nap7Start, end: nap7End, pauseMin: nap7Pause },
    { start: nap8Start, end: nap8End, pauseMin: nap8Pause }
  ]);
  // suggestNapEnd returns null for slots past the bracket count — that's the
  // intended behaviour (no prescription for off-pattern extra naps).
  const napEndSugg1 = $derived(suggestNapEnd(0, nap1Start, napsArr, data.ageParams) ?? '');
  const napEndSugg2 = $derived(suggestNapEnd(1, nap2Start, napsArr, data.ageParams) ?? '');
  const napEndSugg3 = $derived(suggestNapEnd(2, nap3Start, napsArr, data.ageParams) ?? '');
  const napEndSugg4 = $derived(suggestNapEnd(3, nap4Start, napsArr, data.ageParams) ?? '');
  const napEndSugg5 = $derived(suggestNapEnd(4, nap5Start, napsArr, data.ageParams) ?? '');
  const napEndSugg6 = $derived(suggestNapEnd(5, nap6Start, napsArr, data.ageParams) ?? '');
  const napEndSugg7 = $derived(suggestNapEnd(6, nap7Start, napsArr, data.ageParams) ?? '');
  const napEndSugg8 = $derived(suggestNapEnd(7, nap8Start, napsArr, data.ageParams) ?? '');

  const dayBudget = $derived(computeDaySleepBudget(napsArr, data.ageParams));

  const suggBed = $derived(
    isValidHHMM(wake)
      ? (suggestedBedtime({ wake, naps: napsArr }, data.ageParams) ?? '')
      : ''
  );

  // Strict-shape naps for WakeTimer (which expects non-null strings).
  const wakeTimerNaps = $derived([
    { start: nap1Start ?? '', end: nap1End ?? '', pauseMin: nap1Pause },
    { start: nap2Start ?? '', end: nap2End ?? '', pauseMin: nap2Pause },
    { start: nap3Start ?? '', end: nap3End ?? '', pauseMin: nap3Pause },
    { start: nap4Start ?? '', end: nap4End ?? '', pauseMin: nap4Pause },
    { start: nap5Start ?? '', end: nap5End ?? '', pauseMin: nap5Pause },
    { start: nap6Start ?? '', end: nap6End ?? '', pauseMin: nap6Pause },
    { start: nap7Start ?? '', end: nap7End ?? '', pauseMin: nap7Pause },
    { start: nap8Start ?? '', end: nap8End ?? '', pauseMin: nap8Pause }
  ]);

  let formEl = $state<HTMLFormElement | null>(null);

  function setNapStart(slotIdx: number, hhmm: string) {
    if (slotIdx === 0) nap1Start = hhmm;
    else if (slotIdx === 1) nap2Start = hhmm;
    else if (slotIdx === 2) nap3Start = hhmm;
    else if (slotIdx === 3) nap4Start = hhmm;
    else if (slotIdx === 4) nap5Start = hhmm;
    else if (slotIdx === 5) nap6Start = hhmm;
    else if (slotIdx === 6) nap7Start = hhmm;
    else if (slotIdx === 7) nap8Start = hhmm;
  }
  function setNapEnd(slotIdx: number, hhmm: string) {
    if (slotIdx === 0) nap1End = hhmm;
    else if (slotIdx === 1) nap2End = hhmm;
    else if (slotIdx === 2) nap3End = hhmm;
    else if (slotIdx === 3) nap4End = hhmm;
    else if (slotIdx === 4) nap5End = hhmm;
    else if (slotIdx === 5) nap6End = hhmm;
    else if (slotIdx === 6) nap7End = hhmm;
    else if (slotIdx === 7) nap8End = hhmm;
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
  function addPauseToSlot(slotIdx: number, deltaMin: number) {
    if (slotIdx === 0) nap1Pause += deltaMin;
    else if (slotIdx === 1) nap2Pause += deltaMin;
    else if (slotIdx === 2) nap3Pause += deltaMin;
    else if (slotIdx === 3) nap4Pause += deltaMin;
    else if (slotIdx === 4) nap5Pause += deltaMin;
    else if (slotIdx === 5) nap6Pause += deltaMin;
    else if (slotIdx === 6) nap7Pause += deltaMin;
    else if (slotIdx === 7) nap8Pause += deltaMin;
  }
  function handleAddPause(slotIdx: number, deltaMin: number) {
    addPauseToSlot(slotIdx, deltaMin);
    setTimeout(() => formEl?.requestSubmit(), 0);
  }

  function read(e: Event) {
    return (e.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
  }
</script>

<h1>{data.baby.name} — {data.today}</h1>
<p class="page-meta">
  <strong>{m.today_page_meta_months({ months: data.ageMonths })}</strong> {m.today_page_meta_label({ label: data.ageParams.label })} ·
  {m.today_page_meta_naps({ count: data.ageParams.naps })} · {m.today_page_meta_window({ window: data.ageParams.awakeWindowMin })} · {m.today_page_meta_night({ night: data.ageParams.nightSleepH })}
</p>
<p class="tz-info"><Globe size={12} /> {m.today_tz_label()} <strong>{data.effectiveTz}</strong></p>

<div class="push-area" class:push-highlight={pushHighlighted}>
  <EnablePushButton />
</div>

<WakeTimer
  wakeTime={wake}
  naps={wakeTimerNaps}
  {bedtime}
  ageParams={data.ageParams}
  effectiveTz={data.effectiveTz}
  locale={data.locale}
  onNapStart={handleNapStart}
  onNapEnd={handleNapEnd}
  onAddPause={handleAddPause}
/>

{#if saveError}<p class="error" role="alert">{saveError}</p>{/if}
{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form
  bind:this={formEl}
  method="POST"
  action="?/save"
  use:enhance={() => async ({ result, update }) => {
    saveError = result.type === 'error' ? m.today_entry_save_failed() : null;
    await update({ reset: false });
  }}
  autocomplete="off"
  class="today-form"
>
  <input type="hidden" name="date" value={data.today} />

  <label class="field">
    <span class="field-label"><Globe size={12} /> {m.today_tz_field_label()}</span>
    <select
      class="field-select"
      name="timezone"
      autocomplete="off"
      value={entryTz}
      oninput={(e) => entryTz = read(e)}
      onchange={(e) => entryTz = read(e)}
    >
      <option value="">{m.today_tz_inherit_option({ tz: data.effectiveTz })}</option>
      {#each COMMON_TIMEZONES as tz}
        <option value={tz} selected={entryTz === tz}>{tz}</option>
      {/each}
    </select>
  </label>

  <div class="card row-with-save">
    <label class="field">
      <span class="field-label"><Sun size={12} /> {m.today_wake_label()}</span>
      <input class="field-input" type="time" name="wake_time" autocomplete="off"
        value={wake}
        oninput={(e) => wake = read(e)} onchange={(e) => wake = read(e)} onblur={(e) => wake = read(e)} />
    </label>
    <button type="submit" class="btn btn-secondary btn-sm save-inline" title={m.today_wake_save_title()} aria-label={m.today_wake_save_title()}>
      <FloppyDisk size={14} />
    </button>
  </div>

  <section class="day-budget">
    <div class="day-budget-header">
      <Cloud size={18} weight="duotone" />
      <strong>{m.today_day_budget_title()}</strong>
    </div>
    <div class="day-budget-stats">
      <div><span class="day-budget-label">{m.today_day_budget_budget()}</span><span class="day-budget-value">{formatDuration(dayBudget.totalMin)}</span></div>
      <div><span class="day-budget-label">{m.today_day_budget_done()}</span><span class="day-budget-value">{formatDuration(dayBudget.completedMin)}</span></div>
      <div><span class="day-budget-label">{m.today_day_budget_remaining()}</span><span class="day-budget-value">{formatDuration(dayBudget.remainingMin)}</span></div>
    </div>
    <div class="day-budget-bar" role="progressbar" aria-valuemin="0" aria-valuemax={dayBudget.totalMin} aria-valuenow={dayBudget.completedMin}>
      <div class="day-budget-fill" style="width: {Math.min(100, dayBudget.ratio * 100)}%; background: {dayBudget.ratio > 1 ? 'var(--c-danger)' : 'var(--c-accent-honey)'};"></div>
    </div>
    {#if dayBudget.ratio > 1}
      <p class="day-budget-warn">{m.today_day_budget_exceeded({ amount: formatDuration(dayBudget.completedMin - dayBudget.totalMin) })}</p>
    {/if}
  </section>

  {#each [
    { idx: 1, suggValue: sugg1, endSuggValue: napEndSugg1, startVal: nap1Start, endVal: nap1End, pauseVal: nap1Pause, setStart: (v: string) => nap1Start = v, setEnd: (v: string) => nap1End = v, setPause: (v: number) => nap1Pause = v },
    { idx: 2, suggValue: sugg2, endSuggValue: napEndSugg2, startVal: nap2Start, endVal: nap2End, pauseVal: nap2Pause, setStart: (v: string) => nap2Start = v, setEnd: (v: string) => nap2End = v, setPause: (v: number) => nap2Pause = v },
    { idx: 3, suggValue: sugg3, endSuggValue: napEndSugg3, startVal: nap3Start, endVal: nap3End, pauseVal: nap3Pause, setStart: (v: string) => nap3Start = v, setEnd: (v: string) => nap3End = v, setPause: (v: number) => nap3Pause = v },
    { idx: 4, suggValue: sugg4, endSuggValue: napEndSugg4, startVal: nap4Start, endVal: nap4End, pauseVal: nap4Pause, setStart: (v: string) => nap4Start = v, setEnd: (v: string) => nap4End = v, setPause: (v: number) => nap4Pause = v },
    { idx: 5, suggValue: sugg5, endSuggValue: napEndSugg5, startVal: nap5Start, endVal: nap5End, pauseVal: nap5Pause, setStart: (v: string) => nap5Start = v, setEnd: (v: string) => nap5End = v, setPause: (v: number) => nap5Pause = v },
    { idx: 6, suggValue: sugg6, endSuggValue: napEndSugg6, startVal: nap6Start, endVal: nap6End, pauseVal: nap6Pause, setStart: (v: string) => nap6Start = v, setEnd: (v: string) => nap6End = v, setPause: (v: number) => nap6Pause = v },
    { idx: 7, suggValue: sugg7, endSuggValue: napEndSugg7, startVal: nap7Start, endVal: nap7End, pauseVal: nap7Pause, setStart: (v: string) => nap7Start = v, setEnd: (v: string) => nap7End = v, setPause: (v: number) => nap7Pause = v },
    { idx: 8, suggValue: sugg8, endSuggValue: napEndSugg8, startVal: nap8Start, endVal: nap8End, pauseVal: nap8Pause, setStart: (v: string) => nap8Start = v, setEnd: (v: string) => nap8End = v, setPause: (v: number) => nap8Pause = v }
  ].slice(0, visibleNapCount) as nap (nap.idx)}
    <div class="nap-block">
      <div class="nap-title"><Sun size={16} weight="regular" /> {m.today_nap_label_n({ n: nap.idx })}</div>
      <div class="hint">{m.today_nap_suggested_at()} <strong>{nap.suggValue || m.today_value_empty()}</strong></div>
      <div class="pair pair-with-pause">
        <label class="field">
          <span class="field-label">{m.today_nap_start_label()}</span>
          <input class="field-input" type="time" name="nap{nap.idx}_start" autocomplete="off"
            value={nap.startVal}
            oninput={(e) => nap.setStart(read(e))} onchange={(e) => nap.setStart(read(e))} onblur={(e) => nap.setStart(read(e))} />
        </label>
        <label class="field">
          <span class="field-label">{m.today_nap_end_label()}</span>
          <input class="field-input" type="time" name="nap{nap.idx}_end" autocomplete="off"
            value={nap.endVal}
            oninput={(e) => nap.setEnd(read(e))} onchange={(e) => nap.setEnd(read(e))} onblur={(e) => nap.setEnd(read(e))} />
        </label>
        <label class="field field-pause">
          <span class="field-label">{m.today_nap_pause_label()}</span>
          <input class="field-input" type="number" min="0" step="5" name="nap{nap.idx}_pause_min" autocomplete="off"
            value={nap.pauseVal || ''} placeholder="0"
            oninput={(e) => nap.setPause(Number(read(e)) || 0)} onchange={(e) => nap.setPause(Number(read(e)) || 0)} />
        </label>
      </div>
      {#if nap.endSuggValue && nap.startVal && !nap.endVal}
        <div class="hint" style="margin-top: var(--s-1);">{m.today_nap_end_suggested_at()} <strong>{nap.endSuggValue}</strong></div>
      {/if}
      <button type="submit" class="btn btn-secondary btn-sm save-inline-block" title={m.today_nap_save_title()} aria-label={m.today_nap_save_title()}>
        <FloppyDisk size={14} /> {m.today_nap_save_btn()}
      </button>
    </div>
  {/each}

  {#if visibleNapCount < 8}
    <button
      type="button"
      class="btn btn-ghost btn-sm add-nap-btn"
      onclick={() => { visibleNapCount = Math.min(8, visibleNapCount + 1); }}
    >
      + {m.today_add_nap()}
    </button>
  {/if}

  <div class="key-box">
    <div class="key-meta">
      <span class="key-label"><Star size={12} weight="fill" /> {m.today_ideal_bedtime_label()}</span>
      <span class="key-sub">{m.today_ideal_bedtime_sub({ time: data.baby.desiredWakeTime ?? m.today_value_empty() })}</span>
    </div>
    <span class="key-value">{ideal || m.today_value_empty()}</span>
  </div>

  <div class="key-box">
    <div class="key-meta">
      <span class="key-label"><Star size={12} weight="fill" /> {m.today_suggested_bedtime_label()}</span>
      <span class="key-sub">{m.today_suggested_bedtime_sub()}</span>
    </div>
    <span class="key-value">{suggBed || m.today_value_empty()}</span>
  </div>

  <div class="card row-with-save">
    <label class="field">
      <span class="field-label"><Moon size={12} /> {m.today_bedtime_label()}</span>
      <input class="field-input" type="time" name="bedtime" autocomplete="off"
        value={bedtime}
        oninput={(e) => bedtime = read(e)} onchange={(e) => bedtime = read(e)} onblur={(e) => bedtime = read(e)} />
    </label>
    <button type="submit" class="btn btn-secondary btn-sm save-inline" title={m.today_bedtime_save_title()} aria-label={m.today_bedtime_save_title()}>
      <FloppyDisk size={14} />
    </button>
  </div>

  <label class="field">
    <span class="field-label">{m.today_notes_label()}</span>
    <textarea class="field-textarea" name="notes" autocomplete="off" rows="2"
      value={notes}
      oninput={(e) => notes = read(e)}></textarea>
  </label>

  <button type="submit" class="btn btn-primary btn-block">
    <FloppyDisk size={18} weight="regular" />
    {m.today_submit_save_day()}
  </button>
</form>

<h2>{m.today_recent_title()}</h2>
<ul class="recent">
  {#each data.recent as r}
    <li><strong>{r.date}</strong> — {m.today_recent_line({ wake: r.wakeTime ?? m.today_recent_unknown(), bedtime: r.bedtime ?? m.today_recent_unknown() })}</li>
  {/each}
</ul>

<style>
  .row-with-save {
    display: flex;
    gap: var(--s-3);
    align-items: end;
  }
  .row-with-save .field { flex: 1; }
  .save-inline {
    height: 44px;
    width: 44px;
    padding: 0;
  }
  .save-inline-block {
    margin-top: var(--s-2);
    width: fit-content;
  }
  .add-nap-btn {
    justify-self: start;
    width: fit-content;
  }

  .today-form { display: grid; gap: var(--s-3); }
  .pair-with-pause {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--s-2);
  }
  .pair-with-pause .field-pause {
    grid-column: 1 / -1;
  }
  @media (min-width: 480px) {
    .pair-with-pause {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .pair-with-pause .field-pause {
      grid-column: auto;
    }
  }
  .recent { padding-left: var(--s-4); }
  .recent li { color: var(--c-text-muted); }
  .recent strong { color: var(--c-text); }

  .day-budget {
    background: var(--c-bg-card);
    border-radius: var(--r-lg);
    padding: var(--s-3) var(--s-4);
    box-shadow: var(--shadow-sm);
    margin-bottom: var(--s-3);
    display: grid;
    gap: var(--s-2);
  }
  .day-budget-header {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    font-size: var(--fs-base);
  }
  .day-budget-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--s-2);
  }
  .day-budget-stats > div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .day-budget-label {
    font-size: var(--fs-xs);
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--c-text-muted);
  }
  .day-budget-value {
    font-size: var(--fs-lg);
    font-weight: 700;
    color: var(--c-primary);
    font-feature-settings: "tnum" 1;
  }
  .day-budget-bar {
    height: 8px;
    background: var(--c-bg-soft);
    border-radius: var(--r-sm);
    overflow: hidden;
  }
  .day-budget-fill {
    height: 100%;
    transition: width 0.25s ease, background 0.25s ease;
  }
  .day-budget-warn {
    color: var(--c-danger);
    font-size: var(--fs-sm);
    margin: 0;
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
