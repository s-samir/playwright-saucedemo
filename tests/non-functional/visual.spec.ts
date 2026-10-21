import { test, expect } from '../../fixtures';
import { PRODUCTS } from '../../utils/testData';

/*
 * Baselines do not exist until you create them. First run (or after an intentional UI change):
 *   npm run snapshots:update
 * Screenshots are platform-specific, so generate and commit baselines on the OS/CI image that runs the suite.
 */
test.describe('Visual snapshots of key pages', () => {
  test('login page matches snapshot', async ({ loginPage, page }) => {
    await loginPage.open();
    await expect(loginPage.loginButton).toBeVisible();

    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('inventory page matches snapshot', async ({ loggedInInventoryPage, page }) => {
    await expect(loggedInInventoryPage.items).toHaveCount(6);

    await expect(page).toHaveScreenshot('inventory-page.png');
  });

  test('cart page matches snapshot', async ({ loggedInInventoryPage, cartPage, page }) => {
    await loggedInInventoryPage.addProducts([PRODUCTS.backpack, PRODUCTS.bikeLight]);
    await loggedInInventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(2);

    await expect(page).toHaveScreenshot('cart-page.png');
  });
});
