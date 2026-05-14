import type { Handle } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { rateLimit } from '$lib/server/rate-limit';
import {
  getSessionWithUser,
  refreshSessionIfStale,
  purgeExpiredSessions,
  SESSION_TTL_SEC
} from '$lib/server/auth/session';
import { bootstrapAdmin } from '$lib/server/auth/bootstrap';

const { db } = getDb();

let bootstrapped = false;
async function maybeBootstrap() {
  if (bootstrapped) return;
  bootstrapped = true;
  await bootstrapAdmin(db, { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
}

setInterval(() => purgeExpiredSessions(db), 3600 * 1000);

export const handle: Handle = async ({ event, resolve }) => {
  await maybeBootstrap();
  const path = event.url.pathname;
  if ((path === '/login' || path === '/signup') && event.request.method === 'POST') {
    const ip = event.getClientAddress();
    if (!rateLimit(`${path}:${ip}`, 5, 15 * 60)) {
      return new Response('Trop de tentatives, réessaie dans 15 minutes.', {
        status: 429,
        headers: { 'Retry-After': '900' }
      });
    }
  }
  const sessionId = event.cookies.get('session');
  event.locals.user = null;
  event.locals.session = null;
  if (sessionId) {
    const row = getSessionWithUser(db, sessionId);
    if (row) {
      refreshSessionIfStale(db, sessionId);
      event.locals.user = row.user;
      event.locals.session = row.session;
    } else {
      event.cookies.delete('session', { path: '/' });
    }
  }
  return resolve(event);
};

export function setSessionCookie(cookies: import('@sveltejs/kit').Cookies, sessionId: string) {
  cookies.set('session', sessionId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_SEC
  });
}
