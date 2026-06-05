import { error, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { deleteSubscriptionByEndpoint } from '$lib/server/push/subscribe';
import * as schema from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) throw redirect(303, '/login');

  const body = await request.json().catch(() => null);
  const endpoint = typeof body?.endpoint === 'string' ? body.endpoint.trim() : '';
  if (!endpoint) throw error(400, 'endpoint required');

  const { db } = getDb();
  // Authz: only delete if the endpoint belongs to this user (defence in
  // depth — endpoints are already shared secrets between browser and push
  // service, but pinning ownership is cheap insurance).
  const row = db.select().from(schema.pushSubscriptions)
    .where(and(
      eq(schema.pushSubscriptions.endpoint, endpoint),
      eq(schema.pushSubscriptions.userId, locals.user.id)
    ))
    .all()[0];
  if (!row) throw error(404, 'Subscription not found');

  deleteSubscriptionByEndpoint(db, endpoint);
  return new Response(null, { status: 204 });
};
