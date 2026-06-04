import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { findUsableInvitation } from '$lib/server/auth/invitations';
import { parseAcceptLanguage, SUPPORTED_LOCALES } from '$lib/server/auth/locale';
import { signupWithToken } from './_logic';

export const load: PageServerLoad = ({ url, locals }) => {
  if (locals.user) throw redirect(303, '/app');
  if (process.env.DISABLE_SIGNUP === 'true') {
    return { tokenValid: false, token: '', disabled: true };
  }
  const token = url.searchParams.get('token') ?? '';
  const { db } = getDb();
  const inv = findUsableInvitation(db, token);
  return { tokenValid: !!inv, token };
};

export const actions: Actions = {
  default: async ({ request, url }) => {
    if (process.env.DISABLE_SIGNUP === 'true') {
      return fail(403, { error: 'L\'inscription est désactivée.', email: '' });
    }
    const form = await request.formData();
    const token = String(form.get('token') ?? url.searchParams.get('token') ?? '');
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const confirm = String(form.get('confirm') ?? '');
    if (password !== confirm) {
      return fail(400, { error: 'Les mots de passe ne correspondent pas.', email });
    }
    const { db } = getDb();
    const locale = parseAcceptLanguage(
      request.headers.get('accept-language'),
      SUPPORTED_LOCALES,
      'fr'
    );
    const res = await signupWithToken(db, { token, email, password, locale });
    if (!res.ok) {
      const msg = ({
        'bad-token': 'Lien d\'invitation invalide ou expiré.',
        'weak-password': 'Mot de passe trop court (≥ 10 caractères).',
        'duplicate-email': 'Un compte existe déjà avec cet email.',
        'invalid-email': 'Email invalide.'
      })[res.reason];
      return fail(400, { error: msg, email });
    }
    throw redirect(303, '/login');
  }
};
