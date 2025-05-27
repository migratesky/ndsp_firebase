import { test, expect, Page } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

test('Validate required school form fields', async ({ page }) => {
  const fixture = new TestFixture(page, 'form-validation.log');
  await fixture.setupLogging();

  fixture.debugLog('=== Starting form validation test ===');
  await page.goto('http://localhost:3000/admin/schools/add');

  // Test required field validation
  fixture.debugLog('Testing required field validation');
  await page.getByRole('button', { name: /add school/i }).click();
  
  // Verify validation errors appear
  await expect(page.locator('text=Name is required')).toBeVisible();
  await expect(page.locator('text=Country is required')).toBeVisible();
  await expect(page.locator('text=City is required')).toBeVisible();
  
  fixture.logSuccess();
});
