import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { AGE_PARAMS } from '$lib/age-params';

/**
 * `/` is the public landing page for anonymous visitors. Signed-in users keep
 * being sent straight to the app, which also keeps the PWA start_url ('/')
 * opening on the app once the owner is logged in.
 */
export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) throw redirect(303, '/app');

  // The wake-window figures on the page are read from the same table the app
  // schedules against, so the marketing copy can never claim numbers the
  // product does not actually use.
  return {
    ageBrackets: AGE_PARAMS.map((p) => ({
      key: p.key,
      ageMinMonths: p.ageMinMonths,
      ageMaxMonths: p.ageMaxMonths,
      awakeWindowMin: p.awakeWindowMin,
      naps: p.naps
    }))
  };
};
