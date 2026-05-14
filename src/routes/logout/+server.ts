import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { deleteSession } from '$lib/server/auth/session';

export const POST: RequestHandler = async ({ locals, cookies }) => {
  if (locals.session) {
    const { db } = getDb();
    deleteSession(db, locals.session.id);
  }
  cookies.delete('session', { path: '/' });
  throw redirect(303, '/login');
};
