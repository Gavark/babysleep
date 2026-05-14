import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser } from '$lib/server/babies';
import { listEntriesInRange } from '$lib/server/sleep-entries';
import { buildSleepCsv } from '$lib/server/csv';

function isISODate(s: string | null): boolean {
  return !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function slug(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'baby';
}

export const GET: RequestHandler = async ({ locals, params, url }) => {
  if (!locals.user) throw redirect(303, '/login');
  const id = Number(params.id);
  const { db } = getDb();
  const baby = getBabyForUser(db, locals.user.id, id);
  if (!baby) throw error(404);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  if (!isISODate(from) || !isISODate(to)) throw error(400, 'from/to required as YYYY-MM-DD');
  const rows = listEntriesInRange(db, baby.id, from!, to!);
  const csv = buildSleepCsv(rows, baby.name);
  const filename = `babysleep_${slug(baby.name)}_${from}_${to}.csv`;
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
};
