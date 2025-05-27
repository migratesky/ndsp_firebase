import type { Session } from 'next-auth';
import { Page } from '@playwright/test';

export const adminSession: Session = {
  user: {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  },
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
};

export async function setupAuth(page: Page) {
  await page.addInitScript((session: Session) => {
    window.localStorage.setItem('nextauth.message', JSON.stringify(session));
  }, adminSession);
}

export const authStorageState = {
  origins: [
    {
      origin: 'http://localhost:3000',
      localStorage: [
        {
          name: 'nextauth.message',
          value: JSON.stringify(adminSession)
        }
      ]
    }
  ]
};
