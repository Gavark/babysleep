import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser } from '$lib/server/babies';
import { getEntryForBabyDate, listEntriesInRange, upsertEntry } from '$lib/server/sleep-entries';
import { ageInMonths } from '$lib/sleep-calc';
import { paramsForAge } from '$lib/age-params';
import { isValidHHMM } from '$lib/time';
import { todayISOInTZ, resolveTimezone, isValidTimezone } from '$lib/tz';
import * as m from '$paraglide/messages';

function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
}

export const load: PageServerLoad = ({ locals, params }) => {
  if (!locals.user) throw redirect(303, '/login');
  const id = Number(params.id);
  const { db } = getDb();
  const baby = getBabyForUser(db, locals.user.id, id);
  if (!baby) throw error(404);
  const userTimezone = locals.user.timezone ?? 'Europe/Paris';
  const effectiveTz = resolveTimezone(null, baby.timezone, userTimezone);
  const today = todayISOInTZ(effectiveTz);
  const entry = getEntryForBabyDate(db, baby.id, today);
  const months = ageInMonths(baby.birthDate, baby.ageOverrideMonths ?? undefined);
  const params_ = paramsForAge(months);
  const recent = listEntriesInRange(db, baby.id, addDays(today, -7), today);
  return { baby, today, entry, ageMonths: months, ageParams: params_, recent, effectiveTz, userTimezone };
};

export const actions: Actions = {
  save: async ({ request, locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');
    const id = Number(params.id);
    const { db } = getDb();
    const baby = getBabyForUser(db, locals.user.id, id);
    if (!baby) throw error(404);
    const form = await request.formData();
    const fields = ['wake_time',
      'nap1_start', 'nap1_end',
      'nap2_start', 'nap2_end',
      'nap3_start', 'nap3_end',
      'nap4_start', 'nap4_end',
      'nap5_start', 'nap5_end',
      'nap6_start', 'nap6_end',
      'nap7_start', 'nap7_end',
      'nap8_start', 'nap8_end',
      'bedtime'] as const;
    const patch: Record<string, string | number | null> = {};
    for (const f of fields) {
      const v = String(form.get(f) ?? '').trim();
      if (v === '') patch[camel(f)] = null;
      else if (!isValidHHMM(v)) return fail(400, { error: m.today_entry_invalid_time({ field: f, value: v }) });
      else patch[camel(f)] = v;
    }
    const pauseFields = [
      'nap1_pause_min', 'nap2_pause_min', 'nap3_pause_min', 'nap4_pause_min',
      'nap5_pause_min', 'nap6_pause_min', 'nap7_pause_min', 'nap8_pause_min'
    ] as const;
    for (const f of pauseFields) {
      const raw = String(form.get(f) ?? '').trim();
      if (raw === '') { patch[camel(f)] = null; continue; }
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0 || n > 600) return fail(400, { error: m.today_entry_invalid_pause({ field: f, value: raw }) });
      patch[camel(f)] = Math.round(n) || null;
    }

    // HOTFIX v0.5.5: drop null values from time/nap fields so a stale form
    // (e.g. another device just wrote nap1_start that this device hasn't
    // re-loaded yet) doesn't erase the freshly-written value. The form
    // submits every field on every save (auto-submit on field change), so
    // any empty input would otherwise become null in DB and clobber a
    // concurrent edit. To explicitly clear a time field, edit it to another
    // value or delete the whole entry from the Day Detail page.
    const filteredNulls: string[] = [];
    for (const k of Object.keys(patch)) {
      if (patch[k] === null) { filteredNulls.push(k); delete patch[k]; }
    }

    // Explicit "clear this field" requests from the client: bypasses the
    // null-filter above by re-adding null for each field the user explicitly
    // asked to clear via the ✕ button. The `clear[]` form array is expected
    // to contain snake_case field names (matching `fields` and `pauseFields`).
    const timeFieldSet = new Set<string>([...fields, ...pauseFields] as readonly string[]);
    const explicitClears: string[] = [];
    for (const raw of form.getAll('clear')) {
      const name = typeof raw === 'string' ? raw : '';
      if (timeFieldSet.has(name)) {
        patch[camel(name)] = null;
        explicitClears.push(name);
      }
    }

    // notes + timezone are kept nullable here: they're explicit dropdown /
    // textarea choices, not race-prone time inputs.
    const notes = String(form.get('notes') ?? '').trim();
    patch.notes = notes || null;

    // Timezone: read from form, validate, compute effective TZ for date
    const tzRaw = String(form.get('timezone') ?? '').trim();
    const entryTz = tzRaw && isValidTimezone(tzRaw) ? tzRaw : null;
    patch.timezone = entryTz;

    const userTimezone = locals.user.timezone ?? 'Europe/Paris';
    const effectiveTz = resolveTimezone(entryTz, baby.timezone, userTimezone);
    const date = String(form.get('date') ?? todayISOInTZ(effectiveTz));
    const t0 = Date.now();
    const fieldsTouched = Object.entries(patch).filter(([, v]) => v !== null && v !== undefined).map(([k]) => k).join(',') || '(none)';
    try {
      upsertEntry(db, baby.id, date, patch as any);
      console.log(`[save] ok user=${locals.user.id} baby=${baby.id} date=${date} fields=[${fieldsTouched}] dropped_nulls=${filteredNulls.length} explicit_clears=${explicitClears.length} dt=${Date.now() - t0}ms`);
      return { success: m.today_entry_saved() };
    } catch (e) {
      console.error(`[save] FAIL user=${locals.user.id} baby=${baby.id} date=${date} fields=[${fieldsTouched}]`, e);
      return fail(500, { error: m.today_entry_save_failed() });
    }
  }
};

function camel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
