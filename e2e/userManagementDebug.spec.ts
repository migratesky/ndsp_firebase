import { test } from '@playwright/test';
import fs from 'fs';

test('Debug page content', async ({ page }) => {
  // Navigate to page
  await page.goto('/admin/users');
  
  // Get full page content
  const content = await page.content();
  
  // Save content to file for analysis
  fs.writeFileSync('test-results/page-content.html', content);
  
  // Get all visible text
  const visibleText = await page.locator('body').textContent();
  fs.writeFileSync('test-results/visible-text.txt', visibleText || '');
  
  // Capture screenshot
  await page.screenshot({ path: 'test-results/debug-screenshot.png' });
});
