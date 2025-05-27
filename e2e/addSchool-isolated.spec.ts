import { test, expect } from '@playwright/test';

test.describe('Add School - Isolated Test', () => {
  test('should successfully add a new school', async ({ page, baseURL }) => {
    console.log('Starting test: should successfully add a new school');
    
    // Navigate to the add school page
    await page.goto(`${baseURL}/admin/dashboard/add`);
    console.log('Navigated to add school page');

    // Fill out the form
    await page.fill('input[name="name"]', 'Test School');
    await page.fill('input[name="country"]', 'Test Country');
    await page.fill('input[name="city"]', 'Test City');
    console.log('Filled out school form fields');

    // Submit the form
    await page.click('button[type="submit"]');
    console.log('Submitted school form');

    // Verify success toast appears
    const toast = page.locator('[data-testid="toast-success"]');
    await expect(toast).toBeVisible();
    console.log('Verified success toast appears');

    // Verify redirection
    await page.waitForURL(`${baseURL}/admin/schools`);
    console.log('Verified redirection to schools list');
  });

  test('should show validation errors for empty fields', async ({ page, baseURL }) => {
    console.log('Starting test: should show validation errors');
    
    await page.goto(`${baseURL}/admin/dashboard/add`);
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    console.log('Submitted empty form');

    // Verify error messages
    await expect(page.locator('text="Name is required"')).toBeVisible();
    await expect(page.locator('text="Country is required"')).toBeVisible();
    await expect(page.locator('text="City is required"')).toBeVisible();
    console.log('Verified validation error messages');
  });
});
