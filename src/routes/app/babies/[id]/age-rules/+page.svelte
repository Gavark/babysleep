<script lang="ts">
  import { formatAgeBracket } from '$lib/format';
  import * as m from '$paraglide/messages';
  import Info from 'phosphor-svelte/lib/Info';
  import { formatDuration } from '$lib/sleep-calc';

  let { data } = $props();

  function rowClass(i: number): string {
    return i === data.currentBracketIdx ? 'row-current' : '';
  }
  function cardClass(i: number): string {
    return 'card bracket-card' + (i === data.currentBracketIdx ? ' bracket-current' : '');
  }
  function formatHours(h: number): string {
    if (Number.isInteger(h)) return `${h}h`;
    return `${Math.floor(h)}h${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
  }
</script>

<h1>{m.age_rules_page_title()}</h1>
<p class="page-meta">{m.age_rules_intro({ name: data.baby.name })}</p>

<!-- Desktop: table -->
<div class="table-wrapper desktop-only">
  <table class="age-table">
    <thead>
      <tr>
        <th>{m.age_rules_col_label()}</th>
        <th>{m.age_rules_col_naps()} <button type="button" class="ttip" aria-label={m.age_rules_tooltip_naps()}><Info size={12} /><span class="ttip-bubble">{m.age_rules_tooltip_naps()}</span></button></th>
        <th>{m.age_rules_col_first_window()} <button type="button" class="ttip" aria-label={m.age_rules_tooltip_first_window()}><Info size={12} /><span class="ttip-bubble">{m.age_rules_tooltip_first_window()}</span></button></th>
        <th>{m.age_rules_col_window()} <button type="button" class="ttip" aria-label={m.age_rules_tooltip_window()}><Info size={12} /><span class="ttip-bubble">{m.age_rules_tooltip_window()}</span></button></th>
        <th>{m.age_rules_col_before_bed()} <button type="button" class="ttip" aria-label={m.age_rules_tooltip_before_bed()}><Info size={12} /><span class="ttip-bubble">{m.age_rules_tooltip_before_bed()}</span></button></th>
        <th>{m.age_rules_col_night_sleep()} <button type="button" class="ttip ttip-right" aria-label={m.age_rules_tooltip_night_sleep()}><Info size={12} /><span class="ttip-bubble">{m.age_rules_tooltip_night_sleep()}</span></button></th>
        <th>{m.age_rules_col_day_sleep()} <button type="button" class="ttip ttip-right" aria-label={m.age_rules_tooltip_day_sleep()}><Info size={12} /><span class="ttip-bubble">{m.age_rules_tooltip_day_sleep()}</span></button></th>
      </tr>
    </thead>
    <tbody>
      {#each data.brackets as b, i}
        <tr class={rowClass(i)}>
          <td><strong>{formatAgeBracket(b)}</strong>{#if i === data.currentBracketIdx} <span class="badge-current">{m.age_rules_current_bracket_badge()}</span>{/if}</td>
          <td>{b.naps}</td>
          <td>{formatDuration(b.firstAwakeWindowMin)}</td>
          <td>{formatDuration(b.awakeWindowMin)}</td>
          <td>{formatDuration(b.beforeBedWindowMin)}</td>
          <td>{formatHours(b.nightSleepH)}</td>
          <td>{formatHours(b.daySleepH)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Mobile: stacked cards -->
<div class="mobile-only">
  {#each data.brackets as b, i}
    <div class={cardClass(i)}>
      <div class="bracket-header">
        <h3>{formatAgeBracket(b)}</h3>
        {#if i === data.currentBracketIdx}
          <span class="badge-current">{m.age_rules_current_bracket_badge()}</span>
        {/if}
      </div>
      <dl class="bracket-grid">
        <dt>{m.age_rules_col_naps()}</dt><dd>{b.naps}</dd>
        <dt>{m.age_rules_col_first_window()}</dt><dd>{formatDuration(b.firstAwakeWindowMin)}</dd>
        <dt>{m.age_rules_col_window()}</dt><dd>{formatDuration(b.awakeWindowMin)}</dd>
        <dt>{m.age_rules_col_before_bed()}</dt><dd>{formatDuration(b.beforeBedWindowMin)}</dd>
        <dt>{m.age_rules_col_night_sleep()}</dt><dd>{formatHours(b.nightSleepH)}</dd>
        <dt>{m.age_rules_col_day_sleep()}</dt><dd>{formatHours(b.daySleepH)}</dd>
      </dl>
    </div>
  {/each}
</div>

<p class="page-meta footer-note">
  {m.age_rules_footer_note()}
  <em>{m.age_rules_footer_phase2()}</em>
</p>

<style>
  .desktop-only { display: none; }
  .mobile-only  { display: grid; gap: var(--s-3); }
  @media (min-width: 768px) {
    .desktop-only { display: block; }
    .mobile-only  { display: none; }
  }
  .table-wrapper { overflow-x: auto; }
  .age-table { width: 100%; border-collapse: collapse; }
  .age-table th, .age-table td {
    padding: var(--s-2);
    text-align: left;
    border-bottom: 1px solid var(--c-border);
    vertical-align: top;
  }
  .age-table th { font-weight: 600; white-space: nowrap; }
  .ttip {
    position: relative;
    display: inline-flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    color: var(--c-text-muted);
    cursor: help;
    vertical-align: middle;
    outline: none;
    font: inherit;
  }
  .ttip:focus-visible { outline: 2px solid var(--c-accent-honey); border-radius: var(--r-sm); }
  .ttip-bubble {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    max-width: min(260px, 80vw);
    padding: var(--s-2);
    background: var(--c-bg-soft);
    color: var(--c-text);
    border: 1px solid var(--c-border);
    border-radius: var(--r-sm);
    box-shadow: var(--shadow-lg);
    font-size: var(--fs-xs);
    font-weight: 400;
    line-height: 1.4;
    text-align: left;
    white-space: normal;
    z-index: 10;
    pointer-events: none;
    transition: opacity 0.15s ease, visibility 0.15s ease;
  }
  .ttip-right .ttip-bubble { left: auto; right: 0; transform: none; }
  .ttip:hover .ttip-bubble,
  .ttip:focus .ttip-bubble,
  .ttip:focus-within .ttip-bubble {
    visibility: visible;
    opacity: 1;
  }
  .row-current { background: color-mix(in srgb, var(--c-accent-honey) 12%, transparent); }
  .row-current td:first-child { border-left: 3px solid var(--c-accent-honey); padding-left: calc(var(--s-2) - 3px); }
  .badge-current {
    display: inline-block;
    font-size: var(--fs-xs);
    padding: 2px var(--s-1);
    border-radius: var(--r-sm);
    background: var(--c-accent-honey);
    color: #3D2E25; /* dark brown, invariant — high contrast on both honey shades (light/dark themes) */
    margin-left: var(--s-1);
    font-weight: 600;
  }
  .bracket-card { padding: var(--s-3); }
  .bracket-current { border-color: var(--c-accent-honey); }
  .bracket-header { display: flex; justify-content: space-between; align-items: center; gap: var(--s-2); margin-bottom: var(--s-2); }
  .bracket-header h3 { margin: 0; }
  .bracket-grid { display: grid; grid-template-columns: 1fr auto; gap: var(--s-1) var(--s-2); margin: 0; }
  .bracket-grid dt { color: var(--c-text-muted); }
  .bracket-grid dd { margin: 0; font-weight: 500; text-align: right; }
  .footer-note { margin-top: var(--s-4); font-size: var(--fs-sm); }
  .footer-note em { display: block; margin-top: var(--s-1); color: var(--c-text-muted); }
</style>
