<script lang="ts">
  import { page } from '$app/state';
  let { children, data } = $props();

  function tabClass(id: number) {
    return id === data.currentBabyId ? 'tab active' : 'tab';
  }

  function subActive(suffix: string): string {
    const p = page.url.pathname;
    if (suffix === 'edit') return /\/babies\/\d+$/.test(p) ? 'sub-tab active' : 'sub-tab';
    return p.endsWith('/' + suffix) ? 'sub-tab active' : 'sub-tab';
  }
</script>

<header>
  <nav>
    <a href="/app/babies">Bébés</a>
    {#if data.isAdmin}<a href="/admin/invitations">Invitations</a>{/if}
    <a href="/account">Compte</a>
  </nav>
  <div class="switcher">
    {#each data.babies as b}
      <a class={tabClass(b.id)} href="/app/babies/{b.id}/today">{b.name}</a>
    {/each}
  </div>

  {#if data.currentBabyId}
    <nav class="sub">
      <a class={subActive('today')}   href="/app/babies/{data.currentBabyId}/today">Aujourd'hui</a>
      <a class={subActive('history')} href="/app/babies/{data.currentBabyId}/history">Historique</a>
      <a class={subActive('stats')}   href="/app/babies/{data.currentBabyId}/stats">Stats</a>
      <a class={subActive('edit')}    href="/app/babies/{data.currentBabyId}">Éditer</a>
    </nav>
  {/if}
</header>

{@render children()}

<style>
  header { display: grid; gap: 0.5rem; margin-bottom: 1rem; }
  nav { display: flex; gap: 1rem; }
  .switcher { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .tab { padding: 0.25rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px; text-decoration: none; }
  .tab.active { background: #1F4E78; color: white; border-color: #1F4E78; }
  .sub { display: flex; gap: 1rem; font-size: 0.95rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; }
  .sub-tab { text-decoration: none; color: #475569; padding: 0.25rem 0.5rem; border-radius: 4px 4px 0 0; }
  .sub-tab.active { color: #1F4E78; font-weight: 600; border-bottom: 2px solid #1F4E78; }
</style>
