import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb, schema } from '$lib/server/db';
import { listSessionsForUser } from '$lib/server/auth/session';
import { isValidTimezone } from '$lib/tz';
import { SUPPORTED_LOCALES, type Locale } from '$lib/server/auth/locale';
import { eq } from 'drizzle-orm';
import * as m from '$paraglide/messages';

export const load: PageServerLoad = ({ locals }) => {
  if (!locals.user) throw redirect(303, '/login');
  const { db } = getDb();
  const sessions = listSessionsForUser(db, locals.user.id).map((s) => ({
    id: s.id,
    userAgent: s.userAgent ?? m.account_sessions_unknown_ua(),
    lastUsedAt: s.lastUsedAt,
    expiresAt: s.expiresAt,
    isCurrent: s.id === locals.session?.id
  }));
  return {
    account: { email: locals.user.email, isAdmin: !!locals.user.isAdmin },
    sessions,
    userTimezone: locals.user.timezone ?? 'Europe/Paris',
    userLocale: locals.user.locale
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
        'wrong-current': m.account_password_wrong_current(),
        'mismatch': m.account_password_mismatch(),
        'weak': m.account_password_weak()
      })[r.reason];
      return fail(400, { error: msg });
    }
    return { success: m.account_password_success() };
  },

  updateTimezone: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/login');
    const form = await request.formData();
    const tz = String(form.get('timezone') ?? '').trim();
    if (!tz || !isValidTimezone(tz)) {
      return fail(400, { tzError: m.account_timezone_error() });
    }
    const { db } = getDb();
    const t = Math.floor(Date.now() / 1000);
    db.update(schema.users).set({ timezone: tz, updatedAt: t }).where(eq(schema.users.id, locals.user.id)).run();
    return { tzSuccess: m.account_timezone_success() };
  },

  updateLocale: async ({ request, locals, cookies }) => {
    if (!locals.user) throw redirect(303, '/login');
    const form = await request.formData();
    const value = String(form.get('locale') ?? '').trim();
    if (!(SUPPORTED_LOCALES as readonly string[]).includes(value)) {
      return fail(400, { localeError: m.account_locale_error() });
    }
    const typed = value as Locale;
    const { db } = getDb();
    const t = Math.floor(Date.now() / 1000);
    db.update(schema.users)
      .set({ locale: typed, updatedAt: t })
      .where(eq(schema.users.id, locals.user.id))
      .run();
    cookies.set('locale', typed, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365
    });
    return { localeSuccess: m.account_locale_success() };
  }
};
