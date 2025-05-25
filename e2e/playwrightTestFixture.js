const { test: baseTest } = require('@playwright/test');
const fs = require('fs');

// Define an enhanced Playwright test fixture with built-in logging and error tracking
exports.test = baseTest.extend({
  testContext: async ({ page }, use) => {
    // Array to collect console logs
    const consoleLogs = [];
    
    // Array to collect errors
    const errors = [];
    
    // Enhanced console monitoring
    page.on('console', msg => {
      // Save logs to file
      fs.appendFileSync('out.log', msg.text() + '\n');
      consoleLogs.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
      
      // Track console errors
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log('CONSOLE ERROR:', msg.text());
      }
    });
    
    // Track page errors
    page.on('pageerror', error => {
      errors.push(error.message);
      console.log('PAGE ERROR:', error.message);
    });

    // Provide enhanced test context to tests
    await use({ 
      consoleLogs, 
      errors,
      assertNoErrors: () => expect(errors).toEqual([])
    });
    
    // After test completes
    console.log('Test execution logs:', consoleLogs);
  }
});
