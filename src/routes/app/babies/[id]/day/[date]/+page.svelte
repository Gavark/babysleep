<script lang="ts">
  import { enhance } from '$app/forms';
  import {
    idealBedtime, suggestNextNap, suggestedBedtime, suggestNapEnd,
    computeDaySleepBudget, formatDuration, type NapPair
  } from '$lib/sleep-calc';
  import { isValidHHMM } from '$lib/time';
  import { COMMON_TIMEZONES } from '$lib/tz';
  import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
  import Sun from 'phosphor-svelte/lib/Sun';
  import Moon from 'phosphor-svelte/lib/Moon';
  import Star from 'phosphor-svelte/lib/Star';
  import Globe from 'phosphor-svelte/lib/Globe';
  import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk';
  import Cloud from 'phosphor-svelte/lib/Cloud';
  import Trash from 'phosphor-svelte/lib/Trash';
  import * as m from '$paraglide/messages';

  let { data, form } = $props();

  let wake       = $state('');
  let nap1Start  = $state('');
  let nap1End    = $state('');
  let nap2Start  = $state('');
  let nap2End    = $state('');
  let nap3Start  = $state('');
  let nap3End    = $state('');
  let nap4Start  = $state('');
  let nap4End    = $state('');
  let nap1Pause  = $state(0);
  let nap2Pause  = $state(0);
  let nap3Pause  = $state(0);
  let nap4Pause  = $state(0);
  let bedtime    = $state('');
  let notes      = $state('');
  let entryTz    = $state('');

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
      nap1Pause = data.entry?.nap1PauseMin ?? 0;
      nap2Pause = data.entry?.nap2PauseMin ?? 0;
      nap3Pause = data.entry?.nap3PauseMin ?? 0;
      nap4Pause = data.entry?.nap4PauseMin ?? 0;
      bedtime   = data.entry?.bedtime   ?? '';
      notes     = data.entry?.notes     ?? '';
      entryTz   = data.entry?.timezone  ?? '';
    }
  });

  function safeNextNap(t: string, windowMin: number) {
    return isValidHHMM(t) ? suggestNextNap(t, windowMin) : '';
  }
  function safeIdeal(t: string) {
    return isValidHHMM(t) ? idealBedtime(t, data.ageParams.nightSleepH) : '';
  }

  const napsArr = $derived<NapPair[]>([
    { start: nap1Start, end: nap1End, pauseMin: nap1Pause },
    { start: nap2Start, end: nap2End, pauseMin: nap2Pause },
    { start: nap3Start, end: nap3End, pauseMin: nap3Pause },
    { start: nap4Start, end: nap4End, pauseMin: nap4Pause }
  ]);
  const napEndSugg1 = $derived(suggestNapEnd(0, nap1Start, napsArr, data.ageParams) ?? '');
  const napEndSugg2 = $derived(suggestNapEnd(1, nap2Start, napsArr, data.ageParams) ?? '');
  const napEndSugg3 = $derived(suggestNapEnd(2, nap3Start, napsArr, data.ageParams) ?? '');
  const napEndSugg4 = $derived(suggestNapEnd(3, nap4Start, napsArr, data.ageParams) ?? '');

  const ideal = $derived(safeIdeal(data.baby.desiredWakeTime ?? '') || safeIdeal(wake));
  // Sieste 1 uses the shorter first-of-day window; later naps use the general one.
  const sugg1 = $derived(safeNextNap(wake, data.ageParams.firstAwakeWindowMin));
  const sugg2 = $derived(safeNextNap(nap1End, data.ageParams.awakeWindowMin));
  const sugg3 = $derived(safeNextNap(nap2End, data.ageParams.awakeWindowMin));
  const sugg4 = $derived(safeNextNap(nap3End, data.ageParams.awakeWindowMin));

  const dayBudget = $derived(computeDaySleepBudget(napsArr, data.ageParams));

  const suggBed = $derived(
    isValidHHMM(wake)
      ? (suggestedBedtime({ wake, naps: napsArr }, data.ageParams) ?? '')
      : ''
  );

  function read(e: Event) {
    return (e.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
  }
</script>

<p class="back"><a href="/app/babies/{data.baby.id}/history"><ArrowLeft size={14} /> {m.day_back_to_history()}</a></p>

<h1>{m.day_title({ name: data.baby.name, date: data.date })}</h1>
<p class="page-meta">
  {data.entry ? m.day_page_meta_edit() : m.day_page_meta_create()} · <strong>{m.today_page_meta_months({ months: data.ageMonths })}</strong> {m.today_page_meta_label({ label: data.ageParams.label })} ·
  {m.today_page_meta_naps({ count: data.ageParams.naps })} · {m.today_page_meta_window({ window: data.ageParams.awakeWindowMin })} · {m.today_page_meta_night({ night: data.ageParams.nightSleepH })}
</p>
<p class="tz-info"><Globe size={12} /> {m.today_tz_label()} <strong>{data.effectiveTz}</strong></p>

{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form
  method="POST"
  action="?/save"
  use:enhance={() => async ({ update }) => update({ reset: false })}
  autocomplete="off"
  class="today-form"
>
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
    { idx: 4, suggValue: sugg4, endSuggValue: napEndSugg4, startVal: nap4Start, endVal: nap4End, pauseVal: nap4Pause, setStart: (v: string) => nap4Start = v, setEnd: (v: string) => nap4End = v, setPause: (v: number) => nap4Pause = v }
  ] as nap (nap.idx)}
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
    {data.entry ? m.day_submit_update() : m.day_submit_create()}
  </button>
</form>

{#if data.entry}
<form method="POST" action="?/delete" use:enhance
  onsubmit={(e) => { if (!confirm(m.day_delete_confirm())) e.preventDefault(); }}
  style="margin-top: var(--s-4);"
>
  <button type="submit" class="btn btn-danger"><Trash size={16} /> {m.day_delete_btn()}</button>
</form>
{/if}

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
  /* day-budget styles are scoped per-page; copy from today/+page.svelte */
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
</style>
