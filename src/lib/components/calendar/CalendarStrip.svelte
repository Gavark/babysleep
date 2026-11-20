<script lang="ts">
  import { groupByWeek, type DayMetrics } from '#lib/calendar.ts';
  import type { Locale } from '#lib/server/auth/locale.ts';
  import { formatDate } from '#lib/format.ts';
  import { formatDuration } from '#lib/sleep-calc.ts';
  import DayCell from './DayCell.svelte';
  import * as m from '#paraglide/messages.js';

  type Props = {
    cells: DayMetrics[];
    babyId: number;
    locale: Locale;
    onSelect?: (date: string) => void;
  };
  let { cells, babyId, locale, onSelect }: Props = $props();

  const weeks = $derived(groupByWeek(cells));

  function weekLabel(iso: string): string {
    const [y, mo, d] = iso.split('-').map(Number);
    const date = formatDate(new Date(Date.UTC(y, mo - 1, d)), locale, {
      day: 'numeric', month: 'short', timeZone: 'UTC'
    });
    return m.calendar_week_of({ date });
  }
</script>

<!-- Hour axis, on the same columns as the day rows (DayCell, strip mode). -->
<div class="axis" aria-hidden="true">
  <span></span><span></span>
  <span class="hours">{#each [0, 6, 12, 18, 24] as h (h)}<span style="left: {(h / 24) * 100}%">{h}h</span>{/each}</span>
  <span></span>
</div>

<ol class="cal-strip" aria-label={m.calendar_strip_label()}>
  {#each weeks as week (week.weekStart)}
    <li class="week">
      <h2 class="week-head">
        <span>{weekLabel(week.weekStart)}</span>
        {#if week.avgSleepMin !== null}<span>{m.calendar_week_avg({ duration: formatDuration(week.avgSleepMin) })}</span>{/if}
      </h2>
      <ul>
        {#each week.days as cell (cell.date)}
          <li><DayCell metrics={cell} {babyId} mode="strip" {locale} {onSelect} /></li>
        {/each}
      </ul>
    </li>
  {/each}
</ol>

<style>
  .axis {
    position: sticky;
    top: 0;
    z-index: 1;
    display: grid;
    grid-template-columns: 44px 20px 1fr 52px;
    gap: var(--s-2);
    /* 4px quality border + 1px right border + row padding. */
    padding: var(--s-1) calc(var(--s-3) + 1px) var(--s-1) calc(var(--s-3) + 4px);
    background: var(--c-bg-app);
    font-size: var(--fs-xs);
    color: var(--c-text-muted);
    font-feature-settings: "tnum" 1;
  }
  /* Each label centred on its hour mark; the ends stay inside the ribbon. */
  .hours { position: relative; height: 1.4em; }
  .hours span { position: absolute; transform: translateX(-50%); }
  .hours span:first-child { transform: none; }
  .hours span:last-child { transform: translateX(-100%); }
  .cal-strip { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--s-3); }
  .week-head {
    display: flex;
    line-height: 1.5;
    justify-content: space-between;
    margin: 0 0 var(--s-1);
    padding: 0 var(--s-1);
    font-size: var(--fs-xs);
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--c-text-muted);
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--s-1);
  }
  li { margin: 0; }
</style>
