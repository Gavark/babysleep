<script lang="ts">
  import { enhance } from '$app/forms';
  import { COMMON_TIMEZONES } from '$lib/tz';
  let { data, form } = $props();

  let userTz = $state(data.userTimezone);
</script>

<p class="back"><a href="/app">← Application</a></p>
<h1>Mon compte</h1>
<p>Connecté en tant que <strong>{data.account.email}</strong>{#if data.account.isAdmin} (admin){/if}.</p>

<h2>Changer mon mot de passe</h2>
{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}
<form method="POST" action="?/changePassword" use:enhance>
  <label>Mot de passe actuel<input type="password" name="current_password" required autocomplete="current-password" /></label>
  <label>Nouveau (≥ 10 car.)<input type="password" name="new_password" required minlength="10" autocomplete="new-password" /></label>
  <label>Confirmer<input type="password" name="confirm" required minlength="10" autocomplete="new-password" /></label>
  <button type="submit">Modifier</button>
</form>

<h2>Fuseau horaire par défaut</h2>
{#if form?.tzError}<p class="error" role="alert">{form.tzError}</p>{/if}
{#if form?.tzSuccess}<p class="ok">{form.tzSuccess}</p>{/if}
<form method="POST" action="?/updateTimezone" use:enhance>
  <label>Fuseau horaire
    <select name="timezone" autocomplete="off"
      value={userTz}
      oninput={(e) => userTz = (e.currentTarget as HTMLSelectElement).value}
      onchange={(e) => userTz = (e.currentTarget as HTMLSelectElement).value}>
      {#each COMMON_TIMEZONES as tz}
        <option value={tz} selected={userTz === tz}>{tz}</option>
      {/each}
    </select>
  </label>
  <button type="submit">Enregistrer le fuseau</button>
</form>

<h2>Sessions actives</h2>
<table>
  <thead><tr><th>Appareil</th><th>Dernière activité</th><th>Expire</th><th></th></tr></thead>
  <tbody>
    {#each data.sessions as s}
      <tr>
        <td>{s.userAgent}{#if s.isCurrent}<em> — cet appareil</em>{/if}</td>
        <td>{new Date(s.lastUsedAt * 1000).toLocaleString('fr-FR')}</td>
        <td>{new Date(s.expiresAt * 1000).toLocaleDateString('fr-FR')}</td>
        <td>
          {#if !s.isCurrent}
            <form method="POST" action="/account/sessions/{s.id}" use:enhance>
              <button type="submit">Révoquer</button>
            </form>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<form method="POST" action="/logout"><button type="submit">Se déconnecter</button></form>

<style>
  form { display: grid; gap: 1rem; max-width: 360px; margin: 1rem 0; }
  table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
  th, td { padding: 0.5rem; border-bottom: 1px solid #e5e7eb; text-align: left; }
  .error { color: #b91c1c; } .ok { color: #047857; }
  .back { margin: 0 0 0.5rem; font-size: 0.9rem; }
  .back a { color: #475569; text-decoration: none; }
  .back a:hover { color: #1F4E78; text-decoration: underline; }
</style>
