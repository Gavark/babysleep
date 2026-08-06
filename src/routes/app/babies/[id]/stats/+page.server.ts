import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser } from '$lib/server/babies';
import { listEntriesInRange } from '$lib/server/sleep-entries';
import { resolveTimezone, todayISOInTZ } from '$lib/tz';
import { aggregateByMonthAndRank } from '$lib/naps';

function addDaysISO(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
}

export const load: PageServerLoad = ({ locals, params, url }) => {
  if (!locals.user) throw redirect(303, '/login');
  const id = Number(params.id);
  const { db } = getDb();
  const baby = getBabyForUser(db, locals.user.id, id);
  if (!baby) throw error(404);

  const tz = resolveTimezone(null, baby.timezone, locals.user.timezone);
  const today = todayISOInTZ(tz);

  const preset = url.searchParams.get('preset'); // '7', '14', '30', '90', 'all', or null/'custom'
  let from = url.searchParams.get('from');
  let to = url.searchParams.get('to') ?? today;

  if (preset && preset !== 'custom') {
    if (preset === 'all') {
      from = '1900-01-01';
      to = today;
    } else {
      const days = Number(preset);
      if (Number.isFinite(days) && days > 0) {
        to = today;
        from = addDaysISO(today, -(days - 1));
      }
    }
  }
  if (!from) from = addDaysISO(to, -29); // default 30 days

  const entries = listEntriesInRange(db, baby.id, from, to);
  // listEntriesInRange returns desc; we want ASC for time-series charts
  const asc = [...entries].reverse();

  // The monthly chart deliberately ignores the period selector, so it needs
  // every entry — but only the aggregate is sent to the browser. Shipping the
  // raw history would grow without bound as the family keeps recording.
  // '1900-01-01' is the same lower bound the `all` preset already uses.
  const allEntries = listEntriesInRange(db, baby.id, '1900-01-01', today);
  const monthlyNaps = aggregateByMonthAndRank(allEntries);

  return {
    baby,
    from,
    to,
    preset: preset ?? 'custom',
    entries: asc,
    effectiveTz: tz,
    monthlyNaps
  };
};
