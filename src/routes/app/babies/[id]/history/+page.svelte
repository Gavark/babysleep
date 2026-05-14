<script lang="ts">
  import { parseHHMM, formatHHMM } from '$lib/time';

  let { data } = $props();

  function napCount(r: any) {
    return [r.nap1End, r.nap2End, r.nap3End, r.nap4End].filter(Boolean).length;
  }

  function prevNight(curr: any, prev: any): string {
    if (!prev || !curr.wakeTime || !prev.bedtime) return '';
    const dayDiff = (new Date(curr.date).getTime() - new Date(prev.date).getTime()) / 86400000;
    if (Math.round(dayDiff) !== 1) return '';
    const dur = ((parseHHMM(curr.wakeTime) - parseHHMM(prev.bedtime)) % 1440 + 1440) % 1440;
    return formatHHMM(dur);
  }
</script>

<h1>Historique — {data.baby.name}</h1>

<form method="GET">
  <label>De <input type="date" name="from" value={data.from} /></label>
  <label>À <input type="date" name="to" value={data.to} /></label>
  <button type="submit">Filtrer</button>
  <a class="btn" href="/api/babies/{data.baby.id}/export.csv?from={data.from}&to={data.to}">Télécharger CSV</a>
</form>

<section class="summary">
  <div>📅 {data.summary.entryCount} jour(s)</div>
  <div>🌅 Réveil moyen : {data.summary.meanWakeHHMM || '—'}</div>
  <div>🌙 Coucher moyen : {data.summary.meanBedtimeHHMM || '—'}</div>
  <div>🛏️ Nuit moyenne : {data.summary.meanPrevNightHHMM || '—'}</div>
  <div>💤 Siestes / jour : {data.summary.meanNaps}</div>
</section>

<table>
  <thead>
    <tr><th>Date</th><th>Réveil</th><th>S1</th><th>S2</th><th>S3</th><th>S4</th><th>Coucher</th><th>Nuit préc.</th><th>Nb</th><th>Notes</th></tr>
  </thead>
  <tbody>
    {#each data.entries as r, i}
      <tr>
        <td>{r.date}</td>
        <td>{r.wakeTime ?? ''}</td>
        <td>{r.nap1End ?? ''}</td>
        <td>{r.nap2End ?? ''}</td>
        <td>{r.nap3End ?? ''}</td>
        <td>{r.nap4End ?? ''}</td>
        <td>{r.bedtime ?? ''}</td>
        <td>{prevNight(r, data.entries[i + 1])}</td>
        <td>{napCount(r)}</td>
        <td>{r.notes ?? ''}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  form { display: flex; gap: 0.5rem; align-items: end; flex-wrap: wrap; margin-bottom: 1rem; }
  .summary { display: flex; gap: 1rem; flex-wrap: wrap; background: #DDEBF7; padding: 0.5rem; margin-bottom: 1rem; }
  table { border-collapse: collapse; width: 100%; }
  th, td { padding: 0.35rem; border-bottom: 1px solid #e5e7eb; text-align: left; }
  .btn { padding: 0.4rem 0.6rem; background: #1F4E78; color: white; text-decoration: none; border-radius: 4px; }
</style>
