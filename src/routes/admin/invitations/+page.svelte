<script lang="ts">
  import { enhance } from '$app/forms';
  import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
  import Plus from 'phosphor-svelte/lib/Plus';
  import Copy from 'phosphor-svelte/lib/Copy';
  let { data } = $props();

  function statusOf(inv: any): string {
    const now = Math.floor(Date.now() / 1000);
    if (inv.usedAt) return 'utilisée';
    if (inv.expiresAt < now) return 'expirée';
    return 'en attente';
  }

  function badgeClass(status: string): string {
    if (status === 'utilisée') return 'badge';
    if (status === 'expirée') return 'badge badge-danger';
    return 'badge badge-warning';
  }

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); } catch {}
  }
</script>

<p class="back"><a href="/app"><ArrowLeft size={14} /> Application</a></p>

<h1>Invitations</h1>

<form method="POST" action="?/create" use:enhance>
  <button type="submit" class="btn btn-primary"><Plus size={16} /> Générer une invitation</button>
</form>

{#if data.invitations.length === 0}
  <p class="empty">Aucune invitation. Génère le premier lien.</p>
{:else}
  <div class="card" style="padding: 0; overflow-x: auto; margin-top: var(--s-4);">
    <table>
      <thead><tr><th>Créée</th><th>Expire</th><th>Statut</th><th>Lien</th></tr></thead>
      <tbody>
        {#each data.invitations as inv}
          {@const st = statusOf(inv)}
          <tr>
            <td>{new Date(inv.createdAt * 1000).toLocaleDateString('fr-FR')}</td>
            <td>{new Date(inv.expiresAt * 1000).toLocaleDateString('fr-FR')}</td>
            <td><span class={badgeClass(st)}>{st}</span></td>
            <td>
              <button type="button" class="btn btn-ghost btn-sm" onclick={() => copy(inv.link)} title={inv.link}>
                <Copy size={14} /> Copier
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
