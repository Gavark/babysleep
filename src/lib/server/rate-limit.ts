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

/** Drop entries whose window has already expired. Bounds memory under
 *  spray-from-many-IPs traffic that would otherwise leak buckets forever
 *  (each unique IP creates an entry that only gets recycled when the SAME
 *  IP shows up again post-window). */
export function purgeExpiredBuckets(now: number = Math.floor(Date.now() / 1000)): number {
  let dropped = 0;
  for (const [key, b] of buckets) {
    if (b.resetAt < now) {
      buckets.delete(key);
      dropped += 1;
    }
  }
  return dropped;
}

/** Test-only: not exported via `.d.ts`, intentional. */
export function _bucketCount(): number {
  return buckets.size;
}
