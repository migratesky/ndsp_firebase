import { test, expect } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

// Focused test for content validation
test('Content field validation', async ({ page }) => {
  const fixture = new TestFixture(page, 'content-validation.log');
  await fixture.setupLogging();

  try {
    // Navigate and remove portal
    await page.goto('http://localhost:3000/admin/content');
    await page.evaluate(() => {
      const portal = document.querySelector('nextjs-portal');
      if (portal) portal.remove();
    });
    
    // Verify page loads with timeout
    await expect(page.locator('text=Content Management')).toBeVisible({
      timeout: 10000
    });
    
    // Robust button click with force and timeout
    const addButton = page.locator('[data-testid="add-content-button"]:visible');
    await addButton.click({ 
      timeout: 10000, 
      force: true 
    });
    
    // Verify form fields with timeout
    await expect(page.locator('[aria-required="true"]')).toHaveCount(2, {
      timeout: 5000
    });
    
    fixture.logSuccess();
  } catch (error: unknown) {
    if (error instanceof Error) {
      await fixture.logError(error);
    }
    throw error;
  }
});
