<script lang="ts">
  import { enhance } from '$app/forms';
  import { COMMON_TIMEZONES } from '$lib/tz';
  import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
  import SignOut from 'phosphor-svelte/lib/SignOut';
  import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk';
  import Trash from 'phosphor-svelte/lib/Trash';
  let { data, form } = $props();
</script>

<p class="back"><a href="/app"><ArrowLeft size={14} /> Application</a></p>

<h1>Mon compte</h1>
<p class="page-meta">Connecté en tant que <strong>{data.account.email}</strong>{#if data.account.isAdmin} <span class="badge">admin</span>{/if}</p>

<h2>Fuseau horaire par défaut</h2>
{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}
<form method="POST" action="?/updateTimezone" use:enhance class="card tz-form">
  <label class="field">
    <span class="field-label">Fuseau</span>
    <select class="field-select" name="timezone">
      {#each COMMON_TIMEZONES as tz}
        <option value={tz} selected={data.userTimezone === tz}>{tz}</option>
      {/each}
    </select>
  </label>
  <button type="submit" class="btn btn-primary"><FloppyDisk size={16} /> Enregistrer</button>
</form>

<h2>Langue</h2>
{#if form?.localeError}<p class="error" role="alert">{form.localeError}</p>{/if}
{#if form?.localeSuccess}<p class="ok">{form.localeSuccess}</p>{/if}
<form method="POST" action="?/updateLocale" use:enhance class="card tz-form">
  <label class="field">
    <span class="field-label">Langue de l'interface</span>
    <select class="field-select" name="locale" autocomplete="off">
      <option value="fr" selected={data.userLocale === 'fr'}>Français</option>
      <option value="en" selected={data.userLocale === 'en'}>English</option>
    </select>
  </label>
  <button type="submit" class="btn btn-primary"><FloppyDisk size={16} /> Enregistrer</button>
</form>

<h2>Changer mon mot de passe</h2>
<form method="POST" action="?/changePassword" use:enhance class="card pw-form">
  <label class="field"><span class="field-label">Mot de passe actuel</span>
    <input class="field-input" type="password" name="current_password" required autocomplete="current-password" />
  </label>
  <label class="field"><span class="field-label">Nouveau (≥ 10 caractères)</span>
    <input class="field-input" type="password" name="new_password" required minlength="10" autocomplete="new-password" />
  </label>
  <label class="field"><span class="field-label">Confirmer</span>
    <input class="field-input" type="password" name="confirm" required minlength="10" autocomplete="new-password" />
  </label>
  <button type="submit" class="btn btn-primary"><FloppyDisk size={16} /> Modifier le mot de passe</button>
</form>

<h2>Sessions actives</h2>
<ul class="sessions">
  {#each data.sessions as s}
    <li class="card session-row">
      <div>
        <strong>{s.userAgent}</strong>{#if s.isCurrent} <span class="badge badge-success">cet appareil</span>{/if}
        <p class="page-meta" style="margin:0;">Dernière activité : {new Date(s.lastUsedAt * 1000).toLocaleString('fr-FR')} · expire le {new Date(s.expiresAt * 1000).toLocaleDateString('fr-FR')}</p>
      </div>
      {#if !s.isCurrent}
        <form method="POST" action="/account/sessions/{s.id}" use:enhance>
          <button type="submit" class="btn btn-ghost btn-sm"><Trash size={14} /> Révoquer</button>
        </form>
      {/if}
    </li>
  {/each}
</ul>

<form method="POST" action="/logout" style="margin-top: var(--s-4);">
  <button type="submit" class="btn btn-secondary"><SignOut size={16} /> Se déconnecter</button>
</form>

<style>
  .tz-form, .pw-form { display: grid; gap: var(--s-3); max-width: 480px; }
  .sessions { list-style: none; padding: 0; margin: 0 0 var(--s-3); display: grid; gap: var(--s-2); }
  .session-row { display: flex; justify-content: space-between; align-items: center; gap: var(--s-3); }
</style>
