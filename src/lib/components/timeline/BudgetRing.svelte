<script lang="ts">
  import { formatDuration } from '#lib/sleep-calc.ts';
  import * as m from '#paraglide/messages.js';

  type Props = { completedMin: number; totalMin: number; remainingMin: number };
  let { completedMin, totalMin, remainingMin }: Props = $props();

  const R = 24;
  const CIRCUMFERENCE = 2 * Math.PI * R;

  const over = $derived(completedMin > totalMin);
  const fraction = $derived(
    over ? 1 : totalMin > 0 ? Math.max(0, completedMin) / totalMin : 0
  );
  const label = $derived(
    m.today_budget_ring_label({
      done: formatDuration(completedMin),
      total: formatDuration(totalMin),
      remaining: formatDuration(remainingMin)
    })
  );
</script>

<!-- Drawn on a 56-unit grid and shown at 68 px: the text scales with it. -->
<svg class="ring" class:over width="68" height="68" viewBox="0 0 56 56" role="img" aria-label={label}>
  <title>{label}</title>
  <circle class="track" cx="28" cy="28" r={R} fill="none" stroke-width="5" />
  <circle
    class="arc"
    cx="28" cy="28" r={R}
    fill="none"
    stroke-width="5"
    stroke-linecap="round"
    stroke-dasharray={CIRCUMFERENCE}
    stroke-dashoffset={CIRCUMFERENCE * (1 - fraction)}
    transform="rotate(-90 28 28)"
  />
  <text class="done" x="28" y="27" text-anchor="middle">{formatDuration(completedMin)}</text>
  <text class="total" x="28" y="38" text-anchor="middle">/ {formatDuration(totalMin)}</text>
</svg>

<style>
  .ring { flex: none; }
  .track { stroke: var(--c-bg-soft); }
  .arc { stroke: var(--c-accent-honey); }
  .ring.over .arc { stroke: var(--c-danger); }
  text { fill: var(--c-text); font-feature-settings: "tnum" 1; }
  .done { font-size: 11px; font-weight: 700; }
  .total { font-size: 8px; fill: var(--c-text-muted); }
</style>
