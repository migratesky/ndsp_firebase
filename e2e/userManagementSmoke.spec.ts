import { test, expect } from '@playwright/test';

// Basic smoke test to verify page availability
test.describe('User Management Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate with longer timeout
    await page.goto('/admin/users', { timeout: 30000 });
    
    // Debug: log page content length
    console.log('Page content length:', (await page.content()).length);
  });

  test('Page loads with content', async ({ page }) => {
    // Verify basic page structure
    await expect(page.locator('body')).not.toBeEmpty({ timeout: 10000 });
    
    // Check for any heading containing "User" (case insensitive)
    const heading = page.locator('h1, h2, h3').filter({ hasText: /user/i });
    await expect(heading).toBeVisible({ timeout: 10000 });
    
    // Debug: capture screenshot
    await page.screenshot({ path: 'test-results/user-management-structure.png' });
  });

  test('Interactive elements exist', async ({ page }) => {
    // Verify at least one interactive element exists
    const buttons = await page.getByRole('button').count();
    expect(buttons).toBeGreaterThan(0);
    
    // Check for any table-like structure
    const tables = await page.locator('table, .table, [role="table"]').count();
    expect(tables).toBeGreaterThan(0);
    
    // Debug: capture screenshot
    await page.screenshot({ path: 'test-results/user-management-elements.png' });
  });
});
