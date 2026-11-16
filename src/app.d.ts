import type { Session, User } from '$lib/server/db/schema';
import type { Locale } from '$lib/server/auth/locale';

declare global {
  namespace App {
    interface Locals {
      user: User | null;
      session: Session | null;
      theme: 'auto' | 'light' | 'dark';
      nav: import('$lib/nav').NavMode;
      locale: Locale;
    }
    interface PageData {
      user: User | null;
    }
    interface Error {}
    interface Platform {}
  }
}

export {};
