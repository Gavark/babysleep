<script lang="ts">
  import ChartCanvas from '$lib/components/ChartCanvas.svelte';
  import { parseHHMM } from '$lib/time';
  import { dayNapMinutes, napCount, aggregateByRank, napSeriesByRank, maxNapRank } from '$lib/naps';
  import Sun from 'phosphor-svelte/lib/Sun';
  import Moon from 'phosphor-svelte/lib/Moon';
  import Bed from 'phosphor-svelte/lib/Bed';
  import Cloud from 'phosphor-svelte/lib/Cloud';
  import Coffee from 'phosphor-svelte/lib/Coffee';
  import * as m from '$paraglide/messages';
  import {
    seriesStats, toNightHours, axisRange, tickStep, formatDayMonth, formatFullDate, rollingMean
  } from '$lib/charts/transforms';

  let { data } = $props();

  // Helper: HH:MM string → fractional hours (Number)
  function hhmmToHours(s: string | null | undefined): number | null {
    if (!s) return null;
    try { return parseHHMM(s) / 60; } catch { return null; }
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

  // data.locale comes from +layout.server.ts. Do NOT read
  // document.documentElement.lang — src/app.html hardcodes lang="fr".
  const locale = $derived(data.locale ?? 'fr');
  const isoDates = $derived(data.entries.map((e: any) => e.date));
  const labels = $derived(isoDates.map((d: string) => formatDayMonth(d, locale)));
  const dense = $derived(labels.length > 30);

  // Build all chart data
  const wakeData = $derived(data.entries.map((e: any) => hhmmToHours(e.wakeTime)));
  const bedtimeData = $derived(data.entries.map((e: any) => hhmmToHours(e.bedtime)));
  // Bedtimes are plotted on a night-continuous axis so 00:30 sits ABOVE 23:30
  // instead of dropping to the bottom of the plot. decimalToHHMM already
  // normalises with % 1440, so 24.5 renders as "00:30" in ticks and tooltips.
  const bedtimeNight = $derived(bedtimeData.map((v: number | null) => (v === null ? null : toNightHours(v))));
  const napTotalData = $derived(data.entries.map((e: any) => {
    const mins = dayNapMinutes(e);
    return mins === null ? null : mins / 60;
  }));
  const napCountData = $derived(data.entries.map(napCount));
  const rankAgg = $derived(aggregateByRank(data.entries));
  // The day count rides in the tick label: over a period spanning a rhythm
  // change, a rank averaged over 4 days must not read as a peer of one
  // averaged over 90. No rank is hidden.
  const rankLabels = $derived(
    rankAgg.map((r) => m.stats_chart_nap_rank_tick({ n: r.rank, days: r.days }))
  );
  const rankAvgHours = $derived(rankAgg.map((r) => r.avgMin / 60));
  const prevNightData = $derived(
    data.entries.map((e: any, i: number) => prevNightHours(e, i > 0 ? data.entries[i - 1] : null))
  );

  const EMPTY = m.today_value_empty();

  function decimalToHHMM(v: number | null | undefined): string {
    if (v === null || v === undefined || !Number.isFinite(v)) return EMPTY;
    const totalMin = Math.round(v * 60);
    const safeMin = ((totalMin % 1440) + 1440) % 1440;
    const h = Math.floor(safeMin / 60);
    const mm = safeMin % 60;
    return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }

  function decimalToDuration(v: number | null | undefined): string {
    if (v === null || v === undefined || !Number.isFinite(v)) return EMPTY;
    const totalMin = Math.max(0, Math.round(v * 60));
    const h = Math.floor(totalMin / 60);
    const mm = totalMin % 60;
    if (h === 0) return m.stats_chart_minutes_short({ min: mm });
    if (mm === 0) return m.stats_chart_hours_short({ h });
    return m.stats_chart_hours_minutes_short({ h, mm: String(mm).padStart(2, '0') });
  }

  // Screen readers get numbers, which the page provides nowhere else.
  function ariaFor(name: string, values: (number | null)[], fmt: (v: number) => string): string {
    const s = seriesStats(values);
    if (!s) return m.stats_chart_aria_empty({ name });
    return m.stats_chart_aria_series({
      name,
      from: data.from,
      to: data.to,
      min: fmt(s.min),
      avg: fmt(s.avg),
      max: fmt(s.max)
    });
  }

  // Shared x-axis config: Chart.js thins the labels itself, so 90-day and
  // all-time presets stay legible without manual sampling.
  const xAxis = $derived({
    ticks: { maxRotation: 0, autoSkip: true, autoSkipPadding: 12 }
  });

  const dateTooltipTitle = $derived((items: any[]) =>
    formatFullDate(isoDates[items[0].dataIndex], locale)
  );

  function timeOfDayOpts(values: (number | null)[], x: any, title: any) {
    const { min, max } = axisRange(values);
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title,
            label: (ctx: any) => `${ctx.dataset.label}: ${decimalToHHMM(ctx.parsed.y)}`
          }
        }
      },
      scales: {
        x,
        y: { min, max, ticks: { stepSize: tickStep(min, max), callback: (v: any) => decimalToHHMM(Number(v)) } }
      }
    };
  }

  const wakeOpts = $derived(timeOfDayOpts(wakeData, xAxis, dateTooltipTitle));
  const bedtimeOpts = $derived(timeOfDayOpts(bedtimeNight, xAxis, dateTooltipTitle));

  const hourOpts = $derived({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: dateTooltipTitle,
          label: (ctx: any) => `${ctx.dataset.label}: ${decimalToDuration(ctx.parsed.y)}`
        }
      }
    },
    scales: {
      x: xAxis,
      y: {
        beginAtZero: true,
        title: { display: true, text: m.stats_chart_axis_duration() },
        ticks: { callback: (v: any) => decimalToDuration(Number(v)) }
      }
    }
  });

  const countOpts = $derived({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { title: dateTooltipTitle, label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}` }
      }
    },
    scales: { x: xAxis, y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  });

  const rankOpts = $derived({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => [
            `${decimalToDuration(ctx.parsed.y)}`,
            m.stats_chart_nap_rank_tooltip({ days: rankAgg[ctx.dataIndex].days })
          ]
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: m.stats_chart_axis_duration() },
        ticks: { callback: (v: any) => decimalToDuration(Number(v)) }
      }
    }
  });

  const line = (token: string, label: string, values: (number | null)[]) => ({
    label,
    token,
    data: values,
    borderWidth: 2,
    tension: 0.2,
    spanGaps: true,
    pointRadius: dense ? 0 : 3,
    pointHoverRadius: 5
  });

  // Below 15 days there are too few points for a 7-day window to mean
  // anything, so raw values are shown. The caption always says which.
  const smoothed = $derived(data.entries.length > 14);

  const trendSeries = $derived(
    Array.from({ length: maxNapRank(data.entries) }, (_, i) => {
      const raw = napSeriesByRank(data.entries, i + 1);
      return {
        rank: i + 1,
        values: smoothed ? rollingMean(raw, 7, 4) : raw
      };
    })
  );

  const trendDatasets = $derived(
    trendSeries.map((s) => ({
      label: m.stats_chart_label_nap_rank({ n: s.rank }),
      data: s.values.map((v) => (v === null ? null : v / 60)),
      token: `nap-${s.rank}`,
      borderWidth: 2,
      tension: 0.2,
      spanGaps: false, // a gap is real missing data — do not bridge it
      pointRadius: dense ? 0 : 3,
      pointHoverRadius: 5
    }))
  );

  const trendOpts = $derived({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: {
        callbacks: {
          title: dateTooltipTitle,
          label: (ctx: any) => `${ctx.dataset.label}: ${decimalToDuration(ctx.parsed.y)}`
        }
      }
    },
    scales: {
      x: xAxis,
      y: {
        beginAtZero: true,
        title: { display: true, text: m.stats_chart_axis_duration() },
        ticks: { callback: (v: any) => decimalToDuration(Number(v)) }
      }
    }
  });

  // The aria summary describes the longest-running rank; per-rank detail is
  // already available in the bar chart above.
  const trendAriaValues = $derived(trendSeries[0]?.values ?? []);
</script>

<h1>{m.stats_title({ name: data.baby.name })}</h1>

<form method="GET" class="period-selector">
  <div class="presets">
    <a class="tab" class:active={data.preset === '7'} href="?preset=7">{m.stats_period_preset_7()}</a>
    <a class="tab" class:active={data.preset === '14'} href="?preset=14">{m.stats_period_preset_14()}</a>
    <a class="tab" class:active={data.preset === '30'} href="?preset=30">{m.stats_period_preset_30()}</a>
    <a class="tab" class:active={data.preset === '90'} href="?preset=90">{m.stats_period_preset_90()}</a>
    <a class="tab" class:active={data.preset === 'all'} href="?preset=all">{m.stats_period_preset_all()}</a>
  </div>
  <div class="custom">
    <label class="field"><span class="field-label">{m.stats_period_from()}</span>
      <input class="field-input" type="date" name="from" value={data.from} />
    </label>
    <label class="field"><span class="field-label">{m.stats_period_to()}</span>
      <input class="field-input" type="date" name="to" value={data.to} />
    </label>
    <input type="hidden" name="preset" value="custom" />
    <button type="submit" class="btn btn-secondary">{m.common_btn_filter()}</button>
  </div>
</form>

<p class="tz-info">{m.stats_period_info({ tz: data.effectiveTz, from: data.from, to: data.to, count: data.entries.length })}</p>

{#if data.entries.length === 0}
  <p class="empty">{m.stats_empty()}</p>
{:else}
  <section class="card chart-section">
    <h2><Sun size={18} /> {m.stats_charts_wake_time()}</h2>
    <ChartCanvas type="line"
      data={{ labels, datasets: [line('wake', m.stats_chart_label_wake(), wakeData)] }}
      options={wakeOpts}
      ariaLabel={ariaFor(m.stats_charts_wake_time(), wakeData, decimalToHHMM)} />
  </section>

  <section class="card chart-section">
    <h2><Moon size={18} /> {m.stats_charts_bedtime()}</h2>
    <ChartCanvas type="line"
      data={{ labels, datasets: [line('bedtime', m.stats_chart_label_bedtime(), bedtimeNight)] }}
      options={bedtimeOpts}
      ariaLabel={ariaFor(m.stats_charts_bedtime(), bedtimeData, decimalToHHMM)} />
  </section>

  <section class="card chart-section">
    <h2><Bed size={18} /> {m.stats_charts_prev_night_hours()}</h2>
    <ChartCanvas type="line"
      data={{ labels, datasets: [line('night', m.stats_chart_label_night_hours(), prevNightData)] }}
      options={hourOpts}
      ariaLabel={ariaFor(m.stats_charts_prev_night_hours(), prevNightData, decimalToDuration)} />
  </section>

  <section class="card chart-section">
    <h2><Cloud size={18} /> {m.stats_charts_nap_total_hours()}</h2>
    <ChartCanvas type="line"
      data={{ labels, datasets: [line('nap', m.stats_chart_label_day_hours(), napTotalData)] }}
      options={hourOpts}
      ariaLabel={ariaFor(m.stats_charts_nap_total_hours(), napTotalData, decimalToDuration)} />
  </section>

  <section class="card chart-section">
    <h2><Coffee size={18} /> {m.stats_charts_naps_count()}</h2>
    <ChartCanvas type="bar"
      data={{ labels, datasets: [{ label: m.stats_chart_label_naps(), data: napCountData, token: 'nap', fillAlpha: 0.7, borderRadius: 4 }] }}
      options={countOpts}
      ariaLabel={ariaFor(m.stats_charts_naps_count(), napCountData, (v) => String(Math.round(v)))} />
  </section>

  <section class="card chart-section">
    <h2><Coffee size={18} /> {m.stats_charts_nap_avg_by_rank()}</h2>
    {#if rankAgg.length === 0}
      <p class="chart-note">{m.stats_chart_nap_rank_empty()}</p>
    {:else}
      <ChartCanvas type="bar"
        data={{ labels: rankLabels, datasets: [{
          label: m.stats_charts_nap_avg_by_rank(),
          data: rankAvgHours,
          tokens: rankAgg.map((r) => `nap-${r.rank}`),
          fillAlpha: 0.75,
          borderRadius: 4
        }] }}
        options={rankOpts}
        ariaLabel={ariaFor(m.stats_charts_nap_avg_by_rank(), rankAvgHours, decimalToDuration)} />
    {/if}
  </section>

  <section class="card chart-section">
    <h2><Coffee size={18} /> {m.stats_charts_nap_trend()}</h2>
    <p class="chart-note">
      {smoothed ? m.stats_chart_smoothing_rolling() : m.stats_chart_smoothing_raw()}
    </p>
    {#if trendDatasets.length === 0}
      <p class="chart-note">{m.stats_chart_nap_rank_empty()}</p>
    {:else}
      <ChartCanvas type="line" height={280}
        data={{ labels, datasets: trendDatasets }}
        options={trendOpts}
        ariaLabel={ariaFor(m.stats_charts_nap_trend(), trendAriaValues.map((v) => (v === null ? null : v / 60)), decimalToDuration)} />
    {/if}
  </section>
{/if}

<style>
  .period-selector { display: flex; flex-direction: column; gap: var(--s-3); margin-bottom: var(--s-3); }
  .presets { display: flex; gap: var(--s-2); flex-wrap: wrap; }
  .custom { display: flex; gap: var(--s-3); align-items: end; flex-wrap: wrap; }
  .custom .field { min-width: 140px; }
  .chart-section { margin-bottom: var(--s-4); }
  .chart-section h2 { font-size: var(--fs-base); margin-bottom: var(--s-3); display: flex; align-items: center; gap: var(--s-2); }
  .chart-note { color: var(--c-text-muted); font-size: var(--fs-sm); margin: 0; }
</style>
