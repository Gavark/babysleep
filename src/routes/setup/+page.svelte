<script lang="ts">
  import { enhance } from '$app/forms';
  import Sparkle from 'phosphor-svelte/lib/Sparkle';
  let { form } = $props();
</script>

<svelte:head><title>Bienvenue — BabySleep</title></svelte:head>

<main class="setup">
  <div class="card">
    <header>
      <Sparkle size={24} weight="duotone" />
      <h1>Bienvenue sur BabySleep</h1>
      <p class="subtitle">
        Crée le premier compte administrateur. C'est lui qui pourra ensuite générer
        des invitations pour les autres utilisateurs.
      </p>
    </header>

    {#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}

    <form method="POST" use:enhance autocomplete="off">
      <label class="field">
        <span class="field-label">Email</span>
        <input class="field-input" name="email" type="email" required value={form?.email ?? ''} autocomplete="username" />
      </label>
      <label class="field">
        <span class="field-label">Mot de passe (≥ 10 caractères)</span>
        <input class="field-input" name="password" type="password" required minlength="10" autocomplete="new-password" />
      </label>
      <label class="field">
        <span class="field-label">Confirmer le mot de passe</span>
        <input class="field-input" name="confirm" type="password" required minlength="10" autocomplete="new-password" />
      </label>
      <button type="submit" class="btn btn-primary btn-block">Créer le compte</button>
    </form>
  </div>
</main>

<style>
  .setup {
    max-width: 480px;
    margin: var(--s-6) auto;
    padding: 0 var(--s-3);
  }
  .card { display: grid; gap: var(--s-4); }
  header { display: grid; gap: var(--s-2); justify-items: center; text-align: center; color: var(--c-text); }
  header h1 { margin: 0; font-size: var(--fs-xl); }
  .subtitle { margin: 0; color: var(--c-text-muted); font-size: var(--fs-sm); }
  form { display: grid; gap: var(--s-3); }
</style>
