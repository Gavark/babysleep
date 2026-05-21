<script lang="ts">
  import type { DayMetrics } from '$lib/calendar';
  import { heatmapClass } from '$lib/calendar';
  import { formatDuration } from '$lib/sleep-calc';

  type Props = {
    metrics: DayMetrics;
    babyId: number;
    mode: 'grid' | 'strip';
  };
  let { metrics, babyId, mode }: Props = $props();

  const dayNum = $derived(Number(metrics.date.slice(8, 10)));
  const dayLabel = $derived(formatLongDay(metrics.date));
  const dayShort = $derived(dayLabel.split(' ')[0].slice(0, 3));
  const totalStr = $derived(formatDuration(metrics.totalSleepMin));
  const pct = $derived(Math.round(metrics.ratio * 100));
  const ariaLabel = $derived(buildAriaLabel(metrics, dayLabel));
  const tooltipText = $derived(buildTooltip(metrics, dayLabel, pct));

  function formatLongDay(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
    });
  }

  function buildAriaLabel(m: DayMetrics, day: string): string {
    if (!m.hasAnyData) return `${day} — aucune donnée`;
    const parts = [day, `${formatDuration(m.totalSleepMin)} de sommeil`];
    if (m.isComplete) parts.push(`${Math.round(m.ratio * 100)} pourcent du quota recommandé`);
    else parts.push('journée incomplète');
    return parts.join(' — ');
  }

  function buildTooltip(m: DayMetrics, day: string, pctVal: number): string {
    if (!m.hasAnyData) return `${day} — aucune donnée`;
    const bits: string[] = [day];
    if (m.wakeTime) bits.push(`Lever ${m.wakeTime}`);
    bits.push(`${m.napCount} sieste${m.napCount > 1 ? 's' : ''}`);
    if (m.bedtime) bits.push(`Coucher ${m.bedtime}`);
    bits.push(`Total ${formatDuration(m.totalSleepMin)}${m.isComplete ? ` (${pctVal}% du quota)` : ''}`);
    return bits.join(' · ');
  }
</script>

{#if !metrics.inMonth}
  <div class="cell padding" aria-hidden="true">
    <span class="num">{dayNum}</span>
  </div>
{:else}
  <a
    class="cell {heatmapClass(metrics.heatLevel)} {metrics.isToday ? 'today' : ''} mode-{mode}"
    href="/app/babies/{babyId}/day/{metrics.date}"
    aria-label={ariaLabel}
    title={tooltipText}
  >
    {#if mode === 'strip'}
      <span class="num">{dayNum}<small>{dayShort}</small></span>
      <span class="timeline" aria-hidden="true">
        {#each metrics.segments as s (s.startMin)}
          <span
            class="seg {s.kind}"
            style="left: {(s.startMin / 1440) * 100}%; width: {((s.endMin - s.startMin) / 1440) * 100}%"
          ></span>
        {/each}
      </span>
      <span class="total">{metrics.hasAnyData ? totalStr : ''}</span>
    {:else}
      <span class="num">{dayNum}{#if !metrics.isComplete && metrics.hasAnyData}<span class="partial-mark" aria-hidden="true">…</span>{/if}</span>
      <span class="timeline" aria-hidden="true">
        {#each metrics.segments as s (s.startMin)}
          <span
            class="seg {s.kind}"
            style="left: {(s.startMin / 1440) * 100}%; width: {((s.endMin - s.startMin) / 1440) * 100}%"
          ></span>
        {/each}
      </span>
      {#if metrics.hasAnyData}<span class="total">{totalStr}</span>{/if}
    {/if}
  </a>
{/if}

<style>
  .cell {
    display: block;
    border: 1px solid var(--c-border);
    border-radius: var(--r-md);
    background: var(--c-cal-heat-none);
    color: var(--c-text);
    text-decoration: none;
    padding: var(--s-2);
    min-height: 90px;
    font-size: var(--fs-xs);
    transition: filter 0.15s;
  }
  .cell.padding {
    opacity: 0.35;
    pointer-events: none;
  }
  .cell:hover { filter: brightness(0.97); }
  .cell.today { outline: 2px solid var(--c-primary); outline-offset: -2px; }
  .heat-good { background: var(--c-cal-heat-good); }
  .heat-ok   { background: var(--c-cal-heat-ok); }
  .heat-meh  { background: var(--c-cal-heat-meh); }
  .heat-bad  { background: var(--c-cal-heat-bad); }
  .heat-partial { background: transparent; }
  .heat-none { background: var(--c-cal-heat-none); }

  .num { font-weight: 600; font-size: var(--fs-sm); display: flex; justify-content: space-between; align-items: baseline; }
  .num small { font-weight: 400; font-size: var(--fs-xs); opacity: 0.6; margin-left: var(--s-1); }
  .partial-mark { font-weight: 400; opacity: 0.6; }

  .timeline { position: relative; display: block; height: 14px; margin-top: var(--s-1); background: rgba(0,0,0,0.05); border-radius: 3px; overflow: hidden; }
  .seg { position: absolute; top: 1px; bottom: 1px; border-radius: 2px; }
  .seg.nap { background: var(--c-cal-seg-nap); }
  .seg.night { background: var(--c-cal-seg-night); }

  .total { display: block; text-align: center; font-weight: 600; color: var(--c-primary); margin-top: var(--s-1); font-size: var(--fs-xs); }

  .cell.mode-strip {
    display: grid;
    grid-template-columns: 56px 1fr 56px;
    align-items: center;
    gap: var(--s-2);
    min-height: 0;
    padding: var(--s-2) var(--s-3);
  }
  .cell.mode-strip .num { display: block; }
  .cell.mode-strip .timeline { height: 16px; margin: 0; }
  .cell.mode-strip .total { margin: 0; text-align: right; }

  @media (prefers-reduced-motion: reduce) {
    .cell { transition: none; }
  }
</style>
