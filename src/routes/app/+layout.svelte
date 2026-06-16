<script lang="ts">
  import { page } from '$app/state';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
  import Bed from 'phosphor-svelte/lib/Bed';
  import UserCircle from 'phosphor-svelte/lib/UserCircle';
  import Envelope from 'phosphor-svelte/lib/Envelope';
  import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
  import * as m from '$paraglide/messages';

  let { children, data } = $props();

  function subActive(suffix: string): string {
    const p = page.url.pathname;
    if (suffix === 'edit') return /\/babies\/\d+$/.test(p) ? 'sub-tab active' : 'sub-tab';
    return p.endsWith('/' + suffix) ? 'sub-tab active' : 'sub-tab';
  }

  function tabClass(id: number): string {
    return id === data.currentBabyId ? 'tab active' : 'tab';
  }
</script>

<header class="app-header">
  <a class="brand" href="/app">
    <Bed size={22} weight="duotone" />
    BabySleep
  </a>
  <div class="header-right">
    <nav class="nav-row">
      <a class="nav-pill" href="/app/babies">{m.app_nav_babies()}</a>
      {#if data.isAdmin}
        <a class="nav-pill" href="/admin/invitations">
          <Envelope size={14} /> {m.app_nav_invitations()}
        </a>
      {/if}
      <a class="nav-pill" href="/account">
        <UserCircle size={14} /> {m.app_nav_account()}
      </a>
    </nav>
    <LocaleSwitcher current={data.locale} />
    <ThemeToggle initial={data.theme ?? 'auto'} />
  </div>
</header>

<div class="baby-tabs">
  {#each data.babies as b}
    <a class={tabClass(b.id)} href="/app/babies/{b.id}/today">{b.name}</a>
  {/each}
</div>

{#if data.currentBabyId}
  <p class="back"><a href="/app/babies"><ArrowLeft size={14} /> {m.app_nav_all_babies()}</a></p>
  <nav class="sub-nav">
    <a class={subActive('today')}    href="/app/babies/{data.currentBabyId}/today">{m.app_nav_today()}</a>
    <a class={subActive('history')}  href="/app/babies/{data.currentBabyId}/history">{m.app_nav_history()}</a>
    <a class={subActive('calendar')} href="/app/babies/{data.currentBabyId}/calendar">{m.app_nav_calendar()}</a>
    <a class={subActive('stats')}    href="/app/babies/{data.currentBabyId}/stats">{m.app_nav_stats()}</a>
    <a class={subActive('age-rules')} href="/app/babies/{data.currentBabyId}/age-rules">{m.app_nav_age_rules()}</a>
    <a class={subActive('edit')}     href="/app/babies/{data.currentBabyId}">{m.app_nav_edit()}</a>
  </nav>
{/if}

{@render children()}

<style>
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--s-3);
    gap: var(--s-3);
    flex-wrap: wrap;
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    flex-wrap: wrap;
  }
  .baby-tabs {
    display: flex;
    gap: var(--s-2);
    flex-wrap: wrap;
    margin-bottom: var(--s-3);
  }
</style>
