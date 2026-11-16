import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const form = await request.formData();
  const value = String(form.get('value') ?? 'bottom');
  if (value !== 'bottom' && value !== 'classic') {
    return new Response('invalid', { status: 400 });
  }
  if (value === 'bottom') {
    cookies.delete('nav', { path: '/' });
  } else {
    cookies.set('nav', value, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365
    });
  }
  return new Response(null, { status: 204 });
};
