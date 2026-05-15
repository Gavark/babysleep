<script lang="ts">
  import { enhance } from '$app/forms';
  let { data } = $props();

  function statusOf(inv: any): string {
    const now = Math.floor(Date.now() / 1000);
    if (inv.usedAt) return 'utilisée';
    if (inv.expiresAt < now) return 'expirée';
    return 'en attente';
  }

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); } catch {}
  }
</script>

<p class="back"><a href="/app">← Application</a></p>
<h1>Invitations</h1>
<form method="POST" action="?/create" use:enhance>
  <button type="submit">Générer une invitation</button>
</form>

<table>
  <thead>
    <tr><th>Créée</th><th>Expire</th><th>Statut</th><th>Lien</th></tr>
  </thead>
  <tbody>
    {#each data.invitations as inv}
      <tr>
        <td>{new Date(inv.createdAt * 1000).toLocaleDateString('fr-FR')}</td>
        <td>{new Date(inv.expiresAt * 1000).toLocaleDateString('fr-FR')}</td>
        <td>{statusOf(inv)}</td>
        <td>
          <button type="button" onclick={() => copy(inv.link)} title={inv.link}>Copier</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table { border-collapse: collapse; width: 100%; margin-top: 1rem; }
  th, td { padding: 0.5rem; border-bottom: 1px solid #e5e7eb; text-align: left; }
  .back { margin: 0 0 0.5rem; font-size: 0.9rem; }
  .back a { color: #475569; text-decoration: none; }
  .back a:hover { color: #1F4E78; text-decoration: underline; }
</style>
