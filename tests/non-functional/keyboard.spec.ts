import { test, expect } from '../../fixtures';
import { env } from '../../utils/env';

test.describe('Keyboard accessibility', () => {
  test('Keyboard-only navigation through login form', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.open();

    await page.keyboard.press('Tab');
    await expect(loginPage.usernameInput).toBeFocused();
    await page.keyboard.type(env.users.standard);

    await page.keyboard.press('Tab');
    await expect(loginPage.passwordInput).toBeFocused();
    await page.keyboard.type(env.password);

    await page.keyboard.press('Tab');
    await expect(loginPage.loginButton).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });
});
