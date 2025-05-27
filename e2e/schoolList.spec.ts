import { test, expect, Page } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

test('Verify school list functionality', async ({ page }) => {
  const fixture = new TestFixture(page, 'school-list.log');
  await fixture.setupLogging();

  fixture.debugLog('=== Starting school list test ===');
  await page.goto('http://localhost:3000/admin/schools');

  // Verify page loads
  await expect(page.locator('text=Schools')).toBeVisible();
  fixture.debugLog('Schools page loaded');

  // Verify add school button exists
  await expect(page.locator('text=Add New School')).toBeVisible();
  fixture.debugLog('Add school button present');

  // Verify school cards render
  const schoolCards = await page.locator('[data-testid="school-card"]').count();
  fixture.debugLog(`Found ${schoolCards} school cards`);
  
  if (schoolCards > 0) {
    // Test school card interaction
    await page.locator('[data-testid="school-card"]').first().click();
    await expect(page).toHaveURL(/\/admin\/schools\/[^\/]+$/);
    fixture.debugLog('School detail page loaded');
    await page.goBack();
  }

  fixture.logSuccess();
});
