import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  isStrongEnough,
  MIN_PASSWORD_LEN,
  MAX_PASSWORD_LEN
} from '../../src/lib/server/auth/password';

describe('hashPassword + verifyPassword', () => {
  it('produces different hashes for the same input', async () => {
    const a = await hashPassword('correct horse battery staple');
    const b = await hashPassword('correct horse battery staple');
    expect(a).not.toBe(b);
  });
  it('verifyPassword returns true for correct, false for wrong', async () => {
    const h = await hashPassword('hello world');
    expect(await verifyPassword(h, 'hello world')).toBe(true);
    expect(await verifyPassword(h, 'hello world!')).toBe(false);
  });
}, 20_000);

describe('isStrongEnough', () => {
  it('rejects passwords shorter than the minimum', () => {
    expect(isStrongEnough('short')).toBe(false);
    expect(isStrongEnough('123456789')).toBe(false);  // 9 chars
    expect(isStrongEnough('a'.repeat(MIN_PASSWORD_LEN - 1))).toBe(false);
  });
  it('accepts at the minimum length', () => {
    expect(isStrongEnough('1234567890')).toBe(true);  // 10 chars
    expect(isStrongEnough('a'.repeat(MIN_PASSWORD_LEN))).toBe(true);
  });
  it('rejects passwords longer than the maximum (anti-DoS cap)', () => {
    // Pathological multi-KB input would force argon2 to do orders of
    // magnitude more work than a normal login. Cap rejects without
    // reaching the hasher.
    expect(isStrongEnough('a'.repeat(MAX_PASSWORD_LEN + 1))).toBe(false);
    expect(isStrongEnough('a'.repeat(100_000))).toBe(false);
  });
  it('accepts at the maximum length', () => {
    expect(isStrongEnough('a'.repeat(MAX_PASSWORD_LEN))).toBe(true);
  });
});
