import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser, updateBaby, deleteBaby } from '$lib/server/babies';
import { isValidTimezone } from '$lib/tz';
import * as m from '$paraglide/messages';

export const load: PageServerLoad = ({ locals, params }) => {
  if (!locals.user) throw redirect(303, '/login');
  const id = Number(params.id);
  const { db } = getDb();
  const baby = getBabyForUser(db, locals.user.id, id);
  if (!baby) throw error(404, m.baby_form_not_found());
  return { baby, userTimezone: locals.user.timezone ?? 'Europe/Paris' };
};

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');
    const id = Number(params.id);
    const form = await request.formData();
    const name = String(form.get('name') ?? '').trim();
    const birthDate = String(form.get('birth_date') ?? '');
    const overrideStr = String(form.get('age_override') ?? '').trim();
    const override = overrideStr === '' ? null : Math.max(0, Math.floor(Number(overrideStr)));
    const desiredWakeRaw = String(form.get('desired_wake') ?? '').trim();
    const desiredWakeTime = desiredWakeRaw === '' ? null : desiredWakeRaw;
    const tzRaw = String(form.get('timezone') ?? '').trim();
    const timezone = tzRaw === '' ? null : (isValidTimezone(tzRaw) ? tzRaw : null);
    const { db } = getDb();
    const ok = updateBaby(db, locals.user.id, id, { name, birthDate, ageOverrideMonths: override, desiredWakeTime, timezone });
    if (!ok) return fail(404, { error: m.baby_form_update_not_found() });
    return { success: m.baby_form_update_success() };
  },
  delete: ({ locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');
    const id = Number(params.id);
    const { db } = getDb();
    deleteBaby(db, locals.user.id, id);
    throw redirect(303, '/app/babies');
  }
};
