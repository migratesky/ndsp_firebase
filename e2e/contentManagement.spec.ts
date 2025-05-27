import { test, expect, Page } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

test('Verify content management page loads', async ({ page }) => {
  const fixture = new TestFixture(page, 'content-management.log');
  await fixture.setupLogging();

  fixture.debugLog('=== Starting content management test ===');
  
  // Mock API response for content
  await page.route('**/api/content**', async route => {
    if (route.request().method() === 'GET') {
      fixture.debugLog('Mocking GET /api/content response');
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          _id: 'test-content-1',
          title: 'Test Content',
          type: 'article',
          published: false
        }])
      });
    }
    return route.continue();
  });

  try {
    await page.goto('/admin/content');
    fixture.debugLog('Navigated to content page');

    // Verify page elements
    await expect(page.getByRole('heading', { name: /content management/i })).toBeVisible();
    await expect(page.getByTestId('add-content-button')).toBeVisible();
    
    // Verify content displays
    await expect(page.getByText('Test Content')).toBeVisible();
    await expect(page.getByText('article')).toBeVisible();
    
    fixture.logSuccess();
  } catch (error) {
    if (error instanceof Error) {
      await fixture.logError(error);
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
});

test('Toggle content publish status', async ({ page }) => {
  const fixture = new TestFixture(page, 'content-toggle.log');
  await fixture.setupLogging();

  // Mock API responses
  await page.route('**/api/content**', async route => {
    if (route.request().method() === 'GET') {
      fixture.debugLog('Mocking initial GET /api/content response');
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          _id: 'test-content-1',
          title: 'Test Content',
          type: 'article',
          published: false
        }])
      });
    }
    return route.continue();
  });

  await page.route('**/api/content**', async route => {
    if (route.request().method() === 'PUT') {
      fixture.debugLog('Mocking PUT /api/content response');
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    }
    return route.continue();
  });

  try {
    await page.goto('/admin/content');
    
    // Toggle publish status
    const toggleButton = page.getByTestId('toggle-publish-test-content-1');
    await expect(toggleButton).toHaveText('Publish');
    await toggleButton.click();
    
    // Verify UI updates
    await expect(toggleButton).toHaveText('Unpublish');
    
    fixture.logSuccess();
  } catch (error) {
    if (error instanceof Error) {
      await fixture.logError(error);
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
});

test('Handle content loading error', async ({ page }) => {
  const fixture = new TestFixture(page, 'content-error.log');
  await fixture.setupLogging();

  // Mock error response
  await page.route('**/api/content**', async route => {
    fixture.debugLog('Mocking error response for /api/content');
    return route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' })
    });
  });

  try {
    await page.goto('/admin/content');
    
    // Verify error state
    await expect(page.getByText('Error loading content')).toBeVisible();
    await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();
    
    fixture.logSuccess();
  } catch (error) {
    if (error instanceof Error) {
      await fixture.logError(error);
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
});

test('Add new content item', async ({ page }) => {
  const fixture = new TestFixture(page, 'content-add.log');
  await fixture.setupLogging();

  // Enhanced API mocking
  await page.route('**/api/content**', async route => {
    fixture.debugLog(`Intercepted API call to: ${route.request().url()}`);
    
    if (route.request().method() === 'POST') {
      fixture.debugLog('Mocking POST /api/content');
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, id: 'new-content-item' })
      });
    }
    
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    });
  });

  try {
    fixture.debugLog('=== Starting add content test ===');
    await page.goto('/admin/content');
    
    // Handle Next.js portal if present
    await page.evaluate(() => {
      const portal = document.querySelector('nextjs-portal');
      if (portal) {
        portal.remove();
      }
    });
    
    // Click add button
    await page.getByTestId('add-content-button').click();
    fixture.debugLog('Clicked add content button');
    
    // Fill form
    await page.fill('[name="title"]', 'Test Content');
    await page.fill('[name="content"]', 'Test content body');
    await page.selectOption('[name="type"]', { label: 'Article' });
    fixture.debugLog('Filled form fields');
    
    // Submit
    await page.waitForTimeout(1000); // Add delay
    page.on('dialog', async dialog => {
      await expect(dialog.message()).toContain('Content created successfully');
      await dialog.accept();
    });
    await page.locator('[data-testid="submit-content-button"]').click();
    fixture.debugLog('Verified success alert');
    
    fixture.logSuccess();
  } catch (error) {
    await fixture.logError(error instanceof Error ? error : new Error('Unknown error'));
    throw error;
  }
});

test('Delete content item', async ({ page }) => {
  const fixture = new TestFixture(page, 'content-delete.log');
  await fixture.setupLogging();

  // Enhanced API mocking
  await page.route('**/api/content/test-content-1', async route => {
    fixture.debugLog(`Intercepted API call to: ${route.request().url()}`);
    
    if (route.request().method() === 'DELETE') {
      fixture.debugLog('Mocking DELETE /api/content/test-content-1');
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    }
    
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    });
  });

  try {
    fixture.debugLog('=== Starting delete content test ===');
    await page.goto('/admin/content');
    
    // Handle Next.js portal if present
    await page.evaluate(() => {
      const portal = document.querySelector('nextjs-portal');
      if (portal) {
        portal.remove();
      }
    });
    
    // Click delete button on first item
    page.on('dialog', async dialog => {
      if (dialog.message().includes('Are you sure')) {
        await dialog.accept();
      } else {
        await expect(dialog.message()).toContain('Content deleted successfully');
        await dialog.accept();
      }
    });
    await page.getByTestId('delete-button-test-content-1').click();
    fixture.debugLog('Clicked delete button');
    
    fixture.logSuccess();
  } catch (error) {
    await fixture.logError(error instanceof Error ? error : new Error('Unknown error'));
    throw error;
  }
});
