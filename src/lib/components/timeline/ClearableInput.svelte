<script lang="ts">
  import * as m from '#paraglide/messages.js';

  type Props = {
    name: string;
    type: 'time' | 'number';
    label: string;
    value: string;
    onchange: (value: string) => void;
    onclear: () => void;
  };
  let { name, type, label, value, onchange, onclear }: Props = $props();

  /**
   * Hands the typed value to the page, then shows what the page kept: a value
   * it cleared or normalised (a pause of 0, say) may leave `value` unchanged,
   * which would not update the input by itself.
   */
  function change(input: HTMLInputElement) {
    onchange(input.value);
    if (input.value !== value) input.value = value;
  }
</script>

<label class="field">
  <span class="field-label">{label}</span>
  <span class="input-with-clear">
    {#if type === 'number'}
      <input
        class="field-input"
        type="number"
        min="0"
        step="5"
        placeholder="0"
        {name}
        {value}
        autocomplete="off"
        onchange={(e) => change(e.currentTarget)}
      />
    {:else}
      <input
        class="field-input"
        type="time"
        {name}
        {value}
        autocomplete="off"
        onchange={(e) => change(e.currentTarget)}
      />
    {/if}
    {#if value}
      <button
        type="button"
        class="clear-btn"
        aria-label={m.today_clear_field()}
        title={m.today_clear_field()}
        onclick={onclear}
      >✕</button>
    {/if}
  </span>
</label>

<style>
  .input-with-clear {
    display: inline-flex;
    align-items: center;
    gap: var(--s-1);
    position: relative;
  }
  .clear-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    background: transparent;
    border: 1px solid var(--c-border);
    border-radius: 999px;
    color: var(--c-text-muted);
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
    transition: color 0.1s ease, border-color 0.1s ease;
  }
  .clear-btn:hover { color: var(--c-danger); border-color: var(--c-danger); }
  .clear-btn:focus-visible { outline: 2px solid var(--c-accent-honey); }
</style>
