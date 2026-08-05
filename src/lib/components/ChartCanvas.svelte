<script module lang="ts">
  import {
    Chart,
    LineController,
    BarController,
    LineElement,
    PointElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler
  } from 'chart.js';

  // Explicit registration instead of ...registerables: only line and bar are
  // used, and registerables pulls in every controller, scale and plugin.
  // Legend is needed by the nap trend chart, which is multi-series.
  // Module scope: this runs once per module load, not once per component
  // instance (this page mounts seven ChartCanvas instances) and not on every
  // SSR pass.
  Chart.register(
    LineController,
    BarController,
    LineElement,
    PointElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler
  );
</script>

<script lang="ts">
  import { readChartTheme, onChartThemeChange, withAlpha, type ChartTheme } from '$lib/charts/theme';

  let {
    type,
    data,
    options,
    height = 240,
    ariaLabel
  }: {
    type: 'line' | 'bar';
    data: any;
    options?: any;
    height?: number;
    ariaLabel: string;
  } = $props();

  let canvas: HTMLCanvasElement | undefined = $state();
  // Bumped by the theme subscription so a theme change re-enters the build
  // effect by exactly the same path as a data change.
  let themeVersion = $state(0);

  $effect(() => onChartThemeChange(() => { themeVersion += 1; }));

  $effect(() => {
    themeVersion; // dependency — do not remove
    const el = canvas;
    if (!el) return;
    const t = readChartTheme();
    const chart = new Chart(el, {
      type,
      data: painted(data, t),
      options: themed(options ?? {}, t)
    });
    return () => chart.destroy();
  });

  /**
   * Resolves a token NAME to a colour. Callers pass names, never colours, so
   * this component stays the only place that reads design tokens — which is
   * also what makes series colours follow a theme change. A page holding
   * resolved colours would keep painting the old palette after a toggle.
   */
  function resolveToken(name: string, t: ChartTheme): string {
    const rank = /^nap-([1-8])$/.exec(name);
    if (rank) return t.napRanks[Number(rank[1]) - 1] || t.series.nap;
    return (t.series as Record<string, string>)[name] ?? t.series.nap;
  }

  /**
   * Datasets declare `token` (one colour) or `tokens` (one per point) plus an
   * optional `fillAlpha`. Anything that already carries an explicit colour is
   * left alone.
   */
  function painted(d: any, t: ChartTheme) {
    const datasets = (d.datasets ?? []).map((ds: any) => {
      const { token, tokens, fillAlpha, ...rest } = ds;
      if (Array.isArray(tokens)) {
        const colors = tokens.map((name: string) => resolveToken(name, t));
        return {
          ...rest,
          borderColor: rest.borderColor ?? colors,
          backgroundColor: rest.backgroundColor ?? colors.map((c) => withAlpha(c, fillAlpha ?? 0.75))
        };
      }
      if (typeof token === 'string') {
        const color = resolveToken(token, t);
        return {
          ...rest,
          borderColor: rest.borderColor ?? color,
          backgroundColor: rest.backgroundColor ?? withAlpha(color, fillAlpha ?? 0.18)
        };
      }
      return rest;
    });
    return { ...d, datasets };
  }

  /**
   * Merges theme colours BENEATH the caller's options, over the fixed set of
   * option paths that carry colour. A generic recursive merge would mangle the
   * arrays in `data`/`ticks`; the set of colour paths is small and known, so it
   * is spelled out.
   */
  function themed(o: any, t: ChartTheme) {
    const scales = o.scales ?? {};
    const themedScales: Record<string, any> = {};
    for (const key of new Set(['x', 'y', ...Object.keys(scales)])) {
      const s = scales[key] ?? {};
      themedScales[key] = {
        ...s,
        ticks: { color: t.textMuted, ...(s.ticks ?? {}) },
        grid: { color: t.grid, ...(s.grid ?? {}) },
        border: { color: t.grid, ...(s.border ?? {}) },
        title: { color: t.textMuted, ...(s.title ?? {}) }
      };
    }
    return {
      ...o,
      color: t.textMuted,
      plugins: {
        ...(o.plugins ?? {}),
        legend: { labels: { color: t.textMuted }, ...(o.plugins?.legend ?? {}) },
        tooltip: {
          backgroundColor: t.tooltipBg,
          titleColor: t.text,
          bodyColor: t.text,
          borderColor: t.grid,
          borderWidth: 1,
          ...(o.plugins?.tooltip ?? {})
        }
      },
      scales: themedScales
    };
  }
</script>

<!-- role/aria-label sit on the wrapper, not the <canvas>: Svelte's
     a11y_no_interactive_element_to_noninteractive_role rule treats <canvas> as
     interactive and rejects role="img" on it. The wrapper carries the same
     semantics for a screen reader and keeps `npm run check` clean. -->
<div style="height: {height}px; position: relative;" role="img" aria-label={ariaLabel}>
  <canvas bind:this={canvas}></canvas>
</div>
