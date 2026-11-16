import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser } from '$lib/server/babies';
import { getEntryForBabyDate } from '$lib/server/sleep-entries';
import { isValidISODate } from '../../../../../app/babies/[id]/today/_logic';

/** One day's entry (or null), read by the Today page when it comes back to the foreground. */
export const GET: RequestHandler = ({ locals, params }) => {
  if (!locals.user) throw error(401);
  const { db } = getDb();
  const baby = getBabyForUser(db, locals.user.id, Number(params.id));
  if (!baby) throw error(404);
  if (!isValidISODate(params.date)) throw error(400, 'date must be a real YYYY-MM-DD day');
  return json({ entry: getEntryForBabyDate(db, baby.id, params.date) }, { headers: { 'cache-control': 'no-store' } });
};
