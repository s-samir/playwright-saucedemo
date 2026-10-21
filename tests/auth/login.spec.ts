import { test, expect } from '../../fixtures';
import { env } from '../../utils/env';
import { ERRORS } from '../../utils/testData';

test.describe('Authentication', () => {
  test.describe('login form', () => {
    test.beforeEach(async ({ loginPage }) => {
      await loginPage.open();
    });

    test('Login with valid standard user', async ({ loginPage, inventoryPage, page }) => {
      await loginPage.login(env.users.standard, env.password);

      await expect(page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.pageTitle).toHaveText('Products');
    });

    test('Login with locked_out_user shows locked-out error', async ({ loginPage, page }) => {
      await loginPage.login(env.users.locked, env.password);

      await expect(loginPage.errorMessage).toHaveText(ERRORS.lockedOut);
      await expect(page).not.toHaveURL(/inventory/);
    });

    test('Login with invalid username shows error', async ({ loginPage, page }) => {
      await loginPage.login('invalid_user', env.password);

      await expect(loginPage.errorMessage).toHaveText(ERRORS.invalidCredentials);
      await expect(page).not.toHaveURL(/inventory/);
    });

    test('Login with invalid password shows error', async ({ loginPage, page }) => {
      await loginPage.login(env.users.standard, 'wrong_password');

      await expect(loginPage.errorMessage).toHaveText(ERRORS.invalidCredentials);
      await expect(page).not.toHaveURL(/inventory/);
    });

    test('Login with empty username shows required error', async ({ loginPage }) => {
      await loginPage.login('', env.password);

      await expect(loginPage.errorMessage).toHaveText(ERRORS.usernameRequired);
    });

    test('Login with empty password shows required error', async ({ loginPage }) => {
      await loginPage.login(env.users.standard, '');

      await expect(loginPage.errorMessage).toHaveText(ERRORS.passwordRequired);
    });

    test('Login with both fields empty shows username required error', async ({ loginPage }) => {
      await loginPage.login('', '');

      await expect(loginPage.errorMessage).toHaveText(ERRORS.usernameRequired);
    });

    test('Error message can be dismissed with the X button', async ({ loginPage }) => {
      await loginPage.login('', '');
      await expect(loginPage.errorMessage).toBeVisible();

      await loginPage.errorCloseButton.click();

      await expect(loginPage.errorMessage).toBeHidden();
    });

    test('Credentials are case-sensitive', async ({ loginPage, page }) => {
      await loginPage.login(env.users.standard.toUpperCase(), env.password);
      await expect(loginPage.errorMessage).toHaveText(ERRORS.invalidCredentials);

      // Dismiss the first error so the second assertion cannot pass on a stale message.
      await loginPage.errorCloseButton.click();
      await expect(loginPage.errorMessage).toBeHidden();

      await loginPage.login(env.users.standard, env.password.toUpperCase());
      await expect(loginPage.errorMessage).toHaveText(ERRORS.invalidCredentials);
      await expect(page).not.toHaveURL(/inventory/);
    });

    test('Pressing Enter submits the login form', async ({ loginPage, inventoryPage, page }) => {
      await loginPage.loginWithEnter(env.users.standard, env.password);

      await expect(page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.pageTitle).toHaveText('Products');
    });
  });

  test.describe('session', () => {
    test('Direct access to /inventory.html without login redirects with error', async ({ loginPage, page }) => {
      await page.goto('/inventory.html');

      await expect(page).not.toHaveURL(/inventory/);
      await expect(loginPage.errorMessage).toHaveText(ERRORS.accessDenied('/inventory.html'));
    });

    test('Logout returns to login page', async ({ loggedInInventoryPage, loginPage, page }) => {
      await loggedInInventoryPage.logout();

      await expect(loginPage.loginButton).toBeVisible();
      await expect(page).not.toHaveURL(/inventory/);
    });

    test('Browser back after logout does not expose inventory', async ({
      loggedInInventoryPage,
      loginPage,
      page,
    }) => {
      await loggedInInventoryPage.logout();
      await expect(loginPage.loginButton).toBeVisible();

      await page.goBack();

      await expect(loggedInInventoryPage.inventoryList).toBeHidden();
      await expect(loginPage.loginButton).toBeVisible();
    });
  });
});
