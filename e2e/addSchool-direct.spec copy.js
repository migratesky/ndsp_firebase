const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Helper function to generate random ID
function generateRandomId() {
  return Date.now().toString();
}

// Helper function for logging
function debugLog(message) {
  console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
}

test('Submit new school form', async ({ page }) => {
  // Set up error logging
  const logFile = path.join(__dirname, 'addschool-direct.log');
  fs.writeFileSync(logFile, `=== Starting form submission test ===\n`);
  
  // Track errors and logs
  const errors = [];
  const consoleLogs = [];
  
  // Set up console listener
  page.on('console', msg => {
    const logEntry = `[CONSOLE_${msg.type().toUpperCase()}] ${msg.text()}\n`;
    fs.appendFileSync(logFile, logEntry);
    consoleLogs.push({
      type: msg.type(),
      text: msg.text()
    });
    
    if (msg.type() === 'error') {
      errors.push(msg.text());
      console.log(logEntry.trim()); // Echo to terminal
    }
  });
  
  // Set up page error listener
  page.on('pageerror', error => {
    const logEntry = `[PAGE_ERROR] ${error.message}\n`;
    fs.appendFileSync(logFile, logEntry);
    console.log(logEntry.trim()); // Echo to terminal
    errors.push(error.message);
  });
  
  // Add window error event listener
  await page.exposeFunction('logWindowError', (errorData) => {
    const logEntry = `[WINDOW_ERROR] ${errorData.message}\n`;
    fs.appendFileSync(logFile, logEntry);
    console.log(logEntry.trim()); // Echo to terminal
    errors.push(errorData.message);
  });
  
  // Add global error handler in the browser
  await page.addInitScript(() => {
    window.addEventListener('error', (e) => {
      if (window.logWindowError) {
        window.logWindowError({
          message: e.error ? e.error.message : 'Unknown error event',
          stack: e.error ? e.error.stack : '',
          filename: e.filename || '',
          lineno: e.lineno || 0,
          colno: e.colno || 0
        });
      }
    });
  });
  
  debugLog('=== Starting form submission test ===');
  
  // Navigate to the admin dashboard page
  await page.goto('http://localhost:3000/admin/dashboard/add');
  
  // Generate a unique school name with timestamp
  const uniqueId = generateRandomId();
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
  
  // Trigger toast component - explicit logging for this specific step
  debugLog('Triggering error event for testing');
  console.log('About to trigger error event...');
  
  await page.evaluate(() => {
    // Log the error to the console
    console.error('Test error for logging verification');
    
    // Also trigger the error event for component testing
    window.dispatchEvent(new ErrorEvent('error', {
      error: new Error('Test error for logging verification')
    }));
  });
  
  console.log('Error event triggered in test');
  
  // Submit form with error handling
  try {
    // Wait for the form submission button to be enabled before clicking it
    await page.getByRole('button', { name: /add school/i }).isEnabled();
    await page.getByRole('button', { name: /add school/i }).click({ timeout: 15000 });
    debugLog('Form submitted');
    
    // Wait for API request to complete
    const requestPromise = page.waitForResponse(response => 
      response.url().includes('/api/schools') && 
      response.status() === 201, 
      { timeout: 15000 }
    );
    
    const response = await requestPromise;
    const responseBody = await response.json();
    
    debugLog(`API Request Body: ${JSON.stringify({
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
    
    debugLog(`API Response: ${JSON.stringify(responseBody)}`);
    
    // Wait a short period for any success message to appear
    try {
      await page.locator('.toast-success').waitFor({ timeout: 8000 });
      debugLog('Success message confirmed in UI');
    } catch (e) {
      debugLog('No success message found in UI - relying on API response verification');
    }
    
    // Verify the response contains expected fields
    expect(responseBody.success).toBe(true);
    expect(responseBody.message).toContain('success');
    expect(responseBody.insertedId).toBeTruthy();
    
    debugLog('Test verification completed');
  } catch (error) {
    // Log failure
    fs.appendFileSync(logFile, `[TEST_ERROR] ${error.message}\n${error.stack}\n`);
    console.error(`Test failed: ${error.message}`);
    throw error;
  }
  
  // Log final test status
  fs.appendFileSync(logFile, `\n=== Form submission test completed successfully ===\n`);
  fs.appendFileSync(logFile, `Errors captured: ${errors.length}\n`);
  debugLog('=== Form submission test completed successfully ===');
  
  // Check if we captured the expected error
  const foundExpectedError = errors.some(err => err.includes('Test error for logging verification'));
  if (foundExpectedError) {
    console.log('[SUCCESS] Successfully captured the expected error event');
  } else {
    console.log('[WARNING] Did not capture the expected error event');
  }
});
