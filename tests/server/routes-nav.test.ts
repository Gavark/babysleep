import { describe, it, expect } from 'vitest';
import { POST } from '../../src/routes/api/nav/+server';

function call(value: string) {
  const jar = new Map<string, string>([['nav', 'stale']]);
  const body = new FormData();
  body.set('value', value);
  const event = {
    request: new Request('http://localhost/api/nav', { method: 'POST', body }),
    cookies: {
      set: (k: string, v: string) => jar.set(k, v),
      delete: (k: string) => jar.delete(k)
    }
  };
  return { jar, response: POST(event as never) as Promise<Response> };
}

describe('POST /api/nav', () => {
  it('stores the classic mode in the nav cookie', async () => {
    const { jar, response } = call('classic');
    expect((await response).status).toBe(204);
    expect(jar.get('nav')).toBe('classic');
  });

  it('clears the cookie for the default bottom mode', async () => {
    const { jar, response } = call('bottom');
    expect((await response).status).toBe(204);
    expect(jar.has('nav')).toBe(false);
  });

  it('rejects an unknown value without touching the cookie', async () => {
    const { jar, response } = call('foo');
    expect((await response).status).toBe(400);
    expect(jar.get('nav')).toBe('stale');
  });
});
