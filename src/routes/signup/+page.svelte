<script lang="ts">
  import { enhance } from '$app/forms';
  import UserPlus from 'phosphor-svelte/lib/UserPlus';
  let { data, form } = $props();
</script>

<div class="auth">
  <h1>Inscription</h1>

  {#if data.disabled}
    <p class="error">Inscription désactivée par l'administrateur.</p>
  {:else if !data.tokenValid}
    <p class="empty">Inscription sur invitation uniquement. Demande un lien à l'administrateur.</p>
  {:else}
    {#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
    <form method="POST" use:enhance class="card">
      <input type="hidden" name="token" value={data.token} />
      <label class="field">
        <span class="field-label">Email</span>
        <input class="field-input" type="email" name="email" autocomplete="username" required value={form?.email ?? ''} />
      </label>
      <label class="field">
        <span class="field-label">Mot de passe (≥ 10 caractères)</span>
        <input class="field-input" type="password" name="password" autocomplete="new-password" required minlength="10" />
      </label>
      <label class="field">
        <span class="field-label">Confirmer</span>
        <input class="field-input" type="password" name="confirm" autocomplete="new-password" required minlength="10" />
      </label>
      <button type="submit" class="btn btn-primary btn-block">
        <UserPlus size={18} />
        Créer mon compte
      </button>
    </form>
  {/if}
</div>

<style>
  .auth { max-width: 380px; margin: var(--s-6) auto 0; }
  .card { display: grid; gap: var(--s-3); }
</style>
