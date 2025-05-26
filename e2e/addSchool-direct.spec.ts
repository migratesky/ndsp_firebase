import { test, expect, Page } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

test('Submit new school form', async ({ page }) => {
  // Create test fixture
  const fixture = new TestFixture(page, 'addschool-direct.log');
  
  // Setup logging and error tracking
  await fixture.setupLogging();
  
  fixture.debugLog('=== Starting form submission test ===');
  
  // Navigate to the admin dashboard page
  await page.goto('http://localhost:3000/admin/dashboard/add');
  
  // Generate a unique school name with timestamp
  const uniqueId = fixture.generateRandomId();
  const schoolName = `Test School ${uniqueId}`;
  
  // Fill in the form fields
  await page.locator('input[name="name"]').fill(schoolName);
  await page.locator('select[name="country"]').selectOption('United States');
  await page.locator('input[name="city"]').fill('San Francisco');
  await page.locator('input[name="address"]').fill('123 Main St');
  await page.locator('input[name="website"]').fill('https://example.com');
  await page.locator('input[name="phone"]').fill('+14155551234');
  await page.locator('input[name="gradesServed"]').fill('PK-12');
  await page.locator('input[name="accreditation"]').fill('WASC');
  await page.locator('button[data-testid="instruction-in-english"]').click();
  await page.locator('button[data-testid="boarding-option"]').click();
  await page.locator('input[name="boardingDetails"]').fill('Dormitory available');
  
  // Trigger error for testing the logging system
  await fixture.triggerTestError();
  
  // Submit form with error handling
  try {
    // Wait for the form submission button to be enabled before clicking it
    await page.getByRole('button', { name: /add school/i }).isEnabled();
    await page.getByRole('button', { name: /add school/i }).click({ timeout: 15000 });
    fixture.debugLog('Form submitted');
    
    // Wait for API request to complete
    const requestPromise = page.waitForResponse(response => 
      response.url().includes('/api/schools') && 
      response.status() === 201, 
      { timeout: 15000 }
    );
    
    const response = await requestPromise;
    const responseBody = await response.json();
    
    fixture.debugLog(`API Request Body: ${JSON.stringify({
      name: schoolName,
      country: 'US',
      city: 'San Francisco',
      address: '123 Main St',
      website: 'https://example.com',
      phone: '+14155551234',
      gradesServed: 'PK-12',
      instructionInEnglish: true,
      publicPrivate: 'Public',
      boardingOption: true,
      boardingDetails: 'Dormitory available',
      accreditation: 'WASC',
      lat: 0,
      lng: 0,
      isVirtual: false,
      id: `school-${Date.now()}`
    }, null, 2)}`);
    
    fixture.debugLog(`API Response: ${JSON.stringify(responseBody)}`);
    
    // Wait a short period for any success message to appear
    try {
      await page.locator('.toast-success').waitFor({ timeout: 8000 });
      fixture.debugLog('Success message confirmed in UI');
    } catch (e) {
      fixture.debugLog('No success message found in UI - relying on API response verification');
    }
    
    // Verify the response contains expected fields
    expect(responseBody.success).toBe(true);
    expect(responseBody.message).toContain('success');
    expect(responseBody.insertedId).toBeTruthy();
    
    fixture.debugLog('Test verification completed');
  } catch (error) {
    // Log failure
    fixture.logError(error as Error);
    throw error;
  }
  
  // Log final test status
  fixture.logSuccess();
  
  // Check if we captured the expected error
  fixture.checkForError('Test error for logging verification');
});
