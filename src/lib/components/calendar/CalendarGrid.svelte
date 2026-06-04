<script lang="ts">
  import type { DayMetrics } from '$lib/calendar';
  import type { Locale } from '$lib/server/auth/locale';
  import DayCell from './DayCell.svelte';
  import * as m from '$paraglide/messages';

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

<table class="cal-grid" aria-label={m.calendar_grid_label()}>
  <thead>
    <tr>
      <th scope="col">{m.calendar_weekday_mon_short()}</th>
      <th scope="col">{m.calendar_weekday_tue_short()}</th>
      <th scope="col">{m.calendar_weekday_wed_short()}</th>
      <th scope="col">{m.calendar_weekday_thu_short()}</th>
      <th scope="col">{m.calendar_weekday_fri_short()}</th>
      <th scope="col">{m.calendar_weekday_sat_short()}</th>
      <th scope="col">{m.calendar_weekday_sun_short()}</th>
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
