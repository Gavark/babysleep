import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { getVapidKeys } from '$lib/server/push/vapid';

/**
 * Return the VAPID public key as a base64url string for the browser's
 * `pushManager.subscribe({ applicationServerKey })`. No auth needed — the
 * public key is, by definition, public.
 */
export const GET: RequestHandler = async () => {
  const { db } = getDb();
  const keys = await getVapidKeys(db);
  return new Response(keys.publicKey, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
