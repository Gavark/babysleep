import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { getBabyForUser } from '$lib/server/babies';
import { listEntriesInRange, setNightRating, type NightRating } from '$lib/server/sleep-entries';
import { buildMonthGrid, computeDayMetrics, type DayMetrics } from '$lib/calendar';
import { resolveTimezone, todayISOInTZ } from '$lib/tz';

function parseMonth(raw: string | null, todayISO: string): { year: number; month: number } {
  if (raw && /^\d{4}-\d{2}$/.test(raw)) {
    const [y, m] = raw.split('-').map(Number);
    if (y >= 1970 && y <= 2999 && m >= 1 && m <= 12) {
      return { year: y, month: m };
    }
  }
  const [y, m] = todayISO.split('-').map(Number);
  return { year: y, month: m };
}

export const load: PageServerLoad = ({ locals, params, url }) => {
  if (!locals.user) throw redirect(303, '/login');
  const id = Number(params.id);
  const { db } = getDb();
  const baby = getBabyForUser(db, locals.user.id, id);
  if (!baby) throw error(404);

  const effectiveTz = resolveTimezone(null, baby.timezone, locals.user.timezone);
  const todayISO = todayISOInTZ(effectiveTz);

  const { year, month } = parseMonth(url.searchParams.get('month'), todayISO);

  const gridCells = buildMonthGrid(year, month);
  const from = gridCells[0].date;
  const to = gridCells[gridCells.length - 1].date;
  const entries = listEntriesInRange(db, baby.id, from, to);
  const byDate = new Map(entries.map((e) => [e.date, e]));

  const cells: DayMetrics[] = gridCells.map((c) => {
    const m = computeDayMetrics(c.date, byDate.get(c.date), baby, todayISO);
    return { ...m, inMonth: c.inMonth };
  });

  return {
    baby,
    year,
    month,
    cells,
    todayISO,
    effectiveTz
  };
};

export const actions: Actions = {
  rate: async ({ locals, params, request }) => {
    if (!locals.user) throw redirect(303, '/login');
    const id = Number(params.id);
    const { db } = getDb();
    const baby = getBabyForUser(db, locals.user.id, id);
    if (!baby) throw error(404);

    const form = await request.formData();
    const date = String(form.get('date') ?? '');
    const ratingRaw = String(form.get('rating') ?? '');

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail(400, { error: 'date invalide' });

    let rating: NightRating | null;
    if (ratingRaw === '') rating = null;
    else if (ratingRaw === 'good' || ratingRaw === 'medium' || ratingRaw === 'bad') rating = ratingRaw;
    else return fail(400, { error: 'note invalide' });

    setNightRating(db, baby.id, date, rating);
    return { success: true };
  }
};
