<script lang="ts">
  import { enhance } from '$app/forms';
  import { idealBedtime, suggestNextNap, suggestedBedtime } from '$lib/sleep-calc';
  import { isValidHHMM } from '$lib/time';
  import { COMMON_TIMEZONES } from '$lib/tz';
  import Clock from 'phosphor-svelte/lib/Clock';
  import Sun from 'phosphor-svelte/lib/Sun';
  import Moon from 'phosphor-svelte/lib/Moon';
  import Star from 'phosphor-svelte/lib/Star';
  import Globe from 'phosphor-svelte/lib/Globe';
  import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk';

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
      bedtime   = data.entry?.bedtime   ?? '';
      notes     = data.entry?.notes     ?? '';
      entryTz   = data.entry?.timezone  ?? '';
    }
  });

  function safeNextNap(t: string) {
    return isValidHHMM(t) ? suggestNextNap(t, data.ageParams.awakeWindowMin) : '';
  }
  function safeIdeal(t: string) {
    return isValidHHMM(t) ? idealBedtime(t, data.ageParams.nightSleepH) : '';
  }

  const ideal = $derived(safeIdeal(data.baby.desiredWakeTime ?? '') || safeIdeal(wake));
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

  function read(e: Event) {
    return (e.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
  }
</script>

<h1>{data.baby.name} — {data.today}</h1>
<p class="page-meta">
  <strong>{data.ageMonths} mois</strong> ({data.ageParams.label}) ·
  {data.ageParams.naps} sieste(s) · fenêtre {data.ageParams.awakeWindowMin} min · nuit {data.ageParams.nightSleepH}h
</p>
<p class="tz-info"><Globe size={12} /> Fuseau actif : <strong>{data.effectiveTz}</strong></p>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form
  method="POST"
  action="?/save"
  use:enhance={() => async ({ update }) => update({ reset: false })}
  autocomplete="off"
  class="today-form"
>
  <input type="hidden" name="date" value={data.today} />

  <label class="field">
    <span class="field-label"><Globe size={12} /> Fuseau (cette journée)</span>
    <select
      class="field-select"
      name="timezone"
      autocomplete="off"
      value={entryTz}
      oninput={(e) => entryTz = read(e)}
      onchange={(e) => entryTz = read(e)}
    >
      <option value="">Hériter ({data.effectiveTz})</option>
      {#each COMMON_TIMEZONES as tz}
        <option value={tz} selected={entryTz === tz}>{tz}</option>
      {/each}
    </select>
  </label>

  <div class="card">
    <label class="field">
      <span class="field-label"><Sun size={12} /> Réveil</span>
      <input class="field-input" type="time" name="wake_time" autocomplete="off"
        value={wake}
        oninput={(e) => wake = read(e)} onchange={(e) => wake = read(e)} onblur={(e) => wake = read(e)} />
    </label>
  </div>

  {#each [
    { idx: 1, suggValue: sugg1, startVal: nap1Start, endVal: nap1End, setStart: (v: string) => nap1Start = v, setEnd: (v: string) => nap1End = v },
    { idx: 2, suggValue: sugg2, startVal: nap2Start, endVal: nap2End, setStart: (v: string) => nap2Start = v, setEnd: (v: string) => nap2End = v },
    { idx: 3, suggValue: sugg3, startVal: nap3Start, endVal: nap3End, setStart: (v: string) => nap3Start = v, setEnd: (v: string) => nap3End = v },
    { idx: 4, suggValue: sugg4, startVal: nap4Start, endVal: nap4End, setStart: (v: string) => nap4Start = v, setEnd: (v: string) => nap4End = v }
  ] as nap (nap.idx)}
    <div class="nap-block">
      <div class="nap-title"><Sun size={16} weight="regular" /> Sieste {nap.idx}</div>
      <div class="hint">Suggérée vers <strong>{nap.suggValue || '—'}</strong></div>
      <div class="pair">
        <label class="field">
          <span class="field-label">Début</span>
          <input class="field-input" type="time" name="nap{nap.idx}_start" autocomplete="off"
            value={nap.startVal}
            oninput={(e) => nap.setStart(read(e))} onchange={(e) => nap.setStart(read(e))} onblur={(e) => nap.setStart(read(e))} />
        </label>
        <label class="field">
          <span class="field-label">Fin</span>
          <input class="field-input" type="time" name="nap{nap.idx}_end" autocomplete="off"
            value={nap.endVal}
            oninput={(e) => nap.setEnd(read(e))} onchange={(e) => nap.setEnd(read(e))} onblur={(e) => nap.setEnd(read(e))} />
        </label>
      </div>
    </div>
  {/each}

  <div class="key-box">
    <div class="key-meta">
      <span class="key-label"><Star size={12} weight="fill" /> Coucher idéal</span>
      <span class="key-sub">Pour réveil souhaité {data.baby.desiredWakeTime ?? '—'}</span>
    </div>
    <span class="key-value">{ideal || '—'}</span>
  </div>

  <div class="key-box">
    <div class="key-meta">
      <span class="key-label"><Star size={12} weight="fill" /> Coucher suggéré</span>
      <span class="key-sub">Basé sur les siestes saisies</span>
    </div>
    <span class="key-value">{suggBed || '—'}</span>
  </div>

  <div class="card">
    <label class="field">
      <span class="field-label"><Moon size={12} /> Coucher effectif</span>
      <input class="field-input" type="time" name="bedtime" autocomplete="off"
        value={bedtime}
        oninput={(e) => bedtime = read(e)} onchange={(e) => bedtime = read(e)} onblur={(e) => bedtime = read(e)} />
    </label>
  </div>

  <label class="field">
    <span class="field-label">Notes</span>
    <textarea class="field-textarea" name="notes" autocomplete="off" rows="2"
      value={notes}
      oninput={(e) => notes = read(e)}></textarea>
  </label>

  <button type="submit" class="btn btn-primary btn-block">
    <FloppyDisk size={18} weight="regular" />
    Enregistrer la journée
  </button>
</form>

<h2>7 derniers jours</h2>
<ul class="recent">
  {#each data.recent as r}
    <li><strong>{r.date}</strong> — réveil {r.wakeTime ?? '?'} / coucher {r.bedtime ?? '?'}</li>
  {/each}
</ul>

<style>
  .today-form { display: grid; gap: var(--s-3); }
  .recent { padding-left: var(--s-4); }
  .recent li { color: var(--c-text-muted); }
  .recent strong { color: var(--c-text); }
</style>
