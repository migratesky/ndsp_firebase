import { test, expect, Page } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

test('Verify school listing page loads', async ({ page }) => {
  const fixture = new TestFixture(page, 'school-listing.log');
  await fixture.setupLogging();

  fixture.debugLog('=== Starting school listing test ===');
  
  // Mock API response for schools
  await page.route('**/api/schools**', async route => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          _id: 'test-school-1',
          name: 'Test School',
          city: 'San Francisco',
          country: 'US',
          gradesServed: 'K-12'
        }])
      });
    }
    return route.continue();
  });

  try {
    await page.goto('http://localhost:3000/admin/schools');
    fixture.debugLog('Navigated to schools page');

    // Verify page elements
    await expect(page.getByRole('heading', { name: /schools/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /add school/i })).toBeVisible();
    
    // Verify school data displays
    await expect(page.getByText('Test School')).toBeVisible();
    await expect(page.getByText('San Francisco, US')).toBeVisible();
    
    fixture.logSuccess();
  } catch (error) {
    if (error instanceof Error) {
      await fixture.logError(error);
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
});

test('Filter schools by location', async ({ page }) => {
  const fixture = new TestFixture(page, 'school-filter.log');
  await fixture.setupLogging();

  // Mock API response with multiple schools
  await page.route('**/api/schools**', async route => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            _id: 'test-school-1',
            name: 'San Francisco School',
            city: 'San Francisco',
            country: 'US'
          },
          {
            _id: 'test-school-2',
            name: 'New York School',
            city: 'New York',
            country: 'US'
          }
        ])
      });
    }
    return route.continue();
  });

  try {
    await page.goto('http://localhost:3000/admin/schools');
    
    // Filter by city
    await page.fill('[placeholder="Filter by city"]', 'San Francisco');
    await page.keyboard.press('Enter');
    
    // Verify filtered results
    await expect(page.getByText('San Francisco School')).toBeVisible();
    await expect(page.getByText('New York School')).not.toBeVisible();
    
    fixture.logSuccess();
  } catch (error) {
    if (error instanceof Error) {
      await fixture.logError(error);
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
});
