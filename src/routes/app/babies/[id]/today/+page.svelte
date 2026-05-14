<script lang="ts">
  import { enhance } from '$app/forms';
  import { idealBedtime, suggestNextNap, suggestedBedtime } from '$lib/sleep-calc';
  import { isValidHHMM } from '$lib/time';

  let { data, form } = $props();

  let wake      = $state(data.entry?.wakeTime  ?? '');
  let nap1Start = $state(data.entry?.nap1Start ?? '');
  let nap1End   = $state(data.entry?.nap1End   ?? '');
  let nap2Start = $state(data.entry?.nap2Start ?? '');
  let nap2End   = $state(data.entry?.nap2End   ?? '');
  let nap3Start = $state(data.entry?.nap3Start ?? '');
  let nap3End   = $state(data.entry?.nap3End   ?? '');
  let nap4Start = $state(data.entry?.nap4Start ?? '');
  let nap4End   = $state(data.entry?.nap4End   ?? '');
  let bedtime   = $state(data.entry?.bedtime   ?? '');
  let notes     = $state(data.entry?.notes     ?? '');

  // DOM refs to catch values the browser injected without firing events
  let wakeEl      = $state<HTMLInputElement | null>(null);
  let nap1StartEl = $state<HTMLInputElement | null>(null);
  let nap1EndEl   = $state<HTMLInputElement | null>(null);
  let nap2StartEl = $state<HTMLInputElement | null>(null);
  let nap2EndEl   = $state<HTMLInputElement | null>(null);
  let nap3StartEl = $state<HTMLInputElement | null>(null);
  let nap3EndEl   = $state<HTMLInputElement | null>(null);
  let nap4StartEl = $state<HTMLInputElement | null>(null);
  let nap4EndEl   = $state<HTMLInputElement | null>(null);
  let bedtimeEl   = $state<HTMLInputElement | null>(null);

  // After mount, read whatever the browser put into the inputs (autofill / session memory)
  // and sync to state. Re-runs whenever the form re-mounts via the {#key} below.
  $effect(() => {
    if (wakeEl      && wakeEl.value      !== wake)      wake      = wakeEl.value;
    if (nap1StartEl && nap1StartEl.value !== nap1Start) nap1Start = nap1StartEl.value;
    if (nap1EndEl   && nap1EndEl.value   !== nap1End)   nap1End   = nap1EndEl.value;
    if (nap2StartEl && nap2StartEl.value !== nap2Start) nap2Start = nap2StartEl.value;
    if (nap2EndEl   && nap2EndEl.value   !== nap2End)   nap2End   = nap2EndEl.value;
    if (nap3StartEl && nap3StartEl.value !== nap3Start) nap3Start = nap3StartEl.value;
    if (nap3EndEl   && nap3EndEl.value   !== nap3End)   nap3End   = nap3EndEl.value;
    if (nap4StartEl && nap4StartEl.value !== nap4Start) nap4Start = nap4StartEl.value;
    if (nap4EndEl   && nap4EndEl.value   !== nap4End)   nap4End   = nap4EndEl.value;
    if (bedtimeEl   && bedtimeEl.value   !== bedtime)   bedtime   = bedtimeEl.value;
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

  function read(e: Event) {
    return (e.currentTarget as HTMLInputElement | HTMLTextAreaElement).value;
  }
</script>

{#key data.entry?.id ?? 'new'}
<h1>{data.baby.name} — {data.today}</h1>
<p>Âge : <strong>{data.ageMonths} mois</strong> ({data.ageParams.label}). Recommandé : {data.ageParams.naps} sieste(s), fenêtre {data.ageParams.awakeWindowMin} min, nuit {data.ageParams.nightSleepH}h.</p>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form method="POST" action="?/save" use:enhance autocomplete="off">
  <input type="hidden" name="date" value={data.today} />

  <label>Réveil
    <input type="time" name="wake_time" autocomplete="off"
      bind:this={wakeEl}
      value={wake}
      oninput={(e) => wake = read(e)}
      onchange={(e) => wake = read(e)}
      onblur={(e) => wake = read(e)} />
  </label>

  <div class="hint">💤 Sieste 1 suggérée vers <strong>{sugg1 || '—'}</strong></div>
  <label>Début sieste 1
    <input type="time" name="nap1_start" autocomplete="off"
      bind:this={nap1StartEl}
      value={nap1Start}
      oninput={(e) => nap1Start = read(e)}
      onchange={(e) => nap1Start = read(e)}
      onblur={(e) => nap1Start = read(e)} />
  </label>
  <label>Fin sieste 1
    <input type="time" name="nap1_end" autocomplete="off"
      bind:this={nap1EndEl}
      value={nap1End}
      oninput={(e) => nap1End = read(e)}
      onchange={(e) => nap1End = read(e)}
      onblur={(e) => nap1End = read(e)} />
  </label>

  <div class="hint">💤 Sieste 2 suggérée vers <strong>{sugg2 || '—'}</strong></div>
  <label>Début sieste 2
    <input type="time" name="nap2_start" autocomplete="off"
      bind:this={nap2StartEl}
      value={nap2Start}
      oninput={(e) => nap2Start = read(e)}
      onchange={(e) => nap2Start = read(e)}
      onblur={(e) => nap2Start = read(e)} />
  </label>
  <label>Fin sieste 2
    <input type="time" name="nap2_end" autocomplete="off"
      bind:this={nap2EndEl}
      value={nap2End}
      oninput={(e) => nap2End = read(e)}
      onchange={(e) => nap2End = read(e)}
      onblur={(e) => nap2End = read(e)} />
  </label>

  <div class="hint">💤 Sieste 3 suggérée vers <strong>{sugg3 || '—'}</strong></div>
  <label>Début sieste 3
    <input type="time" name="nap3_start" autocomplete="off"
      bind:this={nap3StartEl}
      value={nap3Start}
      oninput={(e) => nap3Start = read(e)}
      onchange={(e) => nap3Start = read(e)}
      onblur={(e) => nap3Start = read(e)} />
  </label>
  <label>Fin sieste 3
    <input type="time" name="nap3_end" autocomplete="off"
      bind:this={nap3EndEl}
      value={nap3End}
      oninput={(e) => nap3End = read(e)}
      onchange={(e) => nap3End = read(e)}
      onblur={(e) => nap3End = read(e)} />
  </label>

  <div class="hint">💤 Sieste 4 suggérée vers <strong>{sugg4 || '—'}</strong></div>
  <label>Début sieste 4
    <input type="time" name="nap4_start" autocomplete="off"
      bind:this={nap4StartEl}
      value={nap4Start}
      oninput={(e) => nap4Start = read(e)}
      onchange={(e) => nap4Start = read(e)}
      onblur={(e) => nap4Start = read(e)} />
  </label>
  <label>Fin sieste 4
    <input type="time" name="nap4_end" autocomplete="off"
      bind:this={nap4EndEl}
      value={nap4End}
      oninput={(e) => nap4End = read(e)}
      onchange={(e) => nap4End = read(e)}
      onblur={(e) => nap4End = read(e)} />
  </label>

  <div class="key">⭐ Coucher idéal : <strong>{ideal || '—'}</strong></div>
  <div class="key">⭐ Coucher suggéré : <strong>{suggBed || '—'}</strong></div>
  <label>Coucher effectif
    <input type="time" name="bedtime" autocomplete="off"
      bind:this={bedtimeEl}
      value={bedtime}
      oninput={(e) => bedtime = read(e)}
      onchange={(e) => bedtime = read(e)}
      onblur={(e) => bedtime = read(e)} />
  </label>

  <label>Notes <textarea name="notes" autocomplete="off" value={notes} oninput={(e) => notes = read(e)} rows="2"></textarea></label>

  <button type="submit">Enregistrer la journée</button>
</form>

<h2>7 derniers jours</h2>
<ul>
  {#each data.recent as r}
    <li>{r.date} — réveil {r.wakeTime ?? '?'} / coucher {r.bedtime ?? '?'}</li>
  {/each}
</ul>
{/key}

<style>
  form { display: grid; gap: 0.5rem; max-width: 360px; }
  .hint { color: #475569; font-size: 0.9rem; }
  .key { background: #C6E0B4; padding: 0.25rem 0.5rem; border-radius: 4px; color: #1F4E78; font-weight: 600; }
  .error { color: #b91c1c; } .ok { color: #047857; }
  button { padding: 0.5rem 1rem; background: #1F4E78; color: white; border: 0; border-radius: 4px; }
</style>
