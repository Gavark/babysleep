import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { createBaby, listBabies } from '$lib/server/babies';

export const load: PageServerLoad = ({ locals }) => {
  if (!locals.user) throw redirect(303, '/login');
  const { db } = getDb();
  return { babies: listBabies(db, locals.user.id) };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/login');
    const form = await request.formData();
    const name = String(form.get('name') ?? '').trim();
    const birthDate = String(form.get('birth_date') ?? '');
    const overrideStr = String(form.get('age_override') ?? '').trim();
    const override = overrideStr === '' ? null : Math.max(0, Math.floor(Number(overrideStr)));
    const desiredWakeRaw = String(form.get('desired_wake') ?? '').trim();
    const desiredWakeTime = desiredWakeRaw === '' ? null : desiredWakeRaw;
    if (!name || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return fail(400, { error: 'Nom et date de naissance requis (YYYY-MM-DD).' });
    }
    try {
      const { db } = getDb();
      const baby = createBaby(db, locals.user.id, { name, birthDate, ageOverrideMonths: override, desiredWakeTime });
      throw redirect(303, `/app/babies/${baby.id}/today`);
    } catch (e) {
      if ((e as any)?.status === 303) throw e;
      return fail(400, { error: 'Échec de création.' });
    }
  }
};
