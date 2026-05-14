<script lang="ts">
  import { enhance } from '$app/forms';
  let { data, form } = $props();
</script>

<h1>Mes bébés</h1>

<ul>
  {#each data.babies as b}
    <li>
      <a href="/app/babies/{b.id}/today">{b.name}</a> — né(e) le {b.birthDate}
      <a href="/app/babies/{b.id}">éditer</a>
    </li>
  {/each}
</ul>

<h2>Ajouter un bébé</h2>
{#if form?.error}<p class="error">{form.error}</p>{/if}
<form method="POST" action="?/create" use:enhance>
  <label>Prénom<input name="name" required /></label>
  <label>Date de naissance<input type="date" name="birth_date" required /></label>
  <label>Âge corrigé (mois, facultatif)<input type="number" name="age_override" min="0" max="60" /></label>
  <button type="submit">Créer</button>
</form>

<style>
  form { display: grid; gap: 0.5rem; max-width: 320px; }
  .error { color: #b91c1c; }
</style>
