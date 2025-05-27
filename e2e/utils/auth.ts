import { Page } from '@playwright/test';

type AuthOptions = {
  role: 'admin' | 'editor' | 'viewer';
  email?: string;
};

export async function setupAuth(page: Page, options: AuthOptions) {
  await page.route('**/api/auth/session', (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          name: 'Test User',
          email: options.email || 'test@example.com',
          role: options.role,
        },
        expires: new Date(Date.now() + 86400).toISOString()
      })
    });
  });

  // Mock protected API routes
  await page.route('**/api/users**', (route) => route.continue());
}
