import { test, expect } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

// Edge case: Empty content submission
test('Prevent empty content submission', async ({ page }) => {
  const fixture = new TestFixture(page, 'content-empty-submission.log');
  await fixture.setupLogging();

  // Mock API to reject empty content
  await page.route('**/api/content**', async route => {
    if (route.request().method() === 'POST') {
      const postData = route.request().postDataJSON();
      if (!postData.title || !postData.content) {
        return route.fulfill({
          status: 400,
          body: JSON.stringify({ error: 'Title and content required' })
        });
      }
    }
    return route.continue();
  });

  try {
    await page.goto('http://localhost:3000/admin/content');
    
    // Remove Next.js portal if present
    await page.evaluate(() => {
      const portal = document.querySelector('nextjs-portal');
      if (portal) portal.remove();
    });
    
    // Add timeout and force click if needed
    await page.click('button:has-text("Add Content")', { 
      timeout: 5000, 
      force: true 
    });
    
    // Attempt submission without required fields
    await page.click('[data-testid="submit-content-button"]', { 
      timeout: 5000 
    });
    
    // Verify error message appears
    await expect(page.locator('text=Title and content required')).toBeVisible({
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

// Add more edge case tests here
