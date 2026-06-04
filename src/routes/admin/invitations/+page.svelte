<script lang="ts">
  import { enhance } from '$app/forms';
  import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
  import Plus from 'phosphor-svelte/lib/Plus';
  import Copy from 'phosphor-svelte/lib/Copy';
  import { formatDate } from '$lib/format';
  import * as m from '$paraglide/messages';
  let { data } = $props();

  type InvitationStatus = 'used' | 'expired' | 'pending';

  function statusOf(inv: { usedAt: number | null; expiresAt: number }): InvitationStatus {
    const now = Math.floor(Date.now() / 1000);
    if (inv.usedAt) return 'used';
    if (inv.expiresAt < now) return 'expired';
    return 'pending';
  }

  function statusLabel(status: InvitationStatus): string {
    if (status === 'used') return m.admin_invitations_status_used();
    if (status === 'expired') return m.admin_invitations_status_expired();
    return m.admin_invitations_status_pending();
  }

  function badgeClass(status: InvitationStatus): string {
    if (status === 'used') return 'badge';
    if (status === 'expired') return 'badge badge-danger';
    return 'badge badge-warning';
  }

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); } catch {}
  }
</script>

<p class="back"><a href="/app"><ArrowLeft size={14} /> {m.admin_invitations_back_to_app()}</a></p>

<h1>{m.admin_invitations_title()}</h1>

<form method="POST" action="?/create" use:enhance>
  <button type="submit" class="btn btn-primary"><Plus size={16} /> {m.admin_invitations_create()}</button>
</form>

{#if data.invitations.length === 0}
  <p class="empty">{m.admin_invitations_empty()}</p>
{:else}
  <div class="card" style="padding: 0; overflow-x: auto; margin-top: var(--s-4);">
    <table>
      <thead><tr><th>{m.admin_invitations_col_created()}</th><th>{m.admin_invitations_col_expires()}</th><th>{m.admin_invitations_col_status()}</th><th>{m.admin_invitations_col_link()}</th></tr></thead>
      <tbody>
        {#each data.invitations as inv}
          {@const st = statusOf(inv)}
          <tr>
            <td>{formatDate(inv.createdAt * 1000, data.locale)}</td>
            <td>{formatDate(inv.expiresAt * 1000, data.locale)}</td>
            <td><span class={badgeClass(st)}>{statusLabel(st)}</span></td>
            <td>
              <button type="button" class="btn btn-ghost btn-sm" onclick={() => copy(inv.link)} title={inv.link}>
                <Copy size={14} /> {m.admin_invitations_copy()}
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
