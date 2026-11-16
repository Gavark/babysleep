import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser } from '$lib/server/babies';
import { getEntryForBabyDate, listEntriesInRange, upsertEntry } from '$lib/server/sleep-entries';
import { ageInMonths } from '$lib/sleep-calc';
import { paramsForAge } from '$lib/age-params';
import { todayISOInTZ, resolveTimezone } from '$lib/tz';
import * as m from '$paraglide/messages';
import { buildEntryPatch } from './_logic';

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
    const built = buildEntryPatch(form);
    if (!built.ok) {
      return fail(400, {
        error: built.kind === 'time'
          ? m.today_entry_invalid_time({ field: built.field, value: built.value })
          : m.today_entry_invalid_pause({ field: built.field, value: built.value })
      });
    }
    const { patch, droppedNulls, explicitClears, entryTz } = built;

    const userTimezone = locals.user.timezone ?? 'Europe/Paris';
    const effectiveTz = resolveTimezone(entryTz ?? null, baby.timezone, userTimezone);
    const date = String(form.get('date') ?? todayISOInTZ(effectiveTz));
    const t0 = Date.now();
    const fieldsTouched = Object.entries(patch).filter(([, v]) => v !== null && v !== undefined).map(([k]) => k).join(',') || '(none)';
    try {
      upsertEntry(db, baby.id, date, patch as any);
      console.log(`[save] ok user=${locals.user.id} baby=${baby.id} date=${date} fields=[${fieldsTouched}] dropped_nulls=${droppedNulls} explicit_clears=${explicitClears} dt=${Date.now() - t0}ms`);
      return { success: m.today_entry_saved() };
    } catch (e) {
      console.error(`[save] FAIL user=${locals.user.id} baby=${baby.id} date=${date} fields=[${fieldsTouched}]`, e);
      return fail(500, { error: m.today_entry_save_failed() });
    }
  }
};
