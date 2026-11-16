<script lang="ts">
  import { page } from '$app/state';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
  import DropMenu from '$lib/components/DropMenu.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import NavModeSwitch from '$lib/components/NavModeSwitch.svelte';
  import { activeNavTab } from '$lib/nav';
  import Bed from 'phosphor-svelte/lib/Bed';
  import UserCircle from 'phosphor-svelte/lib/UserCircle';
  import Envelope from 'phosphor-svelte/lib/Envelope';
  import ArrowLeft from 'phosphor-svelte/lib/ArrowLeft';
  import CaretDown from 'phosphor-svelte/lib/CaretDown';
  import List from 'phosphor-svelte/lib/List';
  import * as m from '$paraglide/messages';

  let { children, data } = $props();

  const currentBaby = $derived(data.babies.find((b) => b.id === data.currentBabyId) ?? null);

  function subActive(suffix: string): string {
    const p = page.url.pathname;
    if (suffix === 'edit') return /\/babies\/\d+$/.test(p) ? 'sub-tab active' : 'sub-tab';
    return p.endsWith('/' + suffix) ? 'sub-tab active' : 'sub-tab';
  }

  function tabClass(id: number): string {
    return id === data.currentBabyId ? 'tab active' : 'tab';
  }
</script>

<!-- Phone navigation trial: both navigations are rendered and
     $lib/styles/nav.css shows one of them (see that file). -->
<header class="nav-mobile">
  {#if currentBaby}
    <DropMenu label={m.app_nav_switch_baby()}>
      {#snippet trigger()}
        <span class="nav-baby-name">{currentBaby.name}</span>
        <CaretDown size={14} weight="bold" />
      {/snippet}
      {#each data.babies as b}
        <a
          class="drop-item"
          href="/app/babies/{b.id}/today"
          aria-current={b.id === currentBaby.id ? 'true' : undefined}
        >{b.name}</a>
      {/each}
      <hr class="drop-sep" />
      <a class="drop-item" href="/app/babies">{m.app_nav_all_babies()}</a>
    </DropMenu>
  {:else}
    <a class="brand" href="/app">
      <Bed size={22} weight="duotone" />
      BabySleep
    </a>
  {/if}
  <DropMenu label={m.app_nav_menu()} align="right">
    {#snippet trigger()}<List size={22} />{/snippet}
    {#if currentBaby}
      <a class="drop-item" href="/app/babies/{currentBaby.id}/age-rules">{m.app_nav_age_rules()}</a>
      <a class="drop-item" href="/app/babies/{currentBaby.id}">{m.app_nav_edit()}</a>
      <hr class="drop-sep" />
    {/if}
    <a class="drop-item" href="/app/babies">{m.app_nav_babies()}</a>
    {#if data.isAdmin}
      <a class="drop-item" href="/admin/invitations"><Envelope size={16} /> {m.app_nav_invitations()}</a>
    {/if}
    <a class="drop-item" href="/account"><UserCircle size={16} /> {m.app_nav_account()}</a>
    <hr class="drop-sep" />
    <div class="drop-row">
      <LocaleSwitcher current={data.locale} />
      <ThemeToggle initial={data.theme ?? 'auto'} />
    </div>
    <NavModeSwitch to="classic" label={m.app_nav_use_classic()} />
  </DropMenu>
</header>

<div class="nav-classic">
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

  <p class="nav-try-new"><NavModeSwitch to="bottom" label={m.app_nav_try_new()} /></p>
</div>

<!-- Before the page content so it never becomes main's last child: pages
     rely on `p:last-child` for their closing margin. It is position: fixed. -->
{#if currentBaby}
  <BottomNav babyId={currentBaby.id} active={activeNavTab(page.url.pathname)} />
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
