<script lang="ts">
  import type { DayMetrics } from '$lib/calendar';
  import DayCell from './DayCell.svelte';

  type Props = {
    cells: DayMetrics[];
    babyId: number;
    onSelect?: (date: string) => void;
  };
  let { cells, babyId, onSelect }: Props = $props();

  const inMonthCells = $derived(cells.filter((c) => c.inMonth));
</script>

<ul class="cal-strip" aria-label="Liste des journées du mois">
  {#each inMonthCells as cell (cell.date)}
    <li><DayCell metrics={cell} {babyId} mode="strip" {onSelect} /></li>
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
