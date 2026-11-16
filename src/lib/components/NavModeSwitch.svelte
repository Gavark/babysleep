<script lang="ts">
  import type { NavMode } from '$lib/nav';

  let { to, label }: { to: NavMode; label: string } = $props();

  // Same contract as ThemeToggle: flip the <html> attribute for an immediate
  // CSS switch, then persist the choice in the cookie.
  async function apply() {
    if (to === 'classic') {
      document.documentElement.setAttribute('data-nav', 'classic');
    } else {
      document.documentElement.removeAttribute('data-nav');
    }
    const fd = new FormData();
    fd.set('value', to);
    try {
      await fetch('/api/nav', { method: 'POST', body: fd });
    } catch {
      /* network glitch — the page already switched, the cookie catches up on the next try */
    }
  }
</script>

<button type="button" class="btn btn-ghost btn-sm" onclick={apply}>{label}</button>
