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

  const ideal = $derived(
    data.baby.desiredWakeTime
      ? idealBedtime(data.baby.desiredWakeTime, data.ageParams.nightSleepH)
      : (wake ? idealBedtime(wake, data.ageParams.nightSleepH) : '')
  );
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
