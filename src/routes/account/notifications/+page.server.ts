import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { listSubscriptionsForUser, revokeSubscription } from '$lib/server/push/subscribe';

export const load: PageServerLoad = ({ locals }) => {
  if (!locals.user) throw redirect(303, '/login');
  const { db } = getDb();
  const subs = listSubscriptionsForUser(db, locals.user.id).map((s) => ({
    id: s.id,
    endpoint: s.endpoint,
    userAgent: s.userAgent,
    createdAt: s.createdAt,
    lastSeenAt: s.lastSeenAt
  }));
  return { subscriptions: subs };
};

export const actions: Actions = {
  revoke: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/login');
    const form = await request.formData();
    const id = Number(form.get('id'));
    if (!Number.isInteger(id)) return fail(400, { error: 'Invalid id' });
    const { db } = getDb();
    const ok = revokeSubscription(db, locals.user.id, id);
    if (!ok) return fail(404, { error: 'Subscription not found' });
    return { ok: true };
  }
};
