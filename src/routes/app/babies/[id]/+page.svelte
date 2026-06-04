<script lang="ts">
  import { enhance } from '$app/forms';
  import { COMMON_TIMEZONES } from '$lib/tz';
  import Trash from 'phosphor-svelte/lib/Trash';
  import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk';
  import * as m from '$paraglide/messages';
  let { data, form } = $props();
</script>

<h1>{m.baby_form_title_edit({ name: data.baby.name })}</h1>

{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
{#if form?.success}<p class="ok">{form.success}</p>{/if}

<form method="POST" action="?/update" use:enhance class="card edit-form">
  <label class="field"><span class="field-label">{m.babies_form_name_label()}</span>
    <input class="field-input" name="name" value={data.baby.name} required />
  </label>
  <label class="field"><span class="field-label">{m.babies_form_birthdate_label()}</span>
    <input class="field-input" type="date" name="birth_date" value={data.baby.birthDate} required />
  </label>
  <label class="field"><span class="field-label">{m.baby_form_desired_wake_label()}</span>
    <input class="field-input" type="time" name="desired_wake" value={data.baby.desiredWakeTime ?? ''} />
  </label>
  <label class="field"><span class="field-label">{m.baby_form_age_override_label()}</span>
    <input class="field-input" type="number" name="age_override" min="0" max="60" value={data.baby.ageOverrideMonths ?? ''} />
  </label>
  <label class="field"><span class="field-label">{m.baby_form_timezone_label()}</span>
    <select class="field-select" name="timezone">
      <option value="">{m.baby_form_timezone_inherit()}</option>
      {#each COMMON_TIMEZONES as tz}
        <option value={tz} selected={data.baby.timezone === tz}>{tz}</option>
      {/each}
    </select>
  </label>
  <button type="submit" class="btn btn-primary"><FloppyDisk size={16} /> {m.baby_form_submit_save()}</button>
</form>

<form method="POST" action="?/delete" use:enhance
  onsubmit={(e) => { if (!confirm(m.baby_form_delete_confirm())) e.preventDefault(); }}
  style="margin-top: var(--s-4);"
>
  <button type="submit" class="btn btn-danger"><Trash size={16} /> {m.baby_form_delete_btn()}</button>
</form>

<style>
  .edit-form { display: grid; gap: var(--s-3); max-width: 480px; }
</style>
