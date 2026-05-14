import type { RequestHandler } from './$types';
import { getDb } from '$lib/server/db';

export const GET: RequestHandler = () => {
  try {
    const { sqlite } = getDb();
    sqlite.prepare('SELECT 1').get();
    return new Response('ok', { status: 200 });
  } catch (e) {
    return new Response('db error', { status: 503 });
  }
};
