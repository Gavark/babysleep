<script lang="ts">
  import Sun from 'phosphor-svelte/lib/Sun';
  import ListBullets from 'phosphor-svelte/lib/ListBullets';
  import CalendarBlank from 'phosphor-svelte/lib/CalendarBlank';
  import ChartBar from 'phosphor-svelte/lib/ChartBar';
  import type { NavTab } from '$lib/nav';
  import * as m from '$paraglide/messages';

  let { babyId, active }: { babyId: number; active: NavTab | null } = $props();

  const tabs = [
    { tab: 'today', icon: Sun, label: m.app_nav_today },
    { tab: 'history', icon: ListBullets, label: m.app_nav_history },
    { tab: 'calendar', icon: CalendarBlank, label: m.app_nav_calendar },
    { tab: 'stats', icon: ChartBar, label: m.app_nav_stats }
  ] as const;
</script>

<!-- Styled and shown from $lib/styles/nav.css (phone widths only). -->
<nav class="bottom-nav" aria-label={m.app_nav_menu()}>
  {#each tabs as t (t.tab)}
    {@const Icon = t.icon}
    <a
      href="/app/babies/{babyId}/{t.tab}"
      aria-current={active === t.tab ? 'page' : undefined}
    >
      <Icon size={22} weight={active === t.tab ? 'fill' : 'regular'} />
      <span>{t.label()}</span>
    </a>
  {/each}
</nav>
