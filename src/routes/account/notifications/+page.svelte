<script lang="ts">
  import { enhance } from '$app/forms';
  import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
  import Trash from 'phosphor-svelte/lib/Trash';
  import EnablePushButton from '$lib/components/EnablePushButton.svelte';
  import { formatDateTime } from '$lib/format';
  import * as m from '$paraglide/messages';

  let { data, form } = $props();
</script>

<p class="back"><a href="/account"><ArrowLeft size={14} /> {m.notif_back_to_account()}</a></p>

<h1>{m.notif_page_title()}</h1>
<p class="page-meta">{m.notif_page_meta()}</p>

<section class="card">
  <h2>{m.notif_section_this_device()}</h2>
  <EnablePushButton />
</section>

<section class="card">
  <h2>{m.notif_section_devices_count({ count: data.subscriptions.length })}</h2>
  {#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
  {#if data.subscriptions.length === 0}
    <p class="page-meta">{m.notif_no_devices()}</p>
  {:else}
    <ul class="devices">
      {#each data.subscriptions as s}
        <li>
          <div>
            <strong>{s.userAgent ?? m.notif_unknown_device()}</strong>
            <p class="page-meta">{m.notif_device_added_last_seen({ added: formatDateTime(s.createdAt * 1000, data.locale), seen: formatDateTime(s.lastSeenAt * 1000, data.locale) })}</p>
          </div>
          <form method="POST" action="?/revoke" use:enhance>
            <input type="hidden" name="id" value={s.id} />
            <button type="submit" class="btn btn-ghost btn-sm"><Trash size={14} /> {m.notif_revoke()}</button>
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
