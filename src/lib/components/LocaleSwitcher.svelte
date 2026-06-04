<script lang="ts">
  import Globe from 'phosphor-svelte/lib/Globe';
  import CaretDown from 'phosphor-svelte/lib/CaretDown';
  import Check from 'phosphor-svelte/lib/Check';
  import type { Locale } from '$lib/server/auth/locale';

  let { current }: { current: Locale } = $props();

  const OPTIONS: Array<{ code: Locale; label: string }> = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' }
  ];

  let open = $state(false);
  let busy = $state(false);

  async function pick(code: Locale) {
    if (busy || code === current) { open = false; return; }
    busy = true;
    try {
      const res = await fetch('/api/locale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: code })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      location.reload();
    } catch (e) {
      busy = false;
      open = false;
      console.error('locale switch failed', e);
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') open = false;
  }
</script>

<svelte:window onkeydown={onKey} />

<div class="locale-switcher">
  <button
    type="button"
    class="locale-trigger"
    aria-haspopup="listbox"
    aria-expanded={open}
    onclick={() => (open = !open)}
    disabled={busy}
  >
    <Globe size={16} weight="regular" />
    <span>{current.toUpperCase()}</span>
    <CaretDown size={12} weight="bold" />
  </button>
  {#if open}
    <ul class="locale-menu" role="listbox">
      {#each OPTIONS as opt}
        <li>
          <button
            type="button"
            role="option"
            aria-selected={opt.code === current}
            class="locale-option"
            onclick={() => pick(opt.code)}
          >
            <span>{opt.label}</span>
            {#if opt.code === current}<Check size={14} weight="bold" />{/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .locale-switcher { position: relative; display: inline-block; }
  .locale-trigger {
    display: inline-flex;
    align-items: center;
    gap: var(--s-1);
    background: transparent;
    border: 1px solid transparent;
    color: var(--c-text-muted);
    border-radius: var(--r-sm);
    padding: var(--s-1) var(--s-2);
    cursor: pointer;
    font: inherit;
  }
  .locale-trigger:hover { background: var(--c-bg-soft); color: var(--c-text); }
  .locale-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    margin: 0;
    padding: var(--s-1);
    list-style: none;
    background: var(--c-bg-card);
    border: 1px solid var(--c-border);
    border-radius: var(--r-sm);
    box-shadow: var(--shadow-md);
    min-width: 140px;
    z-index: 50;
  }
  .locale-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--s-2);
    background: transparent;
    border: 0;
    color: var(--c-text);
    cursor: pointer;
    font: inherit;
    text-align: left;
    border-radius: var(--r-xs);
  }
  .locale-option:hover { background: var(--c-bg-soft); }
</style>
