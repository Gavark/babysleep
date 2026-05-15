<script lang="ts">
  import ChartCanvas from '$lib/components/ChartCanvas.svelte';
  import { parseHHMM } from '$lib/time';
  import Sun from 'phosphor-svelte/lib/Sun';
  import Moon from 'phosphor-svelte/lib/Moon';
  import Bed from 'phosphor-svelte/lib/Bed';
  import Cloud from 'phosphor-svelte/lib/Cloud';
  import Coffee from 'phosphor-svelte/lib/Coffee';

  let { data } = $props();

  // Helper: HH:MM string → fractional hours (Number)
  function hhmmToHours(s: string | null | undefined): number | null {
    if (!s) return null;
    try { return parseHHMM(s) / 60; } catch { return null; }
  }

  // Helper: total nap minutes for an entry (start/end pairs)
  function dayNapMinutes(r: any): number | null {
    let total = 0;
    let hasAny = false;
    const pairs: [string | null, string | null][] = [
      [r.nap1Start, r.nap1End],
      [r.nap2Start, r.nap2End],
      [r.nap3Start, r.nap3End],
      [r.nap4Start, r.nap4End]
    ];
    for (const [s, e] of pairs) {
      if (s && e && /^\d{2}:\d{2}$/.test(s) && /^\d{2}:\d{2}$/.test(e)) {
        const dur = ((parseHHMM(e) - parseHHMM(s)) % 1440 + 1440) % 1440;
        total += dur;
        hasAny = true;
      }
    }
    return hasAny ? total : null;
  }

  function napCount(r: any): number {
    return [r.nap1End, r.nap2End, r.nap3End, r.nap4End].filter(Boolean).length;
  }

  // Compute previous-night duration for each entry using the previous chronological entry
  function prevNightHours(curr: any, prev: any | null): number | null {
    if (!prev || !curr.wakeTime || !prev.bedtime) return null;
    const [y1, m1, d1] = curr.date.split('-').map(Number);
    const [y2, m2, d2] = prev.date.split('-').map(Number);
    const dayDiff = (Date.UTC(y1, m1 - 1, d1) - Date.UTC(y2, m2 - 1, d2)) / 86400000;
    if (Math.round(dayDiff) !== 1) return null;
    const dur = ((parseHHMM(curr.wakeTime) - parseHHMM(prev.bedtime)) % 1440 + 1440) % 1440;
    return dur / 60;
  }

  // Build all chart data
  const labels = $derived(data.entries.map((e: any) => e.date));
  const wakeData = $derived(data.entries.map((e: any) => hhmmToHours(e.wakeTime)));
  const bedtimeData = $derived(data.entries.map((e: any) => hhmmToHours(e.bedtime)));
  const napTotalData = $derived(data.entries.map((e: any) => {
    const m = dayNapMinutes(e);
    return m === null ? null : m / 60;
  }));
  const napCountData = $derived(data.entries.map(napCount));
  const prevNightData = $derived(
    data.entries.map((e: any, i: number) => prevNightHours(e, i > 0 ? data.entries[i - 1] : null))
  );

  // Common Y-axis formatter for HH:MM time-of-day charts (0..24 hours)
  const timeOfDayOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        min: 0,
        max: 24,
        ticks: {
          stepSize: 2,
          callback: (v: number) => `${String(Math.floor(v)).padStart(2, '0')}:${String(Math.round((v % 1) * 60)).padStart(2, '0')}`
        }
      }
    }
  };

  const hourOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, title: { display: true, text: 'heures' } } }
  };

  const countOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };
</script>

<h1>Statistiques — {data.baby.name}</h1>

<form method="GET" class="period-selector">
  <div class="presets">
    <a class="tab" class:active={data.preset === '7'} href="?preset=7">7 jours</a>
    <a class="tab" class:active={data.preset === '14'} href="?preset=14">14 jours</a>
    <a class="tab" class:active={data.preset === '30'} href="?preset=30">30 jours</a>
    <a class="tab" class:active={data.preset === '90'} href="?preset=90">90 jours</a>
    <a class="tab" class:active={data.preset === 'all'} href="?preset=all">Tout</a>
  </div>
  <div class="custom">
    <label class="field"><span class="field-label">De</span>
      <input class="field-input" type="date" name="from" value={data.from} />
    </label>
    <label class="field"><span class="field-label">À</span>
      <input class="field-input" type="date" name="to" value={data.to} />
    </label>
    <input type="hidden" name="preset" value="custom" />
    <button type="submit" class="btn btn-secondary">Filtrer</button>
  </div>
</form>

<p class="tz-info">Fuseau : <strong>{data.effectiveTz}</strong> · Période : {data.from} → {data.to} · {data.entries.length} jour(s)</p>

{#if data.entries.length === 0}
  <p class="empty">Pas de données sur cette période.</p>
{:else}
  <section class="card chart-section">
    <h2><Sun size={18} /> Heure de réveil</h2>
    <ChartCanvas type="line"
      data={{ labels, datasets: [{ label: 'Réveil', data: wakeData, borderColor: 'rgba(201,122,93,1)', backgroundColor: 'rgba(201,122,93,0.18)', tension: 0.2, spanGaps: true }] }}
      options={timeOfDayOpts} />
  </section>

  <section class="card chart-section">
    <h2><Moon size={18} /> Heure de coucher</h2>
    <ChartCanvas type="line"
      data={{ labels, datasets: [{ label: 'Coucher', data: bedtimeData, borderColor: 'rgba(184,81,74,1)', backgroundColor: 'rgba(184,81,74,0.18)', tension: 0.2, spanGaps: true }] }}
      options={timeOfDayOpts} />
  </section>

  <section class="card chart-section">
    <h2><Bed size={18} /> Durée nuit précédente</h2>
    <ChartCanvas type="line"
      data={{ labels, datasets: [{ label: 'Nuit (h)', data: prevNightData, borderColor: 'rgba(122,154,135,1)', backgroundColor: 'rgba(122,154,135,0.18)', tension: 0.2, spanGaps: true }] }}
      options={hourOpts} />
  </section>

  <section class="card chart-section">
    <h2><Cloud size={18} /> Sommeil total de jour</h2>
    <ChartCanvas type="line"
      data={{ labels, datasets: [{ label: 'Jour (h)', data: napTotalData, borderColor: 'rgba(232,184,110,1)', backgroundColor: 'rgba(232,184,110,0.18)', tension: 0.2, spanGaps: true }] }}
      options={hourOpts} />
  </section>

  <section class="card chart-section">
    <h2><Coffee size={18} /> Nombre de siestes</h2>
    <ChartCanvas type="bar"
      data={{ labels, datasets: [{ label: 'Siestes', data: napCountData, backgroundColor: 'rgba(232,184,110,0.7)' }] }}
      options={countOpts} />
  </section>
{/if}

<style>
  .period-selector { display: flex; flex-direction: column; gap: var(--s-3); margin-bottom: var(--s-3); }
  .presets { display: flex; gap: var(--s-2); flex-wrap: wrap; }
  .custom { display: flex; gap: var(--s-3); align-items: end; flex-wrap: wrap; }
  .custom .field { min-width: 140px; }
  .chart-section { margin-bottom: var(--s-4); }
  .chart-section h2 { font-size: var(--fs-base); margin-bottom: var(--s-3); display: flex; align-items: center; gap: var(--s-2); }
</style>
