<script lang="ts">
  import { enhance } from '$app/forms';
  import { idealBedtime, suggestNextNap, suggestedBedtime } from '$lib/sleep-calc';
  import { isValidHHMM } from '$lib/time';

  let { data, form } = $props();

  // Stable initial values from the loaded entry — read once per entry-id.
  // The {#key} wrapper below re-mounts the form when the entry id changes,
  // so these initializers are correct without needing $effect-based syncing.
  let wake    = $state(data.entry?.wakeTime ?? '');
  let nap1    = $state(data.entry?.nap1End  ?? '');
  let nap2    = $state(data.entry?.nap2End  ?? '');
  let nap3    = $state(data.entry?.nap3End  ?? '');
  let nap4    = $state(data.entry?.nap4End  ?? '');
  let bedtime = $state(data.entry?.bedtime  ?? '');
  let notes   = $state(data.entry?.notes    ?? '');

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
  const sugg2 = $derived(safeNextNap(nap1));
  const sugg3 = $derived(safeNextNap(nap2));
  const sugg4 = $derived(safeNextNap(nap3));
  const suggBed = $derived(
    isValidHHMM(wake)
      ? (suggestedBedtime(
          { wake, napEnds: [nap1, nap2, nap3, nap4].filter(isValidHHMM) },
          data.ageParams
        ) ?? '')
      : ''
  );

  // Read currentTarget value on multiple events for maximum reliability across browsers/autofill
  function read(e: Event) {
    return (e.currentTarget as HTMLInputElement | HTMLTextAreaElement).value;
  }
</script>

{#key data.entry?.id ?? 'new'}
<h1>{data.baby.name} — {data.today}</h1>
<p>Âge : <strong>{data.ageMonths} mois</strong> ({data.ageParams.label}). Recommandé : {data.ageParams.naps} sieste(s), fenêtre {data.ageParams.awakeWindowMin} min, nuit {data.ageParams.nightSleepH}h.</p>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form method="POST" action="?/save" use:enhance>
  <input type="hidden" name="date" value={data.today} />

  <label>Réveil
    <input type="time" name="wake_time"
      value={wake}
      oninput={(e) => wake = read(e)}
      onchange={(e) => wake = read(e)}
      onblur={(e) => wake = read(e)} />
  </label>

  <div class="hint">💤 Sieste 1 suggérée vers <strong>{sugg1 || '—'}</strong></div>
  <label>Fin sieste 1
    <input type="time" name="nap1_end"
      value={nap1}
      oninput={(e) => nap1 = read(e)}
      onchange={(e) => nap1 = read(e)}
      onblur={(e) => nap1 = read(e)} />
  </label>

  <div class="hint">💤 Sieste 2 suggérée vers <strong>{sugg2 || '—'}</strong></div>
  <label>Fin sieste 2
    <input type="time" name="nap2_end"
      value={nap2}
      oninput={(e) => nap2 = read(e)}
      onchange={(e) => nap2 = read(e)}
      onblur={(e) => nap2 = read(e)} />
  </label>

  <div class="hint">💤 Sieste 3 suggérée vers <strong>{sugg3 || '—'}</strong></div>
  <label>Fin sieste 3
    <input type="time" name="nap3_end"
      value={nap3}
      oninput={(e) => nap3 = read(e)}
      onchange={(e) => nap3 = read(e)}
      onblur={(e) => nap3 = read(e)} />
  </label>

  <div class="hint">💤 Sieste 4 suggérée vers <strong>{sugg4 || '—'}</strong></div>
  <label>Fin sieste 4
    <input type="time" name="nap4_end"
      value={nap4}
      oninput={(e) => nap4 = read(e)}
      onchange={(e) => nap4 = read(e)}
      onblur={(e) => nap4 = read(e)} />
  </label>

  <div class="key">⭐ Coucher idéal : <strong>{ideal || '—'}</strong></div>
  <div class="key">⭐ Coucher suggéré : <strong>{suggBed || '—'}</strong></div>
  <label>Coucher effectif
    <input type="time" name="bedtime"
      value={bedtime}
      oninput={(e) => bedtime = read(e)}
      onchange={(e) => bedtime = read(e)}
      onblur={(e) => bedtime = read(e)} />
  </label>

  <label>Notes <textarea name="notes" value={notes} oninput={(e) => notes = read(e)} rows="2"></textarea></label>

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
