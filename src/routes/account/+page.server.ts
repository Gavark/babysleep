import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { listSessionsForUser } from '$lib/server/auth/session';

export const load: PageServerLoad = ({ locals }) => {
  if (!locals.user) throw redirect(303, '/login');
  const { db } = getDb();
  const sessions = listSessionsForUser(db, locals.user.id).map((s) => ({
    id: s.id,
    userAgent: s.userAgent ?? 'inconnu',
    lastUsedAt: s.lastUsedAt,
    expiresAt: s.expiresAt,
    isCurrent: s.id === locals.session?.id
  }));
  return { account: { email: locals.user.email, isAdmin: !!locals.user.isAdmin }, sessions };
};

export const actions: Actions = {
  changePassword: () => {
    // populated in Task 26
    return { error: null as string | null, success: null as string | null };
  }
};
