<script lang="ts">
  import type { DayMetrics } from '$lib/calendar';
  import type { Locale } from '$lib/server/auth/locale';
  import DayCell from './DayCell.svelte';

  type Props = {
    cells: DayMetrics[];
    babyId: number;
    locale: Locale;
    onSelect?: (date: string) => void;
  };
  let { cells, babyId, locale, onSelect }: Props = $props();

  const weeks = $derived(
    Array.from({ length: Math.ceil(cells.length / 7) }, (_, i) => cells.slice(i * 7, i * 7 + 7))
  );
</script>

<table class="cal-grid" aria-label="Calendrier mensuel">
  <thead>
    <tr>
      <th scope="col">Lun</th>
      <th scope="col">Mar</th>
      <th scope="col">Mer</th>
      <th scope="col">Jeu</th>
      <th scope="col">Ven</th>
      <th scope="col">Sam</th>
      <th scope="col">Dim</th>
    </tr>
  </thead>
  <tbody>
    {#each weeks as week, weekIdx (weekIdx)}
      <tr>
        {#each week as cell (cell.date)}
          <td><DayCell metrics={cell} {babyId} mode="grid" {locale} {onSelect} /></td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .cal-grid {
    width: 100%;
    border-collapse: separate;
    border-spacing: var(--s-1);
    table-layout: fixed;
  }
  .cal-grid th {
    text-align: center;
    padding: var(--s-1) 0;
    font-size: var(--fs-xs);
    color: var(--c-text-muted);
    font-weight: 600;
  }
  .cal-grid td { padding: 0; vertical-align: top; }
</style>
