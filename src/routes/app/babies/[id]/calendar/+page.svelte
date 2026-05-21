<script lang="ts">
  import { goto } from '$app/navigation';
  import CalendarGrid from '$lib/components/calendar/CalendarGrid.svelte';
  import CalendarStrip from '$lib/components/calendar/CalendarStrip.svelte';
  import CaretLeft from 'phosphor-svelte/lib/CaretLeft';
  import CaretRight from 'phosphor-svelte/lib/CaretRight';
  import { ageInMonths, formatDuration } from '$lib/sleep-calc';
  import { paramsForAge } from '$lib/age-params';

  let { data } = $props();

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
    return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString('fr-FR', {
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

<h1>Calendrier — {data.baby.name}</h1>

<nav class="cal-nav" aria-label="Navigation mensuelle">
  <a class="btn btn-ghost btn-sm" href={prevHref} aria-label="Mois précédent"><CaretLeft size={16} /></a>
  <span class="month">{monthLabel}</span>
  <a class="btn btn-ghost btn-sm" href={nextHref} aria-label="Mois suivant"><CaretRight size={16} /></a>
  <a class="btn btn-secondary btn-sm today-btn" href={todayHref}>Aujourd'hui</a>
</nav>

<div class="cal-desktop"><CalendarGrid cells={data.cells} babyId={data.baby.id} /></div>
<div class="cal-mobile"><CalendarStrip cells={data.cells} babyId={data.baby.id} /></div>

<footer class="cal-legend" aria-label="Légende">
  <div class="legend-row">
    <span class="swatch heat-good"></span><span>≥ 90%</span>
    <span class="swatch heat-ok"></span><span>70-90%</span>
    <span class="swatch heat-meh"></span><span>50-70%</span>
    <span class="swatch heat-bad"></span><span>&lt; 50%</span>
  </div>
  <div class="legend-row">
    <span class="swatch seg-nap"></span><span>Sieste</span>
    <span class="swatch seg-night"></span><span>Nuit</span>
  </div>
  <p class="legend-info">
    Âge à la date du mois : {ageMonths} mois — Quota recommandé : {formatDuration(quotaTotalMin)}
    ({formatDuration(quotaDayMin)} siestes + {formatDuration(quotaNightMin)} nuit)
  </p>
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
  .swatch.heat-good { background: var(--c-cal-heat-good); }
  .swatch.heat-ok   { background: var(--c-cal-heat-ok); }
  .swatch.heat-meh  { background: var(--c-cal-heat-meh); }
  .swatch.heat-bad  { background: var(--c-cal-heat-bad); }
  .swatch.seg-nap   { background: var(--c-cal-seg-nap); border-color: var(--c-cal-seg-nap); }
  .swatch.seg-night { background: var(--c-cal-seg-night); border-color: var(--c-cal-seg-night); }
  .legend-info { margin: 0; font-size: var(--fs-xs); }
</style>
