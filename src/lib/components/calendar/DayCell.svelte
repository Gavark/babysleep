<script lang="ts">
  import type { DayMetrics } from '$lib/calendar';
  import { heatmapClass } from '$lib/calendar';
  import type { Locale } from '$lib/server/auth/locale';
  import { formatDate } from '$lib/format';
  import { formatDuration } from '$lib/sleep-calc';
  import CheckCircle from 'phosphor-svelte/lib/CheckCircle';
  import MinusCircle from 'phosphor-svelte/lib/MinusCircle';
  import XCircle from 'phosphor-svelte/lib/XCircle';
  import * as m from '$paraglide/messages';

  type Props = {
    metrics: DayMetrics;
    babyId: number;
    mode: 'grid' | 'strip';
    locale: Locale;
    onSelect?: (date: string) => void;
  };
  let { metrics, babyId: _babyId, mode, locale, onSelect }: Props = $props();

  const dayNum = $derived(Number(metrics.date.slice(8, 10)));
  const dayLabel = $derived(formatLongDay(metrics.date));
  const dayShort = $derived(dayLabel.split(' ')[0].slice(0, 3));
  const totalStr = $derived(formatDuration(metrics.totalSleepMin));
  const pct = $derived(Math.round(metrics.ratio * 100));
  const ariaLabel = $derived(buildAriaLabel(metrics, dayLabel));
  const tooltipText = $derived(buildTooltip(metrics, dayLabel, pct));
  const badgeKind = $derived(metrics.nightRating);
  /** Under 70 % of the need on a complete day. */
  const low = $derived(metrics.isComplete && metrics.ratio < 0.7);
  const partial = $derived(metrics.hasAnyData && !metrics.isComplete);
  const totalText = $derived(metrics.hasAnyData ? (partial ? `${totalStr} *` : totalStr) : '');

  function formatLongDay(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return formatDate(new Date(Date.UTC(y, m - 1, d)), locale, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
    });
  }

  function buildAriaLabel(metrics: DayMetrics, day: string): string {
    if (!metrics.hasAnyData) return `${day} — ${m.calendar_cell_no_data()}`;
    const parts = [day, m.calendar_cell_total_sleep({ duration: formatDuration(metrics.totalSleepMin) })];
    if (metrics.isComplete) parts.push(m.calendar_cell_pct_of_quota({ pct: Math.round(metrics.ratio * 100) }));
    else parts.push(m.calendar_cell_incomplete());
    return parts.join(' — ');
  }

  function buildTooltip(metrics: DayMetrics, day: string, pctVal: number): string {
    if (!metrics.hasAnyData) return `${day} — ${m.calendar_cell_no_data()}`;
    const bits: string[] = [day];
    if (metrics.wakeTime) bits.push(m.calendar_cell_wake_prefix({ time: metrics.wakeTime }));
    bits.push(m.today_page_meta_naps({ count: metrics.napCount }));
    if (metrics.bedtime) bits.push(m.calendar_cell_bedtime_prefix({ time: metrics.bedtime }));
    const totalPart = m.calendar_cell_total_prefix({ duration: formatDuration(metrics.totalSleepMin) });
    bits.push(`${totalPart}${metrics.isComplete ? m.calendar_cell_pct_suffix({ pct: pctVal }) : ''}`);
    return bits.join(' · ');
  }
</script>

{#if !metrics.inMonth}
  <div class="cell padding" aria-hidden="true">
    <span class="num">{dayNum}</span>
  </div>
{:else}
  <button
    type="button"
    class="cell {heatmapClass(metrics.heatLevel)} {metrics.isToday ? 'today' : ''} mode-{mode}"
    onclick={() => onSelect?.(metrics.date)}
    aria-label={ariaLabel}
    title={tooltipText}
  >
    {#if mode === 'strip'}
      <span class="num">{dayNum}<small>{dayShort}</small></span>
      <span class="rating" aria-hidden="true">{@render rating(20)}</span>
      <span class="timeline" class:empty={!metrics.hasAnyData} aria-hidden="true">{@render segments()}</span>
      <span class="total" class:low class:partial>{totalText}</span>
    {:else}
      <span class="num">{dayNum}<span class="rating" aria-hidden="true">{@render rating(16)}</span></span>
      <span class="timeline" class:empty={!metrics.hasAnyData} aria-hidden="true">{@render segments()}</span>
      {#if metrics.hasAnyData}<span class="total" class:low class:partial>{totalText}</span>{/if}
    {/if}
  </button>
{/if}

{#snippet rating(size: number)}
  {#if badgeKind === 'good'}<span class="rate good"><CheckCircle {size} weight="fill" /></span>
  {:else if badgeKind === 'medium'}<span class="rate medium"><MinusCircle {size} weight="fill" /></span>
  {:else if badgeKind === 'bad'}<span class="rate bad"><XCircle {size} weight="fill" /></span>
  {/if}
{/snippet}

{#snippet segments()}
  {#each metrics.segments as s (s.startMin)}
    <span
      class="seg {s.kind}"
      style="left: {(s.startMin / 1440) * 100}%; width: {((s.endMin - s.startMin) / 1440) * 100}%"
    ></span>
  {/each}
{/snippet}

<style>
  /* The day's quality (share of the sleep need) is a thin bar, so the
     background stays neutral and the night rating keeps its own colours. */
  .cell {
    --q: var(--c-border);
    display: block;
    width: 100%;
    border: 1px solid var(--c-border);
    border-left: 4px solid var(--q);
    border-radius: var(--r-md);
    background: var(--c-bg-card);
    color: var(--c-text);
    text-decoration: none;
    padding: var(--s-2);
    min-height: 90px;
    font-size: var(--fs-xs);
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    transition: filter 0.15s;
  }
  button.cell { -webkit-tap-highlight-color: transparent; }
  .cell.padding {
    opacity: 0.35;
    pointer-events: none;
    background: transparent;
  }
  .cell:hover { filter: brightness(0.97); }
  .cell.today { outline: 2px solid var(--c-primary); outline-offset: -2px; }
  .heat-good { --q: var(--c-accent-sage); }
  .heat-ok   { --q: var(--c-accent-honey); }
  .heat-meh  { --q: var(--c-primary); }
  .heat-bad  { --q: var(--c-danger); }

  .num { font-weight: 600; font-size: var(--fs-sm); display: flex; justify-content: space-between; align-items: center; }
  .num small { font-weight: 400; font-size: var(--fs-xs); color: var(--c-text-muted); margin-left: var(--s-1); }

  /* Not `.badge`: that global class adds a pill background. */
  .rating { display: inline-flex; align-items: center; justify-content: center; line-height: 0; }
  .rate { display: inline-flex; line-height: 0; }
  .rate :global(svg) { display: block; }
  .rate.good   { color: var(--c-accent-sage); }
  .rate.medium { color: var(--c-accent-honey); }
  .rate.bad    { color: var(--c-danger); }

  /* 24 h ribbon with a faint mark every 6 hours. */
  .timeline {
    position: relative;
    display: block;
    height: 14px;
    margin-top: var(--s-1);
    border-radius: 3px;
    overflow: hidden;
    background:
      linear-gradient(90deg, transparent calc(25% - 0.5px), var(--c-border) calc(25% - 0.5px), var(--c-border) calc(25% + 0.5px), transparent calc(25% + 0.5px),
        transparent calc(50% - 0.5px), var(--c-border) calc(50% - 0.5px), var(--c-border) calc(50% + 0.5px), transparent calc(50% + 0.5px),
        transparent calc(75% - 0.5px), var(--c-border) calc(75% - 0.5px), var(--c-border) calc(75% + 0.5px), transparent calc(75% + 0.5px)),
      var(--c-bg-muted);
  }
  /* Days without data: no hour marks, so the month reads at a glance. */
  .timeline.empty { background: var(--c-bg-muted); }
  .seg { position: absolute; top: 1px; bottom: 1px; border-radius: 2px; }
  .seg.nap { background: var(--c-cal-seg-nap); }
  .seg.night { background: var(--c-cal-seg-night); }

  .total { display: block; text-align: center; font-weight: 600; color: var(--c-text); margin-top: var(--s-1); font-size: var(--fs-xs); font-feature-settings: "tnum" 1; }
  .total.low { color: var(--c-danger); }
  .total.partial { color: var(--c-text-muted); font-weight: 400; }

  /* Columns shared with the hour axis in CalendarStrip. */
  .cell.mode-strip {
    display: grid;
    grid-template-columns: 44px 20px 1fr 52px;
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
