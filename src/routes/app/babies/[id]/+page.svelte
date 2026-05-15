<script lang="ts">
  import { enhance } from '$app/forms';
  import { COMMON_TIMEZONES } from '$lib/tz';
  let { data, form } = $props();

  let babyTz = $state(data.baby.timezone ?? '');
</script>

<h1>Bébé : {data.baby.name}</h1>

{#if form?.error}<p class="error">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form method="POST" action="?/update" use:enhance>
  <label>Prénom<input name="name" value={data.baby.name} required /></label>
  <label>Date de naissance<input type="date" name="birth_date" value={data.baby.birthDate} required /></label>
  <label>Âge corrigé (mois)<input type="number" name="age_override" min="0" max="60" value={data.baby.ageOverrideMonths ?? ''} /></label>
  <label>Heure de réveil souhaitée<input type="time" name="desired_wake" value={data.baby.desiredWakeTime ?? ''} /></label>
  <label>Fuseau horaire (hériter du compte : {data.userTimezone})
    <select name="timezone" autocomplete="off"
      value={babyTz}
      oninput={(e) => babyTz = (e.currentTarget as HTMLSelectElement).value}
      onchange={(e) => babyTz = (e.currentTarget as HTMLSelectElement).value}>
      <option value="">Hériter du compte ({data.userTimezone})</option>
      {#each COMMON_TIMEZONES as tz}
        <option value={tz} selected={babyTz === tz}>{tz}</option>
      {/each}
    </select>
  </label>
  <button type="submit">Enregistrer</button>
</form>

<form method="POST" action="?/delete" use:enhance onsubmit={(e) => { if (!confirm('Supprimer ce bébé et tout son historique ?')) e.preventDefault(); }}>
  <button class="danger" type="submit">Supprimer ce bébé</button>
</form>


<style>
  form { display: grid; gap: 0.5rem; max-width: 320px; margin: 1rem 0; }
  .error { color: #b91c1c; } .ok { color: #047857; }
  .danger { background: #b91c1c; color: white; }
</style>
