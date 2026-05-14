import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, isStrongEnough } from '../../src/lib/server/auth/password';

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
  it('rejects passwords shorter than 10 chars', () => {
    expect(isStrongEnough('short')).toBe(false);
    expect(isStrongEnough('123456789')).toBe(false);
  });
  it('accepts ≥ 10 chars', () => {
    expect(isStrongEnough('1234567890')).toBe(true);
  });
});
