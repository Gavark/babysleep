<script lang="ts">
  let { children, data } = $props();

  function tabClass(id: number) {
    return id === data.currentBabyId ? 'tab active' : 'tab';
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
</header>

{@render children()}

<style>
  header { display: grid; gap: 0.5rem; margin-bottom: 1rem; }
  nav { display: flex; gap: 1rem; }
  .switcher { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .tab { padding: 0.25rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 4px; text-decoration: none; }
  .tab.active { background: #1F4E78; color: white; border-color: #1F4E78; }
</style>
