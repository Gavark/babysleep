/**
 * Email helpers shared by every write/lookup path that touches users.email.
 * Centralising avoids new entry points accidentally storing mixed-case data
 * (the SQLite unique index on `email` is case-sensitive by default).
 */

/** Lowercase + trim. Idempotent. Always run before INSERT or WHERE on users.email. */
export function normalizeEmail(raw: string): string {
  return String(raw ?? '').toLowerCase().trim();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Practical RFC 5322 subset: local@domain.tld, no whitespace, dot in the domain. */
export function isValidEmail(raw: string): boolean {
  const e = normalizeEmail(raw);
  return e.length <= 254 && EMAIL_RE.test(e);
}
