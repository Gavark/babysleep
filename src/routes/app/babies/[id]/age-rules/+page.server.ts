import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser } from '$lib/server/babies';
import { ageInMonths } from '$lib/sleep-calc';
import { AGE_PARAMS, findCurrentBracketIdx } from '$lib/age-params';

export const load: PageServerLoad = ({ locals, params }) => {
  if (!locals.user) throw redirect(303, '/login');
  const id = Number(params.id);
  const { db } = getDb();
  const baby = getBabyForUser(db, locals.user.id, id);
  if (!baby) throw error(404);
  const ageMonths = ageInMonths(baby.birthDate, baby.ageOverrideMonths ?? undefined);
  const currentBracketIdx = findCurrentBracketIdx(ageMonths);
  return {
    baby,
    ageMonths,
    currentBracketIdx,
    brackets: AGE_PARAMS.map((b) => ({ ...b }))
  };
};
