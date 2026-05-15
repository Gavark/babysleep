<script lang="ts">
  import { enhance } from '$app/forms';
  import Plus from 'phosphor-svelte/lib/Plus';
  import Pencil from 'phosphor-svelte/lib/Pencil';
  let { data, form } = $props();
</script>

<h1>Mes bébés</h1>

<ul class="baby-list">
  {#each data.babies as b}
    <li class="card">
      <div>
        <strong>{b.name}</strong>
        <p class="page-meta" style="margin: 0;">né(e) le {b.birthDate}</p>
      </div>
      <div class="row-actions">
        <a class="btn btn-ghost btn-sm" href="/app/babies/{b.id}/today">Aujourd'hui</a>
        <a class="btn btn-secondary btn-sm" href="/app/babies/{b.id}"><Pencil size={14} /> Éditer</a>
      </div>
    </li>
  {/each}
</ul>

<h2>Ajouter un bébé</h2>
{#if form?.error}<p class="error">{form.error}</p>{/if}
<form method="POST" action="?/create" use:enhance class="card create-form">
  <label class="field"><span class="field-label">Prénom</span>
    <input class="field-input" name="name" required />
  </label>
  <label class="field"><span class="field-label">Date de naissance</span>
    <input class="field-input" type="date" name="birth_date" required />
  </label>
  <label class="field"><span class="field-label">Heure de réveil souhaitée (facultatif)</span>
    <input class="field-input" type="time" name="desired_wake" />
  </label>
  <label class="field"><span class="field-label">Âge corrigé (mois, facultatif)</span>
    <input class="field-input" type="number" name="age_override" min="0" max="60" />
  </label>
  <button type="submit" class="btn btn-primary"><Plus size={16} /> Créer</button>
</form>

<style>
  .baby-list { list-style: none; padding: 0; margin: 0 0 var(--s-5); display: grid; gap: var(--s-3); }
  .baby-list li { display: flex; justify-content: space-between; align-items: center; gap: var(--s-3); }
  .row-actions { display: flex; gap: var(--s-2); flex-wrap: wrap; }
  .create-form { display: grid; gap: var(--s-3); max-width: 480px; }
</style>
