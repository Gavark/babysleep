<script lang="ts">
  import { goto } from '$app/navigation';
  import CalendarGrid from '$lib/components/calendar/CalendarGrid.svelte';
  import CalendarStrip from '$lib/components/calendar/CalendarStrip.svelte';
  import NightRatingPicker from '$lib/components/calendar/NightRatingPicker.svelte';
  import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
  import CaretRight from 'phosphor-svelte/lib/CaretRight';
  import { ageInMonths, formatDuration } from '$lib/sleep-calc';
  import { paramsForAge } from '$lib/age-params';
  import { formatDate, formatNumber } from '$lib/format';
  import { summarizeMonth } from '$lib/calendar';
  import * as m from '$paraglide/messages';

  let { data } = $props();

  let pickerDate = $state<string | null>(null);
  const pickerCell = $derived(
    pickerDate ? data.cells.find((c) => c.date === pickerDate) ?? null : null
  );

  const monthLabel = $derived(formatMonth(data.year, data.month));
  const prevHref = $derived(buildHref(data.year, data.month - 1));
  const nextHref = $derived(buildHref(data.year, data.month + 1));
  const todayHref = $derived(`/app/babies/${data.baby.id}/calendar`);

  const middleDate = $derived(`${data.year}-${String(data.month).padStart(2, '0')}-15`);
  const ageMonths = $derived(
    ageInMonths(
      data.baby.birthDate,
      data.baby.ageOverrideMonths ?? undefined,
      new Date(middleDate + 'T12:00:00Z')
    )
  );
  const ap = $derived(paramsForAge(ageMonths));
  const quotaTotalMin = $derived(Math.round((ap.daySleepH + ap.nightSleepH) * 60));
  const quotaDayMin = $derived(Math.round(ap.daySleepH * 60));
  const quotaNightMin = $derived(Math.round(ap.nightSleepH * 60));
  const summary = $derived(summarizeMonth(data.cells));

  function formatMonth(y: number, m: number): string {
    return formatDate(new Date(Date.UTC(y, m - 1, 15)), data.locale, {
      month: 'long', year: 'numeric', timeZone: 'UTC'
    });
  }
  function buildHref(y: number, m: number): string {
    let yy = y;
    let mm = m;
    if (mm < 1) { mm = 12; yy = yy - 1; }
    if (mm > 12) { mm = 1; yy = yy + 1; }
    return `/app/babies/${data.baby.id}/calendar?month=${yy}-${String(mm).padStart(2, '0')}`;
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.key === 'ArrowLeft')      { e.preventDefault(); goto(prevHref); }
    else if (e.key === 'ArrowRight'){ e.preventDefault(); goto(nextHref); }
    else if (e.key === 'Home')      { e.preventDefault(); goto(todayHref); }
  }
</script>

<svelte:window on:keydown={onKeydown} />

<h1>{m.calendar_title({ name: data.baby.name })}</h1>

<nav class="cal-nav" aria-label={m.calendar_nav_label()}>
  <a class="btn btn-ghost btn-sm" href={prevHref} aria-label={m.calendar_month_previous()}><CaretLeft size={16} /></a>
  <span class="month">{monthLabel}</span>
  <a class="btn btn-ghost btn-sm" href={nextHref} aria-label={m.calendar_month_next()}><CaretRight size={16} /></a>
  <a class="btn btn-secondary btn-sm today-btn" href={todayHref}>{m.app_nav_today()}</a>
</nav>

<section class="summary" aria-label={m.calendar_summary_label()}>
  <div class="tiles">
    <div><b>{summary.avgSleepMin === null ? '—' : formatDuration(summary.avgSleepMin)}</b><span>{m.calendar_summary_avg_sleep()}</span></div>
    <div><b>{summary.avgNaps === null ? '—' : formatNumber(summary.avgNaps, data.locale, { maximumFractionDigits: 1 })}</b><span>{m.calendar_summary_avg_naps()}</span></div>
    <div><b>{m.calendar_summary_good_days_value({ good: summary.goodDays, total: summary.completeDays })}</b><span>{m.calendar_summary_good_days()}</span></div>
  </div>
  <p class="quota">
    {m.calendar_legend_quota({
      months: ageMonths,
      total: formatDuration(quotaTotalMin),
      day: formatDuration(quotaDayMin),
      night: formatDuration(quotaNightMin)
    })}
  </p>
  <div class="legend" aria-label={m.calendar_legend_label()}>
    <span><i class="sw seg-night"></i>{m.calendar_legend_night()}</span>
    <span><i class="sw seg-nap"></i>{m.calendar_seg_nap()}</span>
    <span><i class="sw q-good"></i>{m.calendar_legend_good()}</span>
    <span><i class="sw q-ok"></i>{m.calendar_legend_ok()}</span>
    <span><i class="sw q-meh"></i>{m.calendar_legend_meh()}</span>
    <span><i class="sw q-bad"></i>{m.calendar_legend_bad()}</span>
    <span>{m.calendar_legend_partial()}</span>
  </div>
</section>

<div class="cal-desktop"><CalendarGrid cells={data.cells} babyId={data.baby.id} locale={data.locale} onSelect={(d) => pickerDate = d} /></div>
<div class="cal-mobile"><CalendarStrip cells={data.cells} babyId={data.baby.id} locale={data.locale} onSelect={(d) => pickerDate = d} /></div>

{#if pickerCell}
  <NightRatingPicker
    date={pickerCell.date}
    currentRating={pickerCell.nightRating}
    babyId={data.baby.id}
    locale={data.locale}
    onClose={() => pickerDate = null}
  />
{/if}

<style>
  .cal-nav {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    margin-bottom: var(--s-3);
    flex-wrap: wrap;
  }
  .cal-nav .month {
    font-weight: 600;
    font-size: var(--fs-lg);
    text-transform: capitalize;
    min-width: 160px;
    text-align: center;
  }
  .today-btn { margin-left: auto; }

  .cal-desktop { display: none; }
  .cal-mobile { display: block; }
  @media (min-width: 768px) {
    .cal-desktop { display: block; }
    .cal-mobile { display: none; }
  }

  .summary { margin-bottom: var(--s-3); }
  .tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--s-2); }
  .tiles div {
    background: var(--c-bg-card);
    border-radius: var(--r-md);
    padding: var(--s-2);
    text-align: center;
    box-shadow: var(--shadow-sm);
  }
  .tiles b { display: block; font-size: var(--fs-lg); font-feature-settings: "tnum" 1; }
  .tiles span { font-size: var(--fs-xs); color: var(--c-text-muted); }
  .quota { margin: var(--s-2) 0 var(--s-1); font-size: var(--fs-xs); color: var(--c-text-muted); }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-1) var(--s-3);
    font-size: var(--fs-xs);
    color: var(--c-text-muted);
  }
  .legend span { display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
  .sw { display: inline-block; width: 10px; height: 10px; border-radius: 2px; }
  .sw.seg-night { background: var(--c-cal-seg-night); }
  .sw.seg-nap { background: var(--c-cal-seg-nap); }
  .sw.q-good { background: var(--c-accent-sage); width: 4px; }
  .sw.q-ok { background: var(--c-accent-honey); width: 4px; }
  .sw.q-meh { background: var(--c-primary); width: 4px; }
  .sw.q-bad { background: var(--c-danger); width: 4px; }
</style>
