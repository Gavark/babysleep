import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { rateLimit, purgeExpiredBuckets } from '$lib/server/rate-limit';
import {
  getSessionWithUser,
  refreshSessionIfStale,
  purgeExpiredSessions,
  SESSION_TTL_SEC
} from '$lib/server/auth/session';
import { bootstrapAdmin, hasNoUsers } from '$lib/server/auth/bootstrap';

const { db } = getDb();

let bootstrapped = false;
async function maybeBootstrap() {
  if (bootstrapped) return;
  bootstrapped = true;
  await bootstrapAdmin(db, { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
}

// Becomes true the first time we observe a user row. Avoids querying on every
// hot-path request once the wizard has been completed.
let usersExist = false;
function isInSetupMode(): boolean {
  if (usersExist) return false;
  if (!hasNoUsers(db)) { usersExist = true; return false; }
  return true;
}

setInterval(() => purgeExpiredSessions(db), 3600 * 1000);
// Hourly sweep of the in-memory rate-limit map. Without this, every unique
// IP that ever hit /login or /signup keeps a bucket alive — under spray
// attacks from many IPs the Map would grow unbounded.
setInterval(() => purgeExpiredBuckets(), 3600 * 1000);

export const handle: Handle = async ({ event, resolve }) => {
  await maybeBootstrap();

  const path = event.url.pathname;
  // While the database has no user, force the visitor through the wizard.
  // Whitelist: /setup itself, the Docker healthcheck, SvelteKit assets, and
  // any path with a file extension (favicon, icons, manifest, fonts).
  if (
    isInSetupMode() &&
    path !== '/setup' &&
    path !== '/healthz' &&
    !path.startsWith('/_app/') &&
    !/\.[a-z0-9]+$/i.test(path)
  ) {
    throw redirect(303, '/setup');
  }

  const rawTheme = event.cookies.get('theme');
  event.locals.theme = rawTheme === 'light' || rawTheme === 'dark' ? rawTheme : 'auto';
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
  const dataTheme = event.locals.theme === 'auto' ? '' : event.locals.theme;
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => {
      if (!dataTheme) return html;
      return html.replace('<html', `<html data-theme="${dataTheme}"`);
    }
  });
  // Defence-in-depth response headers. HSTS is left to the reverse proxy
  // (Caddy) so the app stays usable behind plain HTTP for local debug.
  // CSP's frame-ancestors directive covers modern browsers; X-Frame-Options
  // keeps older clients safe from clickjacking.
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'same-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  return response;
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
