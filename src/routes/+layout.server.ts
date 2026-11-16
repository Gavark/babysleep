import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
  return { user: locals.user, theme: locals.theme, nav: locals.nav, locale: locals.locale };
};
