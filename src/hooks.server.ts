import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getDb } from '$lib/server/db';
import { rateLimit, purgeExpiredBuckets } from '$lib/server/rate-limit';
import {
  getSessionWithUser,
  refreshSessionIfStale,
  purgeExpiredSessions,
  SESSION_TTL_SEC
} from '$lib/server/auth/session';
import { bootstrapAdmin, hasNoUsers } from '$lib/server/auth/bootstrap';
import { resolveLocale, type Locale } from '$lib/server/auth/locale';
import { overwriteGetLocale, overwriteServerAsyncLocalStorage } from '$paraglide/runtime';

const { db } = getDb();

// Paraglide v2 isolates per-request locale via AsyncLocalStorage. Wire it once
// at module init; each request stores its resolved locale in `run()` below.
// This guarantees that concurrent requests with different locales don't bleed
// into each other — `getLocale()` always reads from the current request's
// store via Node's async-context propagation.
//
// The store shape mirrors Paraglide's internal `ParaglideAsyncLocalStorage`
// (locale + origin + messageCalls — all optional) so the runtime accepts our
// instance. We only ever read `.locale` from it.
type ParaglideStore = {
  locale?: Locale;
  origin?: string;
  messageCalls?: Set<string>;
};
const asyncStorage = new AsyncLocalStorage<ParaglideStore>();
overwriteServerAsyncLocalStorage(asyncStorage);
overwriteGetLocale(() => asyncStorage.getStore()?.locale ?? 'fr');

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
  // Also allow /api/locale so the LocaleSwitcher works on the public /setup
  // page before any user exists (otherwise the POST gets 303'd to /setup).
  if (
    isInSetupMode() &&
    path !== '/setup' &&
    path !== '/healthz' &&
    path !== '/api/locale' &&
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
  // Locale resolution must come AFTER the session lookup so that a logged-in
  // user's `users.locale` preference participates in the fallback chain.
  const urlLang = event.url.searchParams.get('lang');
  const cookieLocale = event.cookies.get('locale') ?? null;
  const userLocale = event.locals.user?.locale ?? null;
  const acceptLanguage = event.request.headers.get('accept-language');
  const locale: Locale = resolveLocale({
    urlLang,
    cookieLocale,
    userLocale,
    acceptLanguage
  });
  event.locals.locale = locale;

  // Sync the cookie when the resolved value diverges from what's stored — e.g.
  // a logged-in user whose server preference differs from a stale cookie, or
  // a fresh visitor whose Accept-Language drove the resolution.
  if (cookieLocale !== locale) {
    event.cookies.set('locale', locale, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365
    });
  }

  const dataTheme = event.locals.theme === 'auto' ? '' : event.locals.theme;
  const response = await asyncStorage.run({ locale }, () =>
    resolve(event, {
      transformPageChunk: ({ html }) => {
        // Replace lang first (matches the literal `<html lang="fr"` emitted by
        // app.html), then the theme attribute injection still matches `<html`
        // correctly on the now-rewritten string.
        let out = html.replace('<html lang="fr"', `<html lang="${locale}"`);
        if (dataTheme) out = out.replace('<html', `<html data-theme="${dataTheme}"`);
        return out;
      }
    })
  );
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
