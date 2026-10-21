import { test, expect } from '../../fixtures';
import { expectCartCount } from '../../utils/assertions';
import { sortByName } from '../../utils/helpers';
import { PRODUCTS } from '../../utils/testData';
import { toLineItems } from '../../utils/flows';

test.describe('Cart', () => {
  // Logs in as standard_user through the fixture and lands on the inventory page.
  test.beforeEach(async ({ loggedInInventoryPage: _ }) => {});

  test('Cart is empty for a fresh session', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.openCart();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    await expect(cartPage.items).toHaveCount(0);
    await expectCartCount(cartPage, 0);
  });

  test('Cart lists added items with correct name, quantity and price', async ({ inventoryPage, cartPage }) => {
    const order = [PRODUCTS.backpack, PRODUCTS.bikeLight];
    await inventoryPage.addProducts(order);

    await inventoryPage.openCart();

    await expect(cartPage.items).toHaveCount(order.length);
    expect(sortByName(await cartPage.getItems())).toEqual(sortByName(toLineItems(order)));
  });

  test('Remove item from cart updates list and badge', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProducts([PRODUCTS.backpack, PRODUCTS.bikeLight]);
    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(2);

    await cartPage.removeItem(PRODUCTS.backpack.name);

    await expect(cartPage.items).toHaveCount(1);
    expect(await cartPage.getItems()).toEqual(toLineItems([PRODUCTS.bikeLight]));
    await expectCartCount(cartPage, 1);
  });

  test('Continue Shopping returns to inventory', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.openCart();

    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('Cart contents persist after page reload', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.addProducts([PRODUCTS.backpack, PRODUCTS.onesie]);
    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(2);

    await page.reload();

    await expect(cartPage.items).toHaveCount(2);
    expect(sortByName(await cartPage.getItems())).toEqual(
      sortByName(toLineItems([PRODUCTS.backpack, PRODUCTS.onesie])),
    );
    await expectCartCount(cartPage, 2);
  });

  test('Checkout is blocked or flagged when cart is empty (document current behavior)', async ({
    inventoryPage,
    cartPage,
    page,
  }) => {
    // Expected business behavior: an empty cart cannot be checked out.
    // SauceDemo currently lets the user continue to "Checkout: Your Information", so this test is
    // marked as an expected failure. When the app is fixed it will start "unexpectedly passing" and
    // flag that this annotation should be removed.
    test.fail(true, 'Known issue: SauceDemo allows checkout with an empty cart');

    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(0);

    await cartPage.checkout();

    await expect(page).toHaveURL(/cart\.html/);
  });
});
