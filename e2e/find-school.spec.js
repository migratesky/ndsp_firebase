const { test, expect } = require('@playwright/test');

test('find-school page should load without errors', async ({ page }) => {
  // Array to collect console logs
  const consoleLogs = [];
  
  // Array to collect errors
  const errors = [];
  
  // Listen to console events
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
    
    // Fail test if there's an error in console
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log('CONSOLE ERROR:', msg.text());
    }
  });
  
  // Listen to page errors
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log('PAGE ERROR:', error.message);
  });
  
  // Navigate to the page
  await page.goto('http://localhost:3000/find-school');

  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  
  // Check for React errors by looking for error boundary content
  const errorBoundary = await page.locator('[data-testid="error-boundary"]').count();
  if (errorBoundary > 0) {
    const errorContent = await page.locator('[data-testid="error-boundary"]').first().textContent();
    errors.push(`React Error Boundary triggered: ${errorContent}`);
    console.log('REACT ERROR BOUNDARY:', errorContent);
  }
  
  // Assert no errors were found
  expect(errors).toEqual([]);
  
  // Log all console messages for debugging
  console.log('Page console logs:', consoleLogs);
});