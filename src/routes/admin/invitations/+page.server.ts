import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '#lib/server/db/index.ts';
import { createInvitation, listInvitations } from '#lib/server/auth/invitations.ts';
import * as m from '#paraglide/messages.js';

function requireAdmin(locals: App.Locals) {
  if (!locals.user) throw redirect(303, '/login');
  if (!locals.user.isAdmin) throw error(403, m.admin_invitations_forbidden());
}

export const load: PageServerLoad = ({ locals, url }) => {
  requireAdmin(locals);
  const { db } = getDb();
  const list = listInvitations(db).map((inv) => ({
    ...inv,
    link: `${url.origin}/signup?token=${inv.token}`
  }));
  return { invitations: list };
};

export const actions: Actions = {
  create: ({ locals }) => {
    requireAdmin(locals);
    const { db } = getDb();
    createInvitation(db, locals.user!.id);
    return { ok: true };
  }
};
