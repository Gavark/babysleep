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

  const inMonthCells = $derived(cells.filter((c) => c.inMonth));
</script>

<ul class="cal-strip" aria-label={m.calendar_strip_label()}>
  {#each inMonthCells as cell (cell.date)}
    <li><DayCell metrics={cell} {babyId} mode="strip" {locale} {onSelect} /></li>
  {/each}
</ul>

<style>
  .cal-strip {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--s-1);
  }
</style>
