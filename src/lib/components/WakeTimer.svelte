<script lang="ts">
  import { onMount } from 'svelte';
  import type { AgeParams } from '$lib/age-params';
  import type { Locale } from '$lib/server/auth/locale';
  import { formatDate } from '$lib/format';
  import { formatDuration } from '$lib/sleep-calc';
  import { deriveTimerState, nextEmptyNapSlot, inProgressNapSlot, type TimerInput, type TimerState } from '$lib/wake-timer';
  import Sun from 'phosphor-svelte/lib/Sun';
  import Cloud from 'phosphor-svelte/lib/Cloud';
  import Moon from 'phosphor-svelte/lib/Moon';
  import Warning from 'phosphor-svelte/lib/Warning';
  import Play from 'phosphor-svelte/lib/Play';
  import Check from 'phosphor-svelte/lib/Check';
  import Pause from 'phosphor-svelte/lib/Pause';
  import Plus from 'phosphor-svelte/lib/Plus';
  import X from 'phosphor-svelte/lib/X';

  type Props = {
    wakeTime: string;
    naps: Array<{ start: string; end: string; pauseMin?: number | null }>;
    bedtime: string;
    ageParams: AgeParams;
    effectiveTz: string;
    locale: Locale;
    onNapStart: (slotIdx: number, hhmm: string) => void;
    onNapEnd: (slotIdx: number, hhmm: string) => void;
    onAddPause?: (slotIdx: number, deltaMin: number) => void;
  };
  let { wakeTime, naps, bedtime, ageParams, effectiveTz, locale, onNapStart, onNapEnd, onAddPause }: Props = $props();

  let now: Date = $state(new Date());

  onMount(() => {
    const id = setInterval(() => { now = new Date(); }, 30_000);
    return () => clearInterval(id);
  });

  const input: TimerInput = $derived({
    wakeTime,
    naps,
    bedtime,
    firstAwakeWindowMin: ageParams.firstAwakeWindowMin,
    awakeWindowMin: ageParams.awakeWindowMin
  });

  const timerState: TimerState = $derived(deriveTimerState(input, now));
  const emptySlot = $derived(nextEmptyNapSlot(naps));
  const progressSlot = $derived(inProgressNapSlot(naps));

  let submitting = $state(false);
  let toastMessage = $state('');
  let toastVisible = $state(false);

  function formatNowHHMM(tz: string): string {
    // Both supported locales render "HH:mm" with hour12:false.
    return formatDate(new Date(), locale, {
      timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false
    });
  }

  function showToast(message: string) {
    toastMessage = message;
    toastVisible = true;
    setTimeout(() => { toastVisible = false; }, 3000);
  }

  function handleStart() {
    if (submitting) return;
    if (emptySlot === null) return;
    submitting = true;
    const hhmm = formatNowHHMM(effectiveTz);
    onNapStart(emptySlot, hhmm);
    showToast(`Sieste ${emptySlot + 1} démarrée à ${hhmm}`);
    setTimeout(() => { submitting = false; }, 2000);
  }

  function handleEnd() {
    if (submitting) return;
    if (progressSlot === null) return;
    submitting = true;
    const hhmm = formatNowHHMM(effectiveTz);
    onNapEnd(progressSlot, hhmm);
    showToast(`Sieste ${progressSlot + 1} terminée à ${hhmm}`);
    setTimeout(() => { submitting = false; }, 2000);
  }

  let pauseOpen = $state(false);
  let pauseInputMin = $state(10);

  function handleAddPauseSubmit() {
    if (submitting) return;
    if (progressSlot === null) return;
    if (!onAddPause) return;
    const n = Math.round(Number(pauseInputMin));
    if (!Number.isFinite(n) || n <= 0 || n > 600) return;
    submitting = true;
    onAddPause(progressSlot, n);
    showToast(`+${n} min de pause sur sieste ${progressSlot + 1}`);
    pauseOpen = false;
    pauseInputMin = 10;
    setTimeout(() => { submitting = false; }, 2000);
  }
</script>

<section class="wake-timer-card" aria-label="Timer fenêtre d'éveil">
  {#if timerState.kind === 'empty'}
    <p class="msg-empty">
      Saisis l'heure de réveil pour démarrer le suivi.
    </p>
  {:else if timerState.kind === 'awake'}
    <div class="row-label"><Sun size={18} weight="duotone" /> Éveillé depuis</div>
    <div class="counter primary">{formatDuration(timerState.elapsedMin)}</div>
    {#if emptySlot === null}
      <div class="row-sub muted">
        <Moon size={14} weight="duotone" /> En attente du coucher
      </div>
    {:else if timerState.overWindow}
      <div class="row-sub danger">
        <Warning size={14} weight="fill" /> Fenêtre dépassée de {formatDuration(-timerState.remainingMin)}
      </div>
    {:else}
      <div class="row-sub muted">
        Prochaine sieste dans {formatDuration(timerState.remainingMin)} (à {timerState.nextNapAt})
      </div>
    {/if}
    {#if emptySlot !== null}
      <button
        type="button"
        class="btn btn-secondary action-btn"
        onclick={handleStart}
        disabled={submitting}
        title="Démarrer une sieste maintenant"
      >
        <Play size={16} weight="fill" /> Démarrer sieste maintenant
      </button>
    {/if}
  {:else if timerState.kind === 'napping'}
    <div class="row-label honey"><Cloud size={18} weight="duotone" /> En sieste depuis</div>
    <div class="counter honey">{formatDuration(timerState.elapsedMin)}</div>
    <div class="row-sub muted">
      Sieste {timerState.napIdx + 1}
      {#if timerState.pauseMin > 0}
        · dont {formatDuration(timerState.pauseMin)} de pause
      {/if}
    </div>
    <div class="nap-actions">
      <button
        type="button"
        class="btn btn-secondary action-btn"
        onclick={handleEnd}
        disabled={submitting}
      >
        <Check size={16} weight="bold" /> Terminer sieste maintenant
      </button>
      {#if onAddPause}
        {#if !pauseOpen}
          <button
            type="button"
            class="btn btn-secondary btn-sm pause-trigger"
            onclick={() => { pauseOpen = true; }}
            disabled={submitting}
            title="Ajouter du temps de pause (réveil court pendant la sieste)"
          >
            <Pause size={14} weight="fill" /> Ajouter une pause
          </button>
        {:else}
          <div class="pause-inline">
            <label class="pause-inline-label" for="pause-min-input">
              <Pause size={14} weight="fill" /> Pause (min) :
            </label>
            <input
              id="pause-min-input"
              class="field-input pause-input"
              type="number" min="1" max="180" step="5"
              bind:value={pauseInputMin}
            />
            <button
              type="button"
              class="btn btn-primary btn-sm"
              onclick={handleAddPauseSubmit}
              disabled={submitting}
              title="Ajouter cette pause à la sieste en cours"
            >
              <Plus size={14} weight="bold" /> Ajouter
            </button>
            <button
              type="button"
              class="btn btn-secondary btn-sm pause-cancel"
              onclick={() => { pauseOpen = false; }}
              aria-label="Annuler"
              title="Annuler"
            >
              <X size={14} />
            </button>
          </div>
        {/if}
      {/if}
    </div>
  {:else if timerState.kind === 'bedtime'}
    <div class="row-label night"><Moon size={18} weight="duotone" /> Couché à {timerState.bedtime} · bonne nuit 🌙</div>
  {/if}

  {#if toastVisible}
    <div class="toast" role="status" aria-live="polite">{toastMessage}</div>
  {/if}
</section>

<style>
  .wake-timer-card {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--c-bg-card);
    box-shadow: var(--shadow-md);
    border-radius: var(--r-lg);
    padding: var(--s-3) var(--s-4);
    margin-bottom: var(--s-3);
    display: grid;
    gap: var(--s-2);
    text-align: center;
  }
  .msg-empty {
    margin: 0;
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
  }
  .row-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-2);
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }
  .row-label.honey { color: var(--c-accent-honey); }
  .row-label.night { color: var(--c-cal-seg-night); font-size: var(--fs-md); }
  .counter {
    font-size: var(--fs-2xl);
    font-weight: 700;
    line-height: 1;
    font-feature-settings: "tnum" 1;
  }
  .counter.primary { color: var(--c-primary); }
  .counter.honey { color: var(--c-accent-honey); }
  .row-sub {
    font-size: var(--fs-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--s-1);
  }
  .row-sub.muted { color: var(--c-text-muted); }
  .row-sub.danger { color: var(--c-danger); font-weight: 600; }
  .action-btn {
    margin-top: var(--s-2);
    justify-self: center;
    display: inline-flex;
    align-items: center;
    gap: var(--s-1);
  }
  .nap-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-1);
  }
  .pause-inline {
    margin-top: var(--s-2);
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    flex-wrap: wrap;
    justify-content: center;
  }
  .pause-inline-label {
    display: inline-flex;
    align-items: center;
    gap: var(--s-1);
    font-size: var(--fs-sm);
    color: var(--c-text-muted);
  }
  .pause-input {
    width: 90px;
    text-align: center;
  }
  .pause-trigger {
    align-self: center;
  }
  .pause-cancel {
    padding: var(--s-1) var(--s-2);
  }
  .toast {
    margin-top: var(--s-2);
    padding: var(--s-2) var(--s-3);
    background: var(--c-bg-soft);
    color: var(--c-text);
    border-radius: var(--r-sm);
    font-size: var(--fs-sm);
  }
  @media (prefers-reduced-motion: reduce) {
    .wake-timer-card { transition: none; }
  }
</style>
