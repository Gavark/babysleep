type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowSec: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowSec });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}
