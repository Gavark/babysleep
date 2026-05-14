import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { listBabies } from '$lib/server/babies';

export const load: PageServerLoad = ({ locals, cookies }) => {
  if (!locals.user) throw redirect(303, '/login');
  const { db } = getDb();
  const babies = listBabies(db, locals.user.id);
  if (babies.length === 0) throw redirect(303, '/app/babies');
  const last = Number(cookies.get('last_baby_id'));
  const target = babies.find((b) => b.id === last) ?? babies[0];
  throw redirect(303, `/app/babies/${target.id}/today`);
};
