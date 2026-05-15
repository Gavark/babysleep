import type { Session, User } from '$lib/server/db/schema';

declare global {
  namespace App {
    interface Locals {
      user: User | null;
      session: Session | null;
      theme: 'auto' | 'light' | 'dark';
    }
    interface PageData {
      user: User | null;
    }
    interface Error {}
    interface Platform {}
  }
}

export {};
