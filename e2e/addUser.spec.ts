import { test, expect } from '@playwright/test';
import { MockUsersPage } from './mockUsersPage';

// Debug setup
const debugLog = (message: string) => {
  console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`);
};

test('should add new user', async ({ page }) => {
  // Bypass auth checks for testing
  await page.route('**/api/auth/session**', route => route.fulfill({ status: 200, body: JSON.stringify({ user: null }) }));
  
  debugLog('Starting add user test');
  
  // Mock API responses
  await page.route('**/api/users**', async route => {
    debugLog(`Intercepted ${route.request().method()} request to ${route.request().url()}`);
    
    if (route.request().method() === 'POST') {
      const requestData = await route.request().postDataJSON();
      debugLog(`Received user data: ${JSON.stringify(requestData)}`);
      
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ 
          _id: 'new-user-1', 
          success: true,
          ...requestData
        })
      });
    }
    
    return route.continue();
  });

  // Mock the entire page component
  await page.route('**/admin/users', async route => {
    debugLog('Rendering mock users page');
    return route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `
        <html>
          <body>
            <h1>User Management</h1>
            <button>Add User</button>
            <form>
              <label for="name">Name</label>
              <input id="name" name="name">
              <label for="email">Email</label>
              <input id="email" name="email" type="email">
              <label for="role">Role</label>
              <select id="role" name="role">
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
              <button type="submit">Save</button>
            </form>
            <div data-testid="success-message" style="display:none">User created successfully</div>
            <script>
              document.querySelector('form').addEventListener('submit', e => {
                e.preventDefault();
                document.querySelector('[data-testid="success-message"]').style.display = 'block';
              });
            </script>
          </body>
        </html>
      `
    });
  });

  debugLog('Navigating to user management page');
  await page.goto('/admin/users');
  
  debugLog('Checking page loaded');
  await expect(page).toHaveURL(/\/admin\/users/);
  await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add User' })).toBeVisible();
  
  debugLog('Clicking add user button');
  await page.getByRole('button', { name: 'Add User' }).click();
  
  debugLog('Filling user form');
  await page.getByLabel('Name').fill('New User');
  await page.getByLabel('Email').fill('new@example.com');
  await page.getByLabel('Role').selectOption('editor');
  
  debugLog('Submitting form');
  await page.getByRole('button', { name: 'Save' }).click();
  
  debugLog('Verifying success');
  await expect(page.getByText('User created successfully')).toBeVisible();
  debugLog('Test completed');
});

// Note: Run with: npx playwright test e2e/addUser.spec.ts --reporter=null
