import { test, expect, Page } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

test('Create new user account', async ({ page }) => {
  // Create test fixture
  const fixture = new TestFixture(page, 'adduser-direct.log');
  
  // Setup logging without failing on console errors
  await fixture.setupLogging();
  
  fixture.debugLog('=== Starting user creation test ===');
  
  // Navigate to the user management page
  await page.goto('http://localhost:3000/admin/user-management/add');
  fixture.debugLog('Navigated to user management page');
  
  // Generate a unique username with timestamp
  const uniqueId = fixture.generateRandomId();
  const username = `testuser${uniqueId}@dodea.mil`;
  
  // Fill in the form fields
  fixture.debugLog('Filling form fields');
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="email"]').fill(`user${uniqueId}@example.com`);
  await page.locator('input[name="fullName"]').fill(`Test User ${uniqueId}`);
  await page.locator('button[id="role-School-DB-Editor"]').click();
  
  // Verify all required fields are filled
  fixture.debugLog('Verifying form fields');
  await expect(page.locator('input[name="username"]')).toHaveValue(username);
  await expect(page.locator('input[name="email"]')).toHaveValue(`user${uniqueId}@example.com`);
  await expect(page.locator('button[id="role-School-DB-Editor"][data-state="checked"]')).toBeVisible();
  
  // Submit form with error handling
  try {
    fixture.debugLog('Submitting form');
    await page.getByRole('button', { name: /create account/i }).click({ timeout: 15000 });
    
    
    // Verify redirection to users list
    await expect(page).toHaveURL(/\/admin\/user-management/i);
    fixture.debugLog('Redirected to users list');
    
    // Verify new user appears in the list with correct data
    const userRow = page.locator(`tr:has-text("${username}")`);
    await expect(userRow).toBeVisible({ timeout: 10000 });
    await expect(userRow.locator('td:nth-child(1)')).toHaveText(username);
    await expect(userRow.locator('td:nth-child(2)')).toHaveText(`user${uniqueId}@example.com`);
    await expect(userRow.locator('td:nth-child(3)')).toHaveText(`Test User ${uniqueId}`);
    await expect(userRow.locator('td:nth-child(4)')).toHaveText('School DB Editor');
    fixture.debugLog('New user visible in list with correct data');
    
    // Take screenshot
    await page.screenshot({ path: `test-results/add-user-${uniqueId}.png` });
    fixture.debugLog('Saved screenshot');
  } catch (error: unknown) {
    if (error instanceof Error) {
      fixture.logError(error);
      // Take screenshot on failure
      await page.screenshot({ path: `test-results/add-user-failure-${uniqueId}.png` });
      fixture.debugLog('Saved failure screenshot');
    }
    throw error;
  }
  
  fixture.logSuccess();
});
