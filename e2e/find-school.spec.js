const { test, expect } = require('./playwrightTestFixture');

test('find-school page should load without errors', async ({ page, testContext }) => {
  const { errors, assertNoErrors } = testContext;
  
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
  assertNoErrors();
});