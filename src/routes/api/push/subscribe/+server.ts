import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { registerSubscription } from '$lib/server/push/subscribe';
import { rateLimit } from '$lib/server/rate-limit';

export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
  if (!locals.user) throw redirect(303, '/login');

  const ip = getClientAddress();
  // 5 subscribe attempts per hour per (user, IP) — bounds damage if a
  // session is hijacked and the attacker tries to flood subscriptions.
  if (!rateLimit(`push-subscribe:${locals.user.id}:${ip}`, 5, 3600)) {
    throw error(429, 'Too many subscription attempts');
  }

  const body = await request.json().catch(() => null);
  const endpoint = typeof body?.endpoint === 'string' ? body.endpoint.trim() : '';
  const p256dh = typeof body?.p256dh === 'string' ? body.p256dh.trim() : '';
  const auth = typeof body?.auth === 'string' ? body.auth.trim() : '';
  const userAgent = typeof body?.userAgent === 'string' ? body.userAgent.slice(0, 500) : null;

  if (!endpoint.startsWith('https://') || !p256dh || !auth) {
    throw error(400, 'Invalid subscription payload');
  }
  if (endpoint.length > 1024) {
    throw error(400, 'Endpoint too long');
  }

  const { db } = getDb();
  registerSubscription(db, locals.user.id, { endpoint, p256dh, auth, userAgent });

  return new Response(null, { status: 204 });
};
