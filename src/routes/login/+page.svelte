<script lang="ts">
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>

<h1>Connexion</h1>
{#if form?.error}
  <p class="error" role="alert">{form.error}</p>
{/if}
<form method="POST" use:enhance>
  <label>
    Email
    <input type="email" name="email" autocomplete="username" required value={form?.email ?? ''} />
  </label>
  <label>
    Mot de passe
    <input type="password" name="password" autocomplete="current-password" required />
  </label>
  <button type="submit">Se connecter</button>
</form>

<style>
  form { display: grid; gap: 1rem; max-width: 360px; }
  label { display: grid; gap: 0.25rem; }
  input { padding: 0.5rem; }
  button { padding: 0.5rem 1rem; }
  .error { color: #b91c1c; }
</style>
