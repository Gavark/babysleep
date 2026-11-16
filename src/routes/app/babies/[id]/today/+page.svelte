<script lang="ts">
  import TodayDay from './TodayDay.svelte';

  let { data } = $props();
</script>

<!-- One TodayDay per baby and day: switching baby (same route, reused page)
     or a new day gives a fresh instance whose saves target only its own day. -->
{#key `${data.baby.id}:${data.today}`}
  <TodayDay
    baby={data.baby}
    date={data.today}
    entry={data.entry}
    ageMonths={data.ageMonths}
    ageParams={data.ageParams}
    effectiveTz={data.effectiveTz}
    locale={data.locale}
  />
{/key}
