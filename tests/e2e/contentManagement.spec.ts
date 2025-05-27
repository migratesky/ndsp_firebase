import { test, expect } from '@playwright/test';

test.describe('Content Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/content');
  });

  test('should display content table', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should add new content', async ({ page }) => {
    await page.getByTestId('add-content-button').click();
    
    await page.getByTestId('title-input').fill('Test Content');
    await page.getByTestId('type-input').fill('Article');
    await page.getByTestId('content-input').fill('This is test content');
    
    await page.getByTestId('submit-button').click();
    
    await expect(page.getByText('Test Content')).toBeVisible();
  });

  test('should toggle content status', async ({ page }) => {
    // First add test content
    await page.getByTestId('add-content-button').click();
    await page.getByTestId('title-input').fill('Toggle Test');
    await page.getByTestId('type-input').fill('Video');
    await page.getByTestId('content-input').fill('Toggle test content');
    await page.getByTestId('submit-button').click();
    
    // Get the ID of the newly created content
    const contentRow = page.locator('tr', { hasText: 'Toggle Test' });
    const toggleBtn = contentRow.getByTestId(/toggle-publish/);
    
    // Verify initial state and toggle
    await expect(toggleBtn).toContainText('Publish');
    await toggleBtn.click();
    await expect(toggleBtn).toContainText('Unpublish');
  });
});
