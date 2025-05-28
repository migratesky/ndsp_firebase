import { test, expect, Page, APIRequestContext } from '@playwright/test';
import { TestFixture } from './fixtures/testFixture';

// Helper function to format debug messages
function formatMessage(...args: any[]): string {
  return args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');
}

// Helper function to test API endpoint directly
async function testApiEndpoint(fixture: TestFixture, request: APIRequestContext) {
  try {
    fixture.debugLog('Testing /api/users endpoint directly...');
    const startTime = Date.now();
    const response = await request.get('http://localhost:3000/api/users');
    const duration = Date.now() - startTime;
    
    fixture.debugLog(`API Response Status: ${response.status()}`);
    fixture.debugLog(`Response Time: ${duration}ms`);
    
    if (!response.ok()) {
      const error = await response.text().catch(() => 'No error details');
      throw new Error(`API Error: ${response.status()} - ${error}`);
    }
    
    const data = await response.json();
    fixture.debugLog(`API Response Data: ${JSON.stringify(data, null, 2)}`);
    return data;
  } catch (error) {
    fixture.debugLog(`API Test Failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

test('Load user management page', async ({ page, request }) => {
  // Create test fixture
  const fixture = new TestFixture(page, 'user-management-test.log');
  
  try {
    // Setup logging
    await fixture.setupLogging();
    
    fixture.debugLog('=== Starting user management page test ===');
    
    // First, test the API endpoint directly
    try {
      await testApiEndpoint(fixture, request);
    } catch (error) {
      fixture.debugLog('Direct API test failed, but continuing with UI test...');
    }
    
    // Add request and response logging
    page.on('request', request => {
      const url = request.url();
      // Only log API requests to reduce noise
      if (url.includes('/api/') || url.includes('user-management')) {
        fixture.debugLog(`>> ${request.method()} ${url}`);
      }
    });
    
    page.on('response', async response => {
      const url = response.url();
      const status = response.status();
      
      // Only log API responses to reduce noise
      if (url.includes('/api/') || url.includes('user-management')) {
        const logMsg = `<< ${status} ${response.statusText()} - ${url}`;
        fixture.debugLog(logMsg);
        
        if (status >= 400) {
          try {
            const body = await response.json();
            fixture.debugLog(`Error response: ${JSON.stringify(body, null, 2)}`);
          } catch (e) {
            // Ignore JSON parse errors
          }
        }
      }
    });
    
    // Create test-results directory if it doesn't exist
    try {
      await page.context().addInitScript(() => {
        window.addEventListener('unhandledrejection', event => {
          console.error('Unhandled rejection:', event.reason);
        });
        
        window.addEventListener('error', event => {
          console.error('Uncaught error:', event.error || event.message);
        });
      });
    } catch (e) {
      fixture.debugLog('Error setting up error handlers: ' + (e as Error).message);
    }
    
    // Navigate to the user management page with timeout
    fixture.debugLog('Navigating to user management page...');
    try {
      const response = await page.goto('http://localhost:3000/admin/user-management', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      if (!response?.ok()) {
        throw new Error(`Page load failed with status ${response?.status()}`);
      }
    } catch (error) {
      fixture.debugLog(`Page navigation error: ${error instanceof Error ? error.message : String(error)}`);
      // Take a screenshot of the current page
      await page.screenshot({ path: 'test-results/page-navigation-error.png', fullPage: true });
      throw error;
    }
    
    // Wait for either the users table or an error message
    fixture.debugLog('Waiting for content to load...');
    try {
      // First, check if there's a loading indicator
      try {
        await page.waitForSelector('[data-testid="loading-indicator"]', { state: 'visible', timeout: 2000 });
        fixture.debugLog('Loading indicator found, waiting for content...');
      } catch (e) {
        fixture.debugLog('No loading indicator found, checking for content directly...');
      }

      // Wait for either content or error with a race
      const result = await Promise.race([
        page.waitForSelector('table', { state: 'visible', timeout: 15000 })
          .then(() => 'table'),
        page.waitForSelector('.error-message, [data-testid*="error"], [role="alert"]', { state: 'visible', timeout: 10000 })
          .then(() => 'error'),
        page.waitForSelector('body', { state: 'visible', timeout: 5000 })
          .then(async () => {
            // If we get here, the body is visible but we don't know the state
            const hasError = await page.evaluate(() => {
              return document.body.innerText.includes('error') || 
                     document.body.innerText.includes('failed') ||
                     document.body.innerText.includes('Error');
            });
            return hasError ? 'error' : 'unknown';
          })
      ]);
      
      if (result === 'error') {
        const errorElement = await page.$('.error-message, [data-testid*="error"], [role="alert"]');
        if (errorElement) {
          const errorText = await errorElement.textContent();
          throw new Error(`Page displayed error: ${errorText}`);
        } else {
          const pageText = await page.evaluate(() => document.body.innerText);
          throw new Error(`Error detected on page: ${pageText.substring(0, 200)}...`);
        }
      } else if (result === 'unknown') {
        fixture.debugLog('Page loaded but content state is unknown');
      }
      
      // Verify page title if we got this far
      const pageTitle = await page.title();
      expect(pageTitle).toContain('NDSP Navigator');
      
      fixture.debugLog('Page loaded successfully');
      
    } catch (error) {
      // Take a screenshot to help with debugging
      await page.screenshot({ path: 'test-results/user-management-load-error.png', fullPage: true });
      throw error;
    }
    
    fixture.logSuccess();
  } catch (error) {
    // Capture screenshot on failure
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `test-results/user-management-error-${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    fixture.debugLog(`Test failed: ${errorMessage}`);
    fixture.debugLog(`Screenshot saved to: ${screenshotPath}`);
    
    // Log page content for debugging
    try {
      const pageContent = await page.content();
      fixture.debugLog('Page content: ' + pageContent.substring(0, 1000) + '...');
    } catch (e) {
      fixture.debugLog('Could not get page content: ' + (e as Error).message);
    }
    
    throw error;
  }
});
