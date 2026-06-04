<script lang="ts">
  import { goto } from '$app/navigation';
  import CalendarGrid from '$lib/components/calendar/CalendarGrid.svelte';
  import CalendarStrip from '$lib/components/calendar/CalendarStrip.svelte';
  import NightRatingPicker from '$lib/components/calendar/NightRatingPicker.svelte';
  import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
  import CaretRight from 'phosphor-svelte/lib/CaretRight';
  import { ageInMonths, formatDuration } from '$lib/sleep-calc';
  import { paramsForAge } from '$lib/age-params';
  import { formatDate } from '$lib/format';
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

<footer class="cal-legend" aria-label={m.calendar_legend_label()}>
  <p class="legend-quota">
    {m.calendar_legend_quota({
      months: ageMonths,
      total: formatDuration(quotaTotalMin),
      day: formatDuration(quotaDayMin),
      night: formatDuration(quotaNightMin)
    })}
  </p>

  <p class="legend-label">{m.calendar_legend_heatmap_label()}</p>
  <div class="legend-row">
    <span class="legend-item"><span class="swatch heat-good"></span>{m.calendar_heat_good()}</span>
    <span class="legend-item"><span class="swatch heat-ok"></span>{m.calendar_heat_ok()}</span>
    <span class="legend-item"><span class="swatch heat-meh"></span>{m.calendar_heat_meh()}</span>
    <span class="legend-item"><span class="swatch heat-bad"></span>{m.calendar_heat_bad()}</span>
    <span class="legend-item"><span class="swatch heat-none"></span>{m.calendar_heat_none()}</span>
    <span class="legend-item"><span class="swatch heat-partial"></span>{m.calendar_heat_partial()}</span>
  </div>

  <p class="legend-label">{m.calendar_legend_segments_label()}</p>
  <div class="legend-row">
    <span class="legend-item"><span class="swatch seg-nap"></span>{m.calendar_seg_nap()}</span>
    <span class="legend-item"><span class="swatch seg-night"></span>{m.calendar_seg_night()}</span>
  </div>
</footer>

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

  .cal-legend {
    margin-top: var(--s-4);
    padding: var(--s-3);
    background: var(--c-bg-muted);
    border-radius: var(--r-md);
    font-size: var(--fs-xs);
    color: var(--c-text-muted);
  }
  .legend-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-2);
    align-items: center;
    margin-bottom: var(--s-2);
  }
  .swatch {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 3px;
    border: 1px solid var(--c-border);
  }
  .swatch.heat-good    { background: var(--c-cal-heat-good); }
  .swatch.heat-ok      { background: var(--c-cal-heat-ok); }
  .swatch.heat-meh     { background: var(--c-cal-heat-meh); }
  .swatch.heat-bad     { background: var(--c-cal-heat-bad); }
  .swatch.heat-none    { background: var(--c-cal-heat-none); }
  .swatch.heat-partial { background: transparent; border-style: dashed; }
  .swatch.seg-nap      { background: var(--c-cal-seg-nap); border-color: var(--c-cal-seg-nap); }
  .swatch.seg-night    { background: var(--c-cal-seg-night); border-color: var(--c-cal-seg-night); }
  .legend-item { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  .legend-quota {
    margin: 0 0 var(--s-2);
    font-size: var(--fs-sm);
    color: var(--c-text);
  }
  .legend-label {
    margin: var(--s-1) 0 var(--s-1);
    font-weight: 600;
    color: var(--c-text);
    font-size: var(--fs-xs);
  }
</style>
