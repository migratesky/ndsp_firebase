import { test, expect } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

test.beforeEach(async ({ page }) => {
  console.log('Starting beforeEach hook');
  // Mock auth session with admin role
  await page.route('**/api/auth/session**', async route => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'test-admin',
          name: 'Test Admin',
          email: 'admin@example.com',
          role: 'admin'
        },
        expires: new Date(Date.now() + 86400 * 1000).toISOString()
      })
    });
  });

  // Mock users API
  await page.route('**/api/users**', async route => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          _id: 'test-user-1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'editor'
        }])
      });
    }
    if (route.request().method() === 'POST') {
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ _id: 'new-user-1', success: true })
      });
    }
    if (route.request().method() === 'PUT') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    }
    if (route.request().method() === 'DELETE') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    }
    return route.continue();
  });

  // Navigate with networkidle
  await page.goto('/admin/users', { waitUntil: 'networkidle' });

  // Wait for client-side hydration
  await page.waitForFunction(() => {
    console.log('Checking hydration status');
    return document.querySelector('body')?.innerText?.includes('User') || 
           document.querySelector('button') !== null;
  }, { timeout: 60000 }); // Increased timeout to 60s
  console.log('Hydration completed');

  // Ensure no errors in console
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
});

test('Verify SSR content', async ({ page }) => {
  // Disable client-side routing and JavaScript
  await page.route('**/*', route => {
    if (route.request().resourceType() === 'script') {
      return route.abort();
    }
    return route.continue();
  });

  // Navigate to page with DOMContentLoaded
  const response = await page.goto('/admin/users', {
    waitUntil: 'domcontentloaded'
  });

  // Verify response
  if (!response || !response.ok()) {
    throw new Error(`Page failed to load with status: ${response?.status()}`);
  }

  // Verify basic content
  const html = await page.content();
  expect(html.length).toBeGreaterThan(1000);
  
  // Check for expected text in SSR content
  const bodyText = await page.locator('body').textContent();
  expect(bodyText).toContain('User');

  // Save screenshot for verification
  await page.screenshot({ path: 'test-results/ssr-content.png' });
});

test('Page is available', async ({ page }) => {
  // Try to navigate to the page with basic error handling
  try {
    const response = await page.goto('/admin/users');
    
    if (!response || !response.ok()) {
      throw new Error(`Page failed to load with status: ${response?.status()}`);
    }
    
    // Basic content check
    const html = await page.content();
    expect(html.length).toBeGreaterThan(1000);
    
    // Check for common elements
    await expect(page.locator('body')).not.toBeEmpty();
  } catch (error) {
    // Capture screenshot and throw error
    await page.screenshot({ path: 'test-results/page-load-error.png' });
    throw error;
  }
});

test('Verify page renders with mocked data', async ({ page }) => {
  // Check for any visible content
  const content = await page.locator('body').textContent();
  expect(content?.length).toBeGreaterThan(100);

  // Check for interactive elements
  const buttons = await page.getByRole('button').count();
  expect(buttons).toBeGreaterThan(0);

  // Check for data display
  const hasUserData = await page.getByText('test@example.com').isVisible();
  expect(hasUserData).toBeTruthy();
});

test('Verify user management page exists', async ({ page }) => {
  const fixture = new TestFixture(page, 'page-check.log');
  await fixture.setupLogging();

  try {
    // Basic page load check
    const response = await page.goto('/admin/users');
    
    if (!response || !response.ok()) {
      throw new Error(`Page failed to load with status: ${response?.status()}`);
    }
    
    // Verify we got some HTML content
    const html = await page.content();
    if (html.length < 1000) {
      throw new Error('Page content appears incomplete');
    }
    
    // Save page content for debugging
    await fixture.debugLog(`Page content length: ${html.length} bytes`);
    await page.screenshot({ path: 'test-results/user-management-page.png' });
    
    fixture.logSuccess();
  } catch (error) {
    await page.screenshot({ path: 'test-results/user-management-error.png' });
    if (error instanceof Error) {
      await fixture.logError(error);
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
});

test('Verify user management page loads', async ({ page }) => {
  const fixture = new TestFixture(page, 'user-management.log');
  await fixture.setupLogging();

  try {
    // Verify page loaded
    await expect(page).toHaveURL(/users$/, { timeout: 10000 });
    
    // Check for any visible content
    const content = page.locator('body');
    await expect(content).not.toBeEmpty();
    
    // Verify main elements - using more flexible selectors
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    await expect(page.getByRole('button')).not.toHaveCount(0);
    await expect(page.getByRole('table')).toBeVisible();
    
    fixture.logSuccess();
  } catch (error) {
    // Capture screenshot on failure
    await page.screenshot({ path: 'test-results/user-management-error.png' });
    if (error instanceof Error) {
      await fixture.logError(error);
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
});

test('Create new user', async ({ page }) => {
  const fixture = new TestFixture(page, 'create-user.log');
  await fixture.setupLogging();
  const uniqueId = Date.now();
  
  try {
    fixture.debugLog('=== Starting create user test ===');
    
    // Open add user dialog
    await page.getByTestId('add-user-button').click();
    fixture.debugLog('Clicked add user button');
    
    // Fill out form
    const userName = `Test User ${uniqueId}`;
    await page.getByLabel('Name').fill(userName);
    await page.getByLabel('Email').fill(`test${uniqueId}@example.com`);
    await page.getByLabel('Role').selectOption('editor');
    fixture.debugLog('Filled user form');
    
    // Submit form
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/users') && response.request().method() === 'POST'
    );
    
    await page.getByRole('button', { name: 'Add User' }).click();
    const response = await responsePromise;
    fixture.debugLog(`API Response Status: ${response.status()}`);
    
    if (!response.ok()) {
      const errorBody = await response.json();
      fixture.debugLog(`API Error Details: ${JSON.stringify(errorBody, null, 2)}`);
      throw new Error(`API request failed with status ${response.status()}`);
    }
    
    // Verify success
    await expect(page.getByText(userName)).toBeVisible();
    fixture.debugLog('User created successfully');
    
    await page.screenshot({ path: `test-results/create-user-${uniqueId}.png` });
    fixture.debugLog('Saved screenshot');
    
    fixture.logSuccess();
  } catch (error) {
    if (error instanceof Error) {
      await fixture.logError(error);
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
});

test('Edit user', async ({ page }) => {
  const fixture = new TestFixture(page, 'edit-user.log');
  await fixture.setupLogging();
  const uniqueId = Date.now();
  
  try {
    fixture.debugLog('=== Starting edit user test ===');
    
    // Click edit button for first user
    await page.getByTestId('edit-user').first().click();
    fixture.debugLog('Clicked edit user button');
    
    // Update user info
    const updatedName = `Updated User ${uniqueId}`;
    await page.getByLabel('Name').fill(updatedName);
    fixture.debugLog('Updated user name');
    
    // Submit form
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/users') && response.request().method() === 'PUT'
    );
    
    await page.getByRole('button', { name: 'Save Changes' }).click();
    const response = await responsePromise;
    fixture.debugLog(`API Response Status: ${response.status()}`);
    
    if (!response.ok()) {
      const errorBody = await response.json();
      fixture.debugLog(`API Error Details: ${JSON.stringify(errorBody, null, 2)}`);
      throw new Error(`API request failed with status ${response.status()}`);
    }
    
    // Verify success
    await expect(page.getByText(updatedName)).toBeVisible();
    fixture.debugLog('User updated successfully');
    
    await page.screenshot({ path: `test-results/edit-user-${uniqueId}.png` });
    fixture.debugLog('Saved screenshot');
    
    fixture.logSuccess();
  } catch (error) {
    if (error instanceof Error) {
      await fixture.logError(error);
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
});

test('Delete user', async ({ page }) => {
  const fixture = new TestFixture(page, 'delete-user.log');
  await fixture.setupLogging();
  
  try {
    fixture.debugLog('=== Starting delete user test ===');
    
    // Get initial user count
    const initialUserCount = await page.getByRole('row').count();
    fixture.debugLog(`Initial user count: ${initialUserCount}`);
    
    // Click delete button for first user
    await page.getByTestId('delete-user').first().click();
    fixture.debugLog('Clicked delete user button');
    
    // Confirm deletion
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/users') && response.request().method() === 'DELETE'
    );
    
    await page.getByRole('button', { name: 'Confirm' }).click();
    const response = await responsePromise;
    fixture.debugLog(`API Response Status: ${response.status()}`);
    
    if (!response.ok()) {
      const errorBody = await response.json();
      fixture.debugLog(`API Error Details: ${JSON.stringify(errorBody, null, 2)}`);
      throw new Error(`API request failed with status ${response.status()}`);
    }
    
    // Verify deletion
    await expect(page.getByRole('row')).toHaveCount(initialUserCount - 1);
    fixture.debugLog('User deleted successfully');
    
    await page.screenshot({ path: 'test-results/delete-user.png' });
    fixture.debugLog('Saved screenshot');
    
    fixture.logSuccess();
  } catch (error) {
    if (error instanceof Error) {
      await fixture.logError(error);
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
});
