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

// Lower bound: anything shorter is trivially guessable.
// Upper bound: argon2id cost grows with input length; without a cap an
// attacker could submit a multi-megabyte "password" on /signup or
// /account changePassword and tie up a worker.
export const MIN_PASSWORD_LEN = 10;
export const MAX_PASSWORD_LEN = 1024;

export function isStrongEnough(plain: string): boolean {
  return (
    typeof plain === 'string' &&
    plain.length >= MIN_PASSWORD_LEN &&
    plain.length <= MAX_PASSWORD_LEN
  );
}
