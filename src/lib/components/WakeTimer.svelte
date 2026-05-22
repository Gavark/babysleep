<script lang="ts">
  import type { AgeParams } from '$lib/age-params';
  import { formatDuration } from '$lib/sleep-calc';
  import { deriveTimerState, type TimerInput } from '$lib/wake-timer';
  import Sun from 'phosphor-svelte/lib/Sun';
  import Cloud from 'phosphor-svelte/lib/Cloud';
  import Moon from 'phosphor-svelte/lib/Moon';
  import Warning from 'phosphor-svelte/lib/Warning';

  type Props = {
    wakeTime: string;
    naps: Array<{ start: string; end: string }>;
    bedtime: string;
    ageParams: AgeParams;
    effectiveTz: string;
    onNapStart: (slotIdx: number, hhmm: string) => void;
    onNapEnd: (slotIdx: number, hhmm: string) => void;
  };
  let { wakeTime, naps, bedtime, ageParams, effectiveTz: _effectiveTz, onNapStart: _onNapStart, onNapEnd: _onNapEnd }: Props = $props();

  // `now` will be wired to a setInterval in Task 4. For Task 3 we render against the current Date once.
  const now = new Date();

  const input: TimerInput = $derived({
    wakeTime,
    naps,
    bedtime,
    awakeWindowMin: ageParams.awakeWindowMin
  });

  const state = $derived(deriveTimerState(input, now));
</script>

<section class="wake-timer-card" aria-label="Timer fenêtre d'éveil">
  {#if state.kind === 'empty'}
    <p class="msg-empty">
      Saisis l'heure de réveil pour démarrer le suivi.
    </p>
  {:else if state.kind === 'awake'}
    <div class="row-label"><Sun size={18} weight="duotone" /> Éveillé depuis</div>
    <div class="counter primary">{formatDuration(state.elapsedMin)}</div>
    {#if state.overWindow}
      <div class="row-sub danger">
        <Warning size={14} weight="fill" /> Fenêtre dépassée de {formatDuration(state.elapsedMin - ageParams.awakeWindowMin)}
      </div>
    {:else}
      <div class="row-sub muted">
        Prochaine sieste dans {formatDuration(state.remainingMin)} (à {state.nextNapAt})
      </div>
    {/if}
  {:else if state.kind === 'napping'}
    <div class="row-label honey"><Cloud size={18} weight="duotone" /> En sieste depuis</div>
    <div class="counter honey">{formatDuration(state.elapsedMin)}</div>
    <div class="row-sub muted">Sieste {state.napIdx + 1}</div>
  {:else if state.kind === 'bedtime'}
    <div class="row-label night"><Moon size={18} weight="duotone" /> Couché à {state.bedtime} · bonne nuit 🌙</div>
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
</style>
