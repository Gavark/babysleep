import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { SUPPORTED_LOCALES, type Locale } from '$lib/server/auth/locale';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
  const body = await request.json().catch(() => null);
  const locale = body?.locale;
  if (typeof locale !== 'string' || !(SUPPORTED_LOCALES as readonly string[]).includes(locale)) {
    throw error(400, 'Invalid locale');
  }
  const typed = locale as Locale;

  cookies.set('locale', typed, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365
  });

  if (locals.user) {
    const { db } = getDb();
    db.update(schema.users)
      .set({ locale: typed, updatedAt: Math.floor(Date.now() / 1000) })
      .where(eq(schema.users.id, locals.user.id))
      .run();
  }

  return new Response(null, { status: 204 });
};
