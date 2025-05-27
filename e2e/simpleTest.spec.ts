import { test, expect } from '@playwright/test';

test('Basic test', async ({ page }) => {
  await page.goto('about:blank');
  await expect(page).toHaveTitle('');
  console.log('Basic test passed');
});
