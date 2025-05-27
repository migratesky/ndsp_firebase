import { test, expect, Page } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

test('Verify admin navigation', async ({ page }) => {
  const fixture = new TestFixture(page, 'admin-navigation.log');
  await fixture.setupLogging();

  fixture.debugLog('=== Starting admin navigation test ===');
  await page.goto('http://localhost:3000/admin');

  // Verify dashboard loads
  await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  fixture.debugLog('Admin dashboard loaded');

  // Test navigation to schools
  await page.locator('text=Schools').click();
  await expect(page).toHaveURL(/\/admin\/schools$/);
  fixture.debugLog('Navigated to schools page');

  // Test navigation back to dashboard
  await page.locator('text=Dashboard').click();
  await expect(page).toHaveURL(/\/admin$/);
  fixture.debugLog('Returned to dashboard');

  fixture.logSuccess();
});
