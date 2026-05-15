import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb, schema } from '$lib/server/db';
import { listSessionsForUser } from '$lib/server/auth/session';
import { isValidTimezone } from '$lib/tz';
import { eq } from 'drizzle-orm';

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
  return {
    account: { email: locals.user.email, isAdmin: !!locals.user.isAdmin },
    sessions,
    userTimezone: locals.user.timezone ?? 'Europe/Paris'
  };
};

export const actions: Actions = {
  changePassword: async ({ request, locals }) => {
    if (!locals.user || !locals.session) throw redirect(303, '/login');
    const form = await request.formData();
    const { db } = getDb();
    const { changePassword } = await import('./_logic');
    const r = await changePassword(db, locals.user.id, locals.session.id, {
      current: String(form.get('current_password') ?? ''),
      next: String(form.get('new_password') ?? ''),
      confirm: String(form.get('confirm') ?? '')
    });
    if (!r.ok) {
      const msg = ({
        'wrong-current': 'Mot de passe actuel incorrect.',
        'mismatch': 'Les nouveaux mots de passe ne correspondent pas.',
        'weak': 'Mot de passe trop court (≥ 10 caractères).'
      })[r.reason];
      return fail(400, { error: msg });
    }
    return { success: 'Mot de passe modifié — vos autres appareils ont été déconnectés.' };
  },

  updateTimezone: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/login');
    const form = await request.formData();
    const tz = String(form.get('timezone') ?? '').trim();
    if (!tz || !isValidTimezone(tz)) {
      return fail(400, { tzError: 'Fuseau horaire invalide.' });
    }
    const { db } = getDb();
    const t = Math.floor(Date.now() / 1000);
    db.update(schema.users).set({ timezone: tz, updatedAt: t }).where(eq(schema.users.id, locals.user.id)).run();
    return { tzSuccess: 'Fuseau horaire mis à jour.' };
  }
};
