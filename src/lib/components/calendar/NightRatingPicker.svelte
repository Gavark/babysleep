<script lang="ts">
  import { enhance } from '$app/forms';
  import CheckCircle from 'phosphor-svelte/lib/CheckCircle';
  import MinusCircle from 'phosphor-svelte/lib/MinusCircle';
  import XCircle from 'phosphor-svelte/lib/XCircle';
  import Eraser from 'phosphor-svelte/lib/Eraser';
  import PencilSimple from 'phosphor-svelte/lib/PencilSimple';
  import X from 'phosphor-svelte/lib/X';
  import type { NightRating } from '$lib/calendar';
  import type { Locale } from '$lib/server/auth/locale';
  import { formatDate } from '$lib/format';

  type Props = {
    date: string;
    currentRating: NightRating | null;
    babyId: number;
    locale: Locale;
    onClose: () => void;
  };
  let { date, currentRating, babyId, locale, onClose }: Props = $props();

  let submitting = $state(false);

  const formattedDate = $derived(formatLongDay(date));

  function formatLongDay(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return formatDate(new Date(Date.UTC(y, m - 1, d)), locale, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
    });
  }

  function onBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }
  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window on:keydown={onKeydown} />

<div class="backdrop" onclick={onBackdropClick} role="presentation">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="picker-title">
    <header>
      <h2 id="picker-title">Note de la nuit</h2>
      <p class="date">{formattedDate}</p>
      <button type="button" class="close" onclick={onClose} aria-label="Fermer">
        <X size={18} weight="bold" />
      </button>
    </header>

    <form
      method="POST"
      action="?/rate"
      use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          await update({ reset: false });
          submitting = false;
          onClose();
        };
      }}
    >
      <input type="hidden" name="date" value={date} />
      <div class="options">
        <button type="submit" name="rating" value="good"
          class="opt opt-good {currentRating === 'good' ? 'active' : ''}"
          disabled={submitting}>
          <CheckCircle size={32} weight="fill" />
          <span>Bonne</span>
        </button>
        <button type="submit" name="rating" value="medium"
          class="opt opt-medium {currentRating === 'medium' ? 'active' : ''}"
          disabled={submitting}>
          <MinusCircle size={32} weight="fill" />
          <span>Moyenne</span>
        </button>
        <button type="submit" name="rating" value="bad"
          class="opt opt-bad {currentRating === 'bad' ? 'active' : ''}"
          disabled={submitting}>
          <XCircle size={32} weight="fill" />
          <span>Mauvaise</span>
        </button>
      </div>

      {#if currentRating}
        <button type="submit" name="rating" value="" class="btn btn-ghost btn-sm clear-btn" disabled={submitting}>
          <Eraser size={14} /> Effacer la note
        </button>
      {/if}
    </form>

    <footer>
      <a class="btn btn-secondary btn-sm" href="/app/babies/{babyId}/day/{date}">
        <PencilSimple size={14} /> Éditer la journée complète
      </a>
      <button type="button" class="btn btn-ghost btn-sm" onclick={onClose}>Fermer</button>
    </footer>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: var(--s-3);
  }
  .modal {
    background: var(--c-bg-card);
    color: var(--c-text);
    border-radius: var(--r-lg);
    padding: var(--s-4);
    max-width: 420px;
    width: 100%;
    box-shadow: var(--shadow-lg);
    display: grid;
    gap: var(--s-3);
  }
  header { position: relative; display: grid; gap: var(--s-1); }
  header h2 { margin: 0; font-size: var(--fs-lg); }
  header .date { margin: 0; font-size: var(--fs-sm); color: var(--c-text-muted); text-transform: capitalize; }
  header .close {
    position: absolute;
    top: -4px;
    right: -4px;
    background: transparent;
    border: none;
    color: var(--c-text-muted);
    cursor: pointer;
    padding: var(--s-1);
    border-radius: 50%;
    display: inline-flex;
  }
  header .close:hover { background: var(--c-bg-muted); }

  .options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--s-2);
  }
  .opt {
    display: grid;
    justify-items: center;
    gap: var(--s-1);
    padding: var(--s-3) var(--s-2);
    background: var(--c-bg-muted);
    border: 2px solid transparent;
    border-radius: var(--r-md);
    color: var(--c-text);
    font-family: inherit;
    font-size: var(--fs-sm);
    cursor: pointer;
    transition: filter 0.15s, border-color 0.15s;
  }
  .opt:hover { filter: brightness(0.95); }
  .opt:disabled { opacity: 0.6; cursor: wait; }
  .opt.active { border-color: var(--c-primary); }
  .opt-good   { color: var(--c-accent-sage); }
  .opt-medium { color: var(--c-accent-honey); }
  .opt-bad    { color: var(--c-danger); }
  .opt span { color: var(--c-text); }

  .clear-btn { display: inline-flex; align-items: center; gap: var(--s-1); justify-self: center; }

  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--s-2);
    flex-wrap: wrap;
  }
</style>
