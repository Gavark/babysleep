import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser } from '$lib/server/babies';
import { getEntryForBabyDate, upsertEntry, deleteEntry } from '$lib/server/sleep-entries';
import { ageInMonths } from '$lib/sleep-calc';
import { paramsForAge } from '$lib/age-params';
import { isValidHHMM } from '$lib/time';
import { resolveTimezone } from '$lib/tz';
import * as msg from '$paraglide/messages';

function camel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export const load: PageServerLoad = ({ locals, params }) => {
  if (!locals.user) throw redirect(303, '/login');
  const id = Number(params.id);
  const date = String(params.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw error(400, msg.day_invalid_date());

  const { db } = getDb();
  const baby = getBabyForUser(db, locals.user.id, id);
  if (!baby) throw error(404);

  const entry = getEntryForBabyDate(db, baby.id, date);

  // Compute baby age AT that date (not today's age — important for old entries)
  const refDate = new Date(date + 'T12:00:00Z');
  const months = ageInMonths(baby.birthDate, baby.ageOverrideMonths ?? undefined, refDate);
  const ageParams = paramsForAge(months);

  const effectiveTz = resolveTimezone(entry?.timezone ?? null, baby.timezone, locals.user.timezone);

  return { baby, date, entry, ageMonths: months, ageParams, effectiveTz };
};

export const actions: Actions = {
  save: async ({ request, locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');
    const id = Number(params.id);
    const date = String(params.date);
    const { db } = getDb();
    const baby = getBabyForUser(db, locals.user.id, id);
    if (!baby) throw error(404);

    const form = await request.formData();
    const fields = [
      'wake_time',
      'nap1_start', 'nap1_end',
      'nap2_start', 'nap2_end',
      'nap3_start', 'nap3_end',
      'nap4_start', 'nap4_end',
      'nap5_start', 'nap5_end',
      'nap6_start', 'nap6_end',
      'nap7_start', 'nap7_end',
      'nap8_start', 'nap8_end',
      'bedtime'
    ] as const;
    const patch: Record<string, string | number | null> = {};
    for (const f of fields) {
      const v = String(form.get(f) ?? '').trim();
      if (v === '') patch[camel(f)] = null;
      else if (!isValidHHMM(v)) return fail(400, { error: msg.day_entry_invalid_time({ field: f, value: v }) });
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
      if (!Number.isFinite(n) || n < 0 || n > 600) return fail(400, { error: msg.day_entry_invalid_pause({ field: f, value: raw }) });
      patch[camel(f)] = Math.round(n) || null;
    }
    const notes = String(form.get('notes') ?? '').trim();
    patch.notes = notes || null;
    const formTz = String(form.get('timezone') ?? '').trim();
    patch.timezone = formTz || null;

    upsertEntry(db, baby.id, date, patch as any);
    return { success: msg.day_saved() };
  },

  delete: ({ locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');
    const id = Number(params.id);
    const date = String(params.date);
    const { db } = getDb();
    const baby = getBabyForUser(db, locals.user.id, id);
    if (!baby) throw error(404);
    const entry = getEntryForBabyDate(db, baby.id, date);
    if (entry) deleteEntry(db, entry.id);
    throw redirect(303, `/app/babies/${id}/history`);
  }
};
