<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { SaveState } from '#lib/autosave.ts';
  import SaveStatus from './SaveStatus.svelte';
  import * as m from '#paraglide/messages.js';

  type Props = {
    state: 'done' | 'progress' | 'upcoming';
    tone?: 'day' | 'night';
    open: boolean;
    ontoggle: () => void;
    saveState: SaveState;
    onsave: () => void;
    label: Snippet;
    value: Snippet;
    children: Snippet;
  };
  let { state, tone = 'day', open, ontoggle, saveState, onsave, label, value, children }: Props = $props();

  const panelId = $props.id();
</script>

<div class="row" class:upcoming={state === 'upcoming'}>
  <span class="dot" class:night={tone === 'night'} class:hollow={state === 'upcoming'} aria-hidden="true"></span>
  <button
    type="button"
    class="head"
    aria-expanded={open}
    aria-controls={panelId}
    onclick={ontoggle}
  >
    <span class="head-label">{@render label()}</span>
    <span class="head-value">{@render value()}</span>
  </button>
  <!-- Kept in the DOM and animated open; `inert` takes a closed panel out of
       focus order and the accessibility tree, as `hidden` did. -->
  <div class="panel-wrap" class:open id={panelId} inert={!open}>
    <div class="panel-clip">
      <div class="panel">
        {@render children()}
        <div class="panel-foot">
          <SaveStatus state={saveState} />
          <button type="button" class="btn btn-primary btn-sm" onclick={onsave}>{m.today_save_btn()}</button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .row {
    position: relative;
    padding-left: var(--s-5);
  }
  .dot {
    position: absolute;
    left: 0;
    top: 17px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--c-accent-honey);
    border: 1.5px solid transparent;
    box-sizing: border-box;
    transform: translateX(-50%);
  }
  .dot.night { background: var(--c-cal-seg-night); }
  .dot.hollow { background: transparent; border-color: var(--c-text-muted); }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-3);
    width: 100%;
    min-height: 44px;
    padding: 0 var(--s-2);
    background: transparent;
    border: 0;
    border-radius: var(--r-md);
    color: var(--c-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .head:hover { background: var(--c-bg-muted); }
  .head:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--c-focus-ring); }
  .head-label { display: inline-flex; align-items: center; gap: var(--s-2); font-weight: 600; }
  .head-value { font-feature-settings: "tnum" 1; }
  .upcoming .head { color: var(--c-text-muted); }
  .panel {
    display: grid;
    gap: var(--s-3);
    padding: var(--s-2) var(--s-2) var(--s-3);
  }
  /* Open and close by animating the row height from 0 to its content. */
  .panel-wrap {
    display: grid;
    grid-template-rows: 0fr;
    visibility: hidden;
    transition: grid-template-rows 150ms ease, visibility 0s linear 150ms;
  }
  .panel-wrap.open {
    grid-template-rows: 1fr;
    visibility: visible;
    transition: grid-template-rows 150ms ease, visibility 0s;
  }
  .panel-clip { overflow: hidden; min-height: 0; }
  @media (prefers-reduced-motion: reduce) {
    .panel-wrap, .panel-wrap.open { transition: none; }
  }
  .panel-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-3);
  }
</style>
