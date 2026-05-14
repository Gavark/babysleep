import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { attemptLogin } from './_logic';
import { setSessionCookie } from '../../hooks.server';

export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) throw redirect(303, '/app');
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const ua = request.headers.get('user-agent') ?? null;
    const { db } = getDb();
    const res = await attemptLogin(db, { email, password }, ua);
    if (!res.ok) return fail(400, { error: 'Identifiants invalides.', email });
    setSessionCookie(cookies, res.session.id);
    throw redirect(303, '/app');
  }
};
