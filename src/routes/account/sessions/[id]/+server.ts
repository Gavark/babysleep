import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { deleteSession, listSessionsForUser } from '$lib/server/auth/session';

export const POST: RequestHandler = async ({ params, locals }) => {
  if (!locals.user || !locals.session) throw redirect(303, '/login');
  if (params.id === locals.session.id) throw redirect(303, '/account');
  const { db } = getDb();
  const sessions = listSessionsForUser(db, locals.user.id);
  if (sessions.some((s) => s.id === params.id)) {
    deleteSession(db, params.id);
  }
  throw redirect(303, '/account');
};
