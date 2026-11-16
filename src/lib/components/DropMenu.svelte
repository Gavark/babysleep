<script lang="ts">
  import type { Snippet } from 'svelte';
  import { afterNavigate } from '$app/navigation';

  let {
    label,
    align = 'left',
    trigger,
    children
  }: {
    label: string;
    align?: 'left' | 'right';
    trigger: Snippet;
    children: Snippet;
  } = $props();

  let open = $state(false);
  let root = $state<HTMLElement | null>(null);

  // The app layout outlives navigations, so a link tapped inside the panel
  // would otherwise leave it open over the next page.
  afterNavigate(() => { open = false; });

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') open = false;
  }
  function onPointerDown(e: PointerEvent) {
    if (open && root && !root.contains(e.target as Node)) open = false;
  }
</script>

<svelte:window onkeydown={onKey} onpointerdown={onPointerDown} />

<div class="drop-menu" bind:this={root}>
  <button
    type="button"
    class="drop-trigger"
    aria-label={label}
    aria-expanded={open}
    onclick={() => (open = !open)}
  >
    {@render trigger()}
  </button>
  {#if open}
    <div class="drop-panel" class:right={align === 'right'}>
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .drop-menu { position: relative; display: inline-flex; }
  .drop-trigger {
    display: inline-flex;
    align-items: center;
    gap: var(--s-1);
    min-width: 44px;
    min-height: 44px;
    padding: 0 var(--s-2);
    margin: 0 calc(-1 * var(--s-2));
    background: transparent;
    border: 0;
    border-radius: var(--r-md);
    color: var(--c-text);
    font: inherit;
    font-size: var(--fs-lg);
    font-weight: 700;
    cursor: pointer;
  }
  .drop-trigger:hover { background: var(--c-bg-muted); }
  .drop-trigger:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--c-focus-ring); }
  .drop-panel {
    position: absolute;
    top: calc(100% + 4px);
    left: calc(-1 * var(--s-2));
    z-index: 60;
    display: flex;
    flex-direction: column;
    min-width: 220px;
    max-width: calc(100vw - 2 * var(--s-4));
    padding: var(--s-2);
    background: var(--c-bg-card);
    border: 1px solid var(--c-border);
    border-radius: var(--r-md);
    box-shadow: var(--shadow-md);
  }
  .drop-panel.right { left: auto; right: calc(-1 * var(--s-2)); }
</style>
