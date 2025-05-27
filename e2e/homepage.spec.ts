import { test, expect } from '@playwright/test';

test('should load homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/NDSP/); // Adjust based on your app title
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
