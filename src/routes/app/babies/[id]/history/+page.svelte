<script lang="ts">
  import { parseHHMM, formatHHMM, isValidHHMM } from '$lib/time';
  import { formatDuration } from '$lib/sleep-calc';
  import Download from 'phosphor-svelte/lib/Download';
  import Calendar from 'phosphor-svelte/lib/Calendar';
  import CalendarBlank from 'phosphor-svelte/lib/CalendarBlank';
  import Sun from 'phosphor-svelte/lib/Sun';
  import Moon from 'phosphor-svelte/lib/Moon';
  import Bed from 'phosphor-svelte/lib/Bed';
  import Cloud from 'phosphor-svelte/lib/Cloud';
  import Coffee from 'phosphor-svelte/lib/Coffee';
  import CheckCircle from 'phosphor-svelte/lib/CheckCircle';
  import MinusCircle from 'phosphor-svelte/lib/MinusCircle';
  import XCircle from 'phosphor-svelte/lib/XCircle';
  let { data } = $props();

  function napCount(r: any) {
    return [r.nap1End, r.nap2End, r.nap3End, r.nap4End].filter(Boolean).length;
  }

  function totalNapsMin(r: any): number {
    const pairs: [string | null, string | null, number | null][] = [
      [r.nap1Start, r.nap1End, r.nap1PauseMin ?? null],
      [r.nap2Start, r.nap2End, r.nap2PauseMin ?? null],
      [r.nap3Start, r.nap3End, r.nap3PauseMin ?? null],
      [r.nap4Start, r.nap4End, r.nap4PauseMin ?? null]
    ];
    let total = 0;
    for (const [s, e, pause] of pairs) {
      if (s && e && isValidHHMM(s) && isValidHHMM(e)) {
        const d = parseHHMM(e) - parseHHMM(s);
        if (d > 0) total += Math.max(0, d - (pause ?? 0));
      }
    }
    return total;
  }

  function prevNight(curr: any, prev: any | undefined): string {
    if (!prev || !curr.wakeTime || !prev.bedtime) return '';
    const dayDiff = (new Date(curr.date).getTime() - new Date(prev.date).getTime()) / 86400000;
    if (Math.round(dayDiff) !== 1) return '';
    const dur = ((parseHHMM(curr.wakeTime) - parseHHMM(prev.bedtime)) % 1440 + 1440) % 1440;
    return formatHHMM(dur);
  }
</script>

<h1>Historique — {data.baby.name}</h1>

<form method="GET" class="filter-row">
  <label class="field">
    <span class="field-label"><Calendar size={12} /> De</span>
    <input class="field-input" type="date" name="from" value={data.from} />
  </label>
  <label class="field">
    <span class="field-label"><Calendar size={12} /> À</span>
    <input class="field-input" type="date" name="to" value={data.to} />
  </label>
  <button type="submit" class="btn btn-secondary">Filtrer</button>
  <a class="btn btn-primary" href="/api/babies/{data.baby.id}/export.csv?from={data.from}&to={data.to}">
    <Download size={16} /> CSV
  </a>
</form>

<section class="summary-strip">
  <div><CalendarBlank size={16} /> <strong>{data.summary.entryCount}</strong> jour(s)</div>
  <div><Sun size={16} /> Réveil moyen <strong>{data.summary.meanWakeHHMM || '—'}</strong></div>
  <div><Moon size={16} /> Coucher moyen <strong>{data.summary.meanBedtimeHHMM || '—'}</strong></div>
  <div><Bed size={16} /> Nuit moyenne <strong>{data.summary.meanPrevNightHHMM || '—'}</strong></div>
  <div><Cloud size={16} /> Jour moyen <strong>{data.summary.meanDaySleepHHMM || '—'}</strong></div>
  <div><Coffee size={16} /> Siestes/jour <strong>{data.summary.meanNaps}</strong></div>
</section>

{#if data.entries.length === 0}
  <p class="empty">Aucune entrée sur cette période.</p>
{:else}
  <div class="card history-card">
    <table class="history-table">
      <thead>
        <tr>
          <th>Date</th><th>Note</th><th>Σ Siestes</th><th>Réveil</th>
          <th>S1</th><th>S2</th><th>S3</th><th>S4</th>
          <th>Coucher</th><th>Nuit préc.</th><th>Nb</th><th class="notes-col">Notes</th>
        </tr>
      </thead>
      <tbody>
        {#each data.entries as r, i}
          <tr>
            <td><a href="/app/babies/{data.baby.id}/day/{r.date}"><strong>{r.date}</strong></a></td>
            <td class="rating-cell">
              {#if r.nightRating === 'good'}<span class="rating rating-good" title="Bonne nuit"><CheckCircle size={16} weight="fill" /></span>
              {:else if r.nightRating === 'medium'}<span class="rating rating-medium" title="Nuit moyenne"><MinusCircle size={16} weight="fill" /></span>
              {:else if r.nightRating === 'bad'}<span class="rating rating-bad" title="Mauvaise nuit"><XCircle size={16} weight="fill" /></span>
              {/if}
            </td>
            <td>{totalNapsMin(r) > 0 ? formatDuration(totalNapsMin(r)) : ''}</td>
            <td>{r.wakeTime ?? ''}</td>
            <td>{r.nap1End ?? ''}</td>
            <td>{r.nap2End ?? ''}</td>
            <td>{r.nap3End ?? ''}</td>
            <td>{r.nap4End ?? ''}</td>
            <td>{r.bedtime ?? ''}</td>
            <td>{prevNight(r, data.entries[i + 1])}</td>
            <td>{napCount(r)}</td>
            <td class="notes-cell">{r.notes ?? ''}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if data.totalPages > 1}
    <nav class="pager">
      {#if data.page > 1}
        <a class="btn btn-ghost btn-sm" href="?from={data.from}&to={data.to}&page={data.page - 1}">‹ Précédent</a>
      {/if}
      <span class="tz-info">Page {data.page} / {data.totalPages}</span>
      {#if data.page < data.totalPages}
        <a class="btn btn-ghost btn-sm" href="?from={data.from}&to={data.to}&page={data.page + 1}">Suivant ›</a>
      {/if}
    </nav>
  {/if}
{/if}

<style>
  .rating-cell { text-align: center; }
  .rating { display: inline-flex; line-height: 0; }
  .rating-good   { color: var(--c-accent-sage); }
  .rating-medium { color: var(--c-accent-honey); }
  .rating-bad    { color: var(--c-danger); }

  /* The default 720px container is too narrow for this 12-column table.
     Widen `main` only while this page is mounted — Svelte scopes the rule
     to the component lifecycle. */
  :global(main:has(.history-card)) {
    max-width: min(1200px, 95vw);
  }
  .history-card {
    padding: 0;
    overflow-x: auto;   /* mobile fallback when the table still overflows */
  }
  /* Compact cells everywhere except Notes, which absorbs the remaining width. */
  .history-table th,
  .history-table td {
    padding: var(--s-2) var(--s-2);
    white-space: nowrap;
    font-feature-settings: "tnum" 1;
  }
  .history-table .notes-col,
  .history-table .notes-cell {
    white-space: normal;
    word-break: break-word;
    min-width: 12ch;
    width: 100%;        /* let this column absorb the rest of the row */
    font-feature-settings: normal;
  }

  .filter-row {
    display: flex;
    gap: var(--s-3);
    align-items: end;
    flex-wrap: wrap;
    margin-bottom: var(--s-4);
  }
  .filter-row .field { min-width: 140px; }
  .pager {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-4);
    margin-top: var(--s-4);
  }
</style>
