import { test, expect } from '@playwright/test';

test('Basic page content check', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  expect(title).toBeTruthy();
  console.log('Basic page check passed');
});
