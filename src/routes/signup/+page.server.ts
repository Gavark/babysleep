import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { findUsableInvitation } from '$lib/server/auth/invitations';
import { parseAcceptLanguage, SUPPORTED_LOCALES } from '$lib/server/auth/locale';
import { signupWithToken } from './_logic';
import * as m from '$paraglide/messages';

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
      return fail(403, { error: m.auth_signup_disabled(), email: '' });
    }
    const form = await request.formData();
    const token = String(form.get('token') ?? url.searchParams.get('token') ?? '');
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const confirm = String(form.get('confirm') ?? '');
    if (password !== confirm) {
      return fail(400, { error: m.auth_password_mismatch(), email });
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
        'bad-token': m.auth_signup_bad_token(),
        'weak-password': m.auth_password_too_short(),
        'duplicate-email': m.auth_signup_duplicate_email(),
        'invalid-email': m.auth_invalid_email()
      })[res.reason];
      return fail(400, { error: msg, email });
    }
    throw redirect(303, '/login');
  }
};
