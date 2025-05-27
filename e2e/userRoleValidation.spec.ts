import { test, expect } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

test.describe('User Role Validation', () => {
  test('Admin can access all features', async ({ page }) => {
    const fixture = new TestFixture(page, 'admin-role.log');
    await fixture.setupLogging();
    
    // Enhanced API mocking with debug logging
    await page.route('**/api/auth/session', route => {
      fixture.debugLog('Mocking admin session');
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          user: { 
            role: 'admin',
            name: 'Test Admin'
          } 
        })
      });
    });

    // Debug: log network requests
    page.on('request', request => 
      fixture.debugLog(`Request: ${request.method()} ${request.url()}`)
    );
    page.on('response', response => 
      fixture.debugLog(`Response: ${response.status()} ${response.url()}`)
    );

    // Navigate with timeout and debug
    fixture.debugLog('Navigating to /admin/users');
    await page.goto('/admin/users', { timeout: 15000 });
    
    // Debug: capture page content
    const content = await page.content();
    fixture.debugLog(`Page content length: ${content.length}`);
    
    // Take screenshot before assertions
    await page.screenshot({ path: 'test-results/admin-role-before.png' });
    
    // Verify admin access with improved selectors
    const addButton = page.getByRole('button', { name: /add user/i });
    await expect(addButton).toBeVisible({ timeout: 10000 });
    
    const deleteButton = page.getByTestId('delete-user');
    await expect(deleteButton).toBeVisible({ timeout: 10000 });
    
    // Final screenshot
    await page.screenshot({ path: 'test-results/admin-role-after.png' });
    fixture.logSuccess();
  });

  test('Editor has limited access', async ({ page }) => {
    const fixture = new TestFixture(page, 'editor-role.log');
    await fixture.setupLogging();
    
    // Mock API with editor role
    await page.route('**/api/auth/session', route => {
      fixture.debugLog('Mocking editor session');
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ user: { role: 'editor' } })
      });
    });

    // Debug: log network requests
    page.on('request', request => 
      fixture.debugLog(`Request: ${request.method()} ${request.url()}`)
    );
    page.on('response', response => 
      fixture.debugLog(`Response: ${response.status()} ${response.url()}`)
    );

    // Navigate with timeout and debug
    fixture.debugLog('Navigating to /admin/users');
    await page.goto('/admin/users', { timeout: 15000 });
    
    // Debug: capture page content
    const content = await page.content();
    fixture.debugLog(`Page content length: ${content.length}`);
    
    // Take screenshot before assertions
    await page.screenshot({ path: 'test-results/editor-role-before.png' });
    
    // Verify editor access with improved selectors
    const addButton = page.getByRole('button', { name: /add user/i });
    await expect(addButton).not.toBeVisible({ timeout: 10000 });
    
    const deleteButton = page.getByTestId('delete-user');
    await expect(deleteButton).not.toBeVisible({ timeout: 10000 });
    
    // Final screenshot
    await page.screenshot({ path: 'test-results/editor-role-after.png' });
    fixture.logSuccess();
  });
});
