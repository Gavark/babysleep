<script lang="ts">
  import { enhance } from '$app/forms';
  import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
  import Trash from 'phosphor-svelte/lib/Trash';
  import EnablePushButton from '$lib/components/EnablePushButton.svelte';
  import { formatDateTime } from '$lib/format';

  let { data, form } = $props();
</script>

<p class="back"><a href="/account"><ArrowLeft size={14} /> Back to account</a></p>

<h1>Notifications</h1>
<p class="page-meta">Subscribed devices receive a push when a baby's wake window expires.</p>

<section class="card">
  <h2>This device</h2>
  <EnablePushButton />
</section>

<section class="card">
  <h2>Subscribed devices ({data.subscriptions.length})</h2>
  {#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
  {#if data.subscriptions.length === 0}
    <p class="page-meta">No devices subscribed yet.</p>
  {:else}
    <ul class="devices">
      {#each data.subscriptions as s}
        <li>
          <div>
            <strong>{s.userAgent ?? 'Unknown device'}</strong>
            <p class="page-meta">Added {formatDateTime(s.createdAt * 1000, data.locale)} · last seen {formatDateTime(s.lastSeenAt * 1000, data.locale)}</p>
          </div>
          <form method="POST" action="?/revoke" use:enhance>
            <input type="hidden" name="id" value={s.id} />
            <button type="submit" class="btn btn-ghost btn-sm"><Trash size={14} /> Revoke</button>
          </form>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .devices { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--s-2); }
  .devices li { display: flex; justify-content: space-between; align-items: center; gap: var(--s-3); padding: var(--s-2) 0; border-top: 1px solid var(--c-border); }
  .devices li:first-child { border-top: 0; }
</style>
