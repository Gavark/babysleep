<script lang="ts">
  import { enhance } from '$app/forms';
  import { COMMON_TIMEZONES } from '$lib/tz';
  import Trash from 'phosphor-svelte/lib/Trash';
  import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk';
  let { data, form } = $props();
</script>

<h1>Bébé : {data.baby.name}</h1>

{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form method="POST" action="?/update" use:enhance class="card edit-form">
  <label class="field"><span class="field-label">Prénom</span>
    <input class="field-input" name="name" value={data.baby.name} required />
  </label>
  <label class="field"><span class="field-label">Date de naissance</span>
    <input class="field-input" type="date" name="birth_date" value={data.baby.birthDate} required />
  </label>
  <label class="field"><span class="field-label">Heure de réveil souhaitée</span>
    <input class="field-input" type="time" name="desired_wake" value={data.baby.desiredWakeTime ?? ''} />
  </label>
  <label class="field"><span class="field-label">Âge corrigé (mois)</span>
    <input class="field-input" type="number" name="age_override" min="0" max="60" value={data.baby.ageOverrideMonths ?? ''} />
  </label>
  <label class="field"><span class="field-label">Fuseau horaire (override)</span>
    <select class="field-select" name="timezone">
      <option value="">Hériter du compte</option>
      {#each COMMON_TIMEZONES as tz}
        <option value={tz} selected={data.baby.timezone === tz}>{tz}</option>
      {/each}
    </select>
  </label>
  <button type="submit" class="btn btn-primary"><FloppyDisk size={16} /> Enregistrer</button>
</form>

<form method="POST" action="?/delete" use:enhance
  onsubmit={(e) => { if (!confirm('Supprimer ce bébé et tout son historique ?')) e.preventDefault(); }}
  style="margin-top: var(--s-4);"
>
  <button type="submit" class="btn btn-danger"><Trash size={16} /> Supprimer ce bébé</button>
</form>

<style>
  .edit-form { display: grid; gap: var(--s-3); max-width: 480px; }
</style>
