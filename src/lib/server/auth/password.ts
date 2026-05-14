import { hash, verify } from '@node-rs/argon2';

const ARGON_OPTS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
  algorithm: 2 as const  // Argon2id = 2
};

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, ARGON_OPTS);
}

export async function verifyPassword(hashStr: string, plain: string): Promise<boolean> {
  try {
    return await verify(hashStr, plain);
  } catch {
    return false;
  }
}

export function isStrongEnough(plain: string): boolean {
  return typeof plain === 'string' && plain.length >= 10;
}
