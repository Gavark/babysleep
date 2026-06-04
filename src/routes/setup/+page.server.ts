import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { hasNoUsers, createFirstAdmin } from '$lib/server/auth/bootstrap';
import { parseAcceptLanguage, SUPPORTED_LOCALES } from '$lib/server/auth/locale';
import * as m from '$paraglide/messages';

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
      return fail(400, { error: m.auth_password_mismatch(), email });
    }

    const locale = parseAcceptLanguage(
      request.headers.get('accept-language'),
      SUPPORTED_LOCALES,
      'fr'
    );
    const res = await createFirstAdmin(db, { email, password, locale });
    if (!res.ok) {
      const msg = ({
        'already-setup': m.auth_setup_already_setup(),
        'invalid-email': m.auth_invalid_email(),
        'weak-password': m.auth_password_too_short()
      })[res.reason];
      return fail(400, { error: msg, email });
    }
    throw redirect(303, '/login');
  }
};
