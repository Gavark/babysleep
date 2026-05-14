<script lang="ts">
  import { enhance } from '$app/forms';
  let { data, form } = $props();
</script>

<h1>Inscription</h1>

{#if !data.tokenValid}
  <p>Inscription sur invitation uniquement. Demande un lien à l'administrateur.</p>
{:else}
  {#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
  <form method="POST" use:enhance>
    <input type="hidden" name="token" value={data.token} />
    <label>Email
      <input type="email" name="email" autocomplete="username" required value={form?.email ?? ''} />
    </label>
    <label>Mot de passe (≥ 10 caractères)
      <input type="password" name="password" autocomplete="new-password" required minlength="10" />
    </label>
    <label>Confirmer
      <input type="password" name="confirm" autocomplete="new-password" required minlength="10" />
    </label>
    <button type="submit">Créer mon compte</button>
  </form>
{/if}

<style>
  form { display: grid; gap: 1rem; max-width: 360px; }
  label { display: grid; gap: 0.25rem; }
  input { padding: 0.5rem; }
  button { padding: 0.5rem 1rem; }
  .error { color: #b91c1c; }
</style>
