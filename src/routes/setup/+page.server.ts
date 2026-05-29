import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { hasNoUsers, createFirstAdmin } from '$lib/server/auth/bootstrap';

export const load: PageServerLoad = () => {
  const { db } = getDb();
  if (!hasNoUsers(db)) throw redirect(303, '/login');
  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    const { db } = getDb();
    if (!hasNoUsers(db)) throw redirect(303, '/login');

    const form = await request.formData();
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const confirm = String(form.get('confirm') ?? '');

    if (password !== confirm) {
      return fail(400, { error: 'Les mots de passe ne correspondent pas.', email });
    }

    const res = await createFirstAdmin(db, { email, password });
    if (!res.ok) {
      const msg = ({
        'already-setup': 'Un compte existe déjà. Recharge la page.',
        'invalid-email': 'Email invalide.',
        'weak-password': 'Mot de passe trop court (≥ 10 caractères).'
      })[res.reason];
      return fail(400, { error: msg, email });
    }
    throw redirect(303, '/login');
  }
};
