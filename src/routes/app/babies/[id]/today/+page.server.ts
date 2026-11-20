import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '#lib/server/db/index.ts';
import { getBabyForUser } from '#lib/server/babies.ts';
import { getEntryForBabyDate, upsertEntry } from '#lib/server/sleep-entries.ts';
import { ageInMonths } from '#lib/sleep-calc.ts';
import { paramsForAge } from '#lib/age-params.ts';
import { todayISOInTZ, resolveTimezone } from '#lib/tz.ts';
import * as m from '#paraglide/messages.js';
import { buildEntryPatch, isValidISODate } from './_logic';

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
  return { baby, today, entry, ageMonths: months, ageParams: params_, effectiveTz, userTimezone };
};

export const actions: Actions = {
  save: async ({ request, locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');
    const id = Number(params.id);
    const { db } = getDb();
    const baby = getBabyForUser(db, locals.user.id, id);
    if (!baby) throw error(404);
    const form = await request.formData();
    // The page always posts the day it shows; never guess one.
    const date = String(form.get('date') ?? '');
    if (!isValidISODate(date)) return fail(400, { error: m.today_entry_save_failed() });
    const built = buildEntryPatch(form);
    if (!built.ok) {
      return fail(400, {
        error: built.kind === 'time'
          ? m.today_entry_invalid_time({ field: built.field, value: built.value })
          : m.today_entry_invalid_pause({ field: built.field, value: built.value })
      });
    }
    const { patch, droppedNulls, explicitClears } = built;

    const t0 = Date.now();
    const fieldsTouched = Object.entries(patch).filter(([, v]) => v !== null && v !== undefined).map(([k]) => k).join(',') || '(none)';
    try {
      upsertEntry(db, baby.id, date, patch as any);
      console.log(`[save] ok user=${locals.user.id} baby=${baby.id} date=${date} fields=[${fieldsTouched}] dropped_nulls=${droppedNulls} explicit_clears=${explicitClears} dt=${Date.now() - t0}ms`);
      // The page merges this instead of reloading its data.
      return { success: m.today_entry_saved(), entry: getEntryForBabyDate(db, baby.id, date) };
    } catch (e) {
      console.error(`[save] FAIL user=${locals.user.id} baby=${baby.id} date=${date} fields=[${fieldsTouched}]`, e);
      return fail(500, { error: m.today_entry_save_failed() });
    }
  }
};
