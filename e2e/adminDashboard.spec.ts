import { test, expect, Page } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

test('Verify admin dashboard loads', async ({ page }) => {
  const fixture = new TestFixture(page, 'admin-dashboard.log');
  await fixture.setupLogging();

  fixture.debugLog('=== Starting admin dashboard test ===');
  await page.goto('http://localhost:3000/admin/dashboard');

  // Verify page loads
  await expect(page.getByRole('heading', { name: /admin panel/i })).toBeVisible();
  fixture.debugLog('Admin dashboard loaded');

  // Verify sidebar navigation elements
  await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /school db mgt/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /user mgt/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /content mgt/i })).toBeVisible();
  fixture.debugLog('Navigation elements present');

  fixture.logSuccess();
});

test('Verify quick actions work', async ({ page }) => {
  const fixture = new TestFixture(page, 'quick-actions.log');
  await fixture.setupLogging();
  
  await page.goto('http://localhost:3000/admin/dashboard');
  
  // Test Add New School button
  await page.getByRole('link', { name: /add new school/i }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard\/add/);
  await page.goBack();
  
  // Test Manage Users button
  await page.getByRole('link', { name: /manage users/i }).click();
  await expect(page).toHaveURL(/\/admin\/users/);
  await page.goBack();
  
  fixture.logSuccess();
});
