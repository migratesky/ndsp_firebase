import { test, expect, Page } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

test('Submit new school form', async ({ page }) => {
  // Create test fixture
  const fixture = new TestFixture(page, 'addschool-direct.log');
  
  // Setup logging without failing on console errors
  await fixture.setupLogging();
  
  fixture.debugLog('=== Starting form submission test ===');
  
  // Navigate to the admin dashboard page
  await page.goto('http://localhost:3000/admin/dashboard/add');
  fixture.debugLog('Navigated to add school page');
  
  // Generate a unique school name with timestamp
  const uniqueId = fixture.generateRandomId();
  const schoolName = `Test School ${uniqueId}`;
  
  // Fill in the form fields
  fixture.debugLog('Filling form fields');
  await page.locator('input[name="name"]').fill(schoolName);
  await page.locator('select[name="country"]').selectOption('US'); 
  await page.locator('input[name="city"]').fill('San Francisco');
  await page.locator('input[name="address"]').fill('123 Main St');
  await page.locator('input[name="website"]').fill('https://example.com');
  await page.locator('input[name="phone"]').fill('+14155551234');
  await page.locator('input[name="gradesServed"]').fill('PK-12');
  await page.locator('input[name="accreditation"]').fill('WASC');
  
  // Toggle options
  await page.locator('button[data-testid="instruction-in-english"]').click();
  await page.locator('button[data-testid="boarding-option"]').click();
  await page.locator('input[name="boardingDetails"]').fill('Dormitory available');
  
  // Verify all required fields are filled
  fixture.debugLog('Verifying form fields');
  await expect(page.locator('input[name="name"]')).toHaveValue(schoolName);
  await expect(page.locator('select[name="country"]')).toHaveValue('US'); 
  await expect(page.locator('input[name="city"]')).toHaveValue('San Francisco');
  
  // Submit form with error handling
  try {
    fixture.debugLog('Submitting form');
    await page.getByRole('button', { name: /add school/i }).click({ timeout: 15000 });
    
    // Verify success toast appears
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible({ timeout: 15000 });
    fixture.debugLog('Success toast appeared');
    
    // Verify redirection to schools list
    await expect(page).toHaveURL(/\/admin\/schools/i);
    fixture.debugLog('Redirected to schools list');
    
    // Verify new school appears in the list
    await expect(page.locator(`text=${schoolName}`).first()).toBeVisible({ timeout: 10000 });
    fixture.debugLog('New school visible in list');
    
    // Take screenshot
    await page.screenshot({ path: `test-results/add-school-${uniqueId}.png` });
    fixture.debugLog('Saved screenshot');
  } catch (error: unknown) {
    if (error instanceof Error) {
      fixture.logError(error);
      // Take screenshot on failure
      await page.screenshot({ path: `test-results/add-school-failure-${uniqueId}.png` });
      fixture.debugLog('Saved failure screenshot');
    }
    throw error;
  }
  
  fixture.logSuccess();
});
