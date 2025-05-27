import { test, expect } from '@playwright/test';

test('Static page test', async ({ page }) => {
  await page.setContent('<html><body><h1>Test Page</h1></body></html>');
  await expect(page.getByRole('heading', { name: 'Test Page' })).toBeVisible();
  console.log('Static test passed');
});
