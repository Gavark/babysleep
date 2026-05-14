import { handle as appHandle } from '../../src/hooks.server';

export async function callHandle(req: Request): Promise<Response> {
  const event: any = {
    request: req,
    url: new URL(req.url),
    cookies: makeCookies(req),
    locals: {},
    params: {},
    route: { id: '/' },
    isDataRequest: false,
    isSubRequest: false,
    platform: undefined,
    setHeaders: () => {},
    getClientAddress: () => '127.0.0.1'
  };
  const resolve = async () => new Response('ok');
  return appHandle({ event, resolve } as any);
}

function makeCookies(req: Request) {
  const jar = new Map<string, string>();
  const ck = req.headers.get('cookie') ?? '';
  for (const part of ck.split(';')) {
    const [k, v] = part.split('=').map((s) => s?.trim() ?? '');
    if (k) jar.set(k, decodeURIComponent(v ?? ''));
  }
  return {
    get: (k: string) => jar.get(k),
    set: (k: string, v: string) => jar.set(k, v),
    delete: (k: string) => jar.delete(k)
  };
}
