<script lang="ts">
  import CircleHalf from 'phosphor-svelte/lib/CircleHalf';
  import Sun from 'phosphor-svelte/lib/Sun';
  import Moon from 'phosphor-svelte/lib/Moon';
  import * as m from '$paraglide/messages';

  type ThemeValue = 'auto' | 'light' | 'dark';

  let { initial }: { initial: ThemeValue } = $props();
  // svelte-ignore state_referenced_locally — `initial` is a one-time seed, theme is then user-controlled
  let theme = $state<ThemeValue>(initial);

  const order: ThemeValue[] = ['auto', 'light', 'dark'];

  async function cycle() {
    const idx = order.indexOf(theme);
    const next = order[(idx + 1) % order.length];
    theme = next;

    if (next === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', next);
    }

    const fd = new FormData();
    fd.set('value', next);
    try {
      await fetch('/api/theme', { method: 'POST', body: fd });
    } catch {
      /* network glitch — UI state remains in sync, cookie may be stale until next request */
    }
  }

  function label(t: ThemeValue): string {
    if (t === 'auto') return m.theme_label_auto();
    if (t === 'light') return m.theme_label_light();
    return m.theme_label_dark();
  }
</script>

<button
  type="button"
  class="theme-toggle"
  onclick={cycle}
  title={label(theme)}
  aria-label={label(theme)}
>
  {#if theme === 'auto'}
    <CircleHalf size={20} weight="regular" />
  {:else if theme === 'light'}
    <Sun size={20} weight="regular" />
  {:else}
    <Moon size={20} weight="regular" />
  {/if}
</button>

<style>
  .theme-toggle {
    background: transparent;
    border: 1.5px solid var(--c-border);
    color: var(--c-text-muted);
    border-radius: var(--r-md);
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
    padding: 0;
  }
  .theme-toggle:hover {
    color: var(--c-primary);
    border-color: var(--c-primary);
  }
  .theme-toggle:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--c-focus-ring);
  }
</style>
