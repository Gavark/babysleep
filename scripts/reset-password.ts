import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { getDb } from '../src/lib/server/db';
import * as schema from '../src/lib/server/db/schema';
import { hashPassword, isStrongEnough } from '../src/lib/server/auth/password';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: npm run reset-password -- <email>');
    process.exit(1);
  }
  const rl = createInterface({ input: stdin, output: stdout });
  const password = await rl.question('New password (≥ 10 chars): ');
  rl.close();
  if (!isStrongEnough(password)) {
    console.error('Password too short.');
    process.exit(1);
  }
  const { db } = getDb();
  const user = db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase().trim())).all()[0];
  if (!user) {
    console.error(`No user with email ${email}`);
    process.exit(1);
  }
  const hash = await hashPassword(password);
  const t = Math.floor(Date.now() / 1000);
  db.update(schema.users).set({ passwordHash: hash, updatedAt: t }).where(eq(schema.users.id, user.id)).run();
  db.delete(schema.sessions).where(eq(schema.sessions.userId, user.id)).run();
  console.log(`Password reset for ${email}. All sessions revoked.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
