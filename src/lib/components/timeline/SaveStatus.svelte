<script lang="ts">
  import type { SaveState } from '$lib/autosave';
  import Check from 'phosphor-svelte/lib/Check';
  import * as m from '$paraglide/messages';

  let { state }: { state: SaveState } = $props();
</script>

<span class="save-status" class:error={state === 'error'} role="status">
  {#if state === 'pending' || state === 'saving'}
    {m.today_save_state_saving()}
  {:else if state === 'saved'}
    <Check size={14} weight="bold" /> {m.today_save_state_saved()}
  {:else if state === 'error'}
    {m.today_save_state_error()}
  {/if}
</span>

<style>
  .save-status {
    display: inline-flex;
    align-items: center;
    gap: var(--s-1);
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }
  .save-status.error { color: var(--c-danger); font-weight: 600; }
</style>
