import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { listBabies } from '$lib/server/babies';

export const load: LayoutServerLoad = ({ locals, cookies, params, url }) => {
  if (!locals.user) throw redirect(303, '/login');
  const { db } = getDb();
  const babies = listBabies(db, locals.user.id);
  const currentId = Number(params.id);
  if (currentId && babies.some((b) => b.id === currentId)) {
    cookies.set('last_baby_id', String(currentId), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365
    });
  }
  return { babies, currentBabyId: currentId || null, isAdmin: !!locals.user.isAdmin };
};
