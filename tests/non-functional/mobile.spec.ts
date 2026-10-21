import { test, expect } from '../../fixtures';
import { expectCartCount } from '../../utils/assertions';
import { ALL_PRODUCTS, PRODUCTS } from '../../utils/testData';

// iPhone-sized viewport for every test in this file.
test.use({ viewport: { width: 375, height: 667 } });

test.describe('Mobile', () => {
  test('Mobile viewport: menu and inventory remain usable', async ({ loggedInInventoryPage, cartPage, page }) => {
    // Inventory renders and a product can be added.
    await expect(loggedInInventoryPage.items).toHaveCount(ALL_PRODUCTS.length);
    await loggedInInventoryPage.addToCart(PRODUCTS.backpack.name);
    await expectCartCount(loggedInInventoryPage, 1);

    // Burger menu opens, closes, and its links work.
    await loggedInInventoryPage.openMenu();
    await expect(loggedInInventoryPage.logoutLink).toBeVisible();
    await loggedInInventoryPage.closeMenu();
    await expect(loggedInInventoryPage.logoutLink).toBeHidden();

    // Cart is reachable and shows the added product.
    await loggedInInventoryPage.openCart();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.checkoutButton).toBeVisible();

    // Navigation through the menu still works.
    await cartPage.goToAllItems();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
