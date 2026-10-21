import { test, expect } from '../../fixtures';
import { expectCartCount } from '../../utils/assertions';
import { ALL_PRODUCTS, PRODUCTS } from '../../utils/testData';

const catalogNames = ALL_PRODUCTS.map((product) => product.name);
const catalogPrices = ALL_PRODUCTS.map((product) => product.price);

test.describe('Inventory', () => {
  // Logs in as standard_user through the fixture and lands on the inventory page.
  test.beforeEach(async ({ loggedInInventoryPage: _ }) => {});

  test('Inventory shows 6 products, each with image, name, description, price and button', async ({
    inventoryPage,
  }) => {
    await expect(inventoryPage.items).toHaveCount(6);
    expect((await inventoryPage.getProductNames()).sort()).toEqual([...catalogNames].sort());

    for (const card of await inventoryPage.items.all()) {
      await expect(card.getByRole('img')).toBeVisible();
      await expect(card.getByTestId('inventory-item-name')).not.toBeEmpty();
      await expect(card.getByTestId('inventory-item-desc')).not.toBeEmpty();
      await expect(card.getByTestId('inventory-item-price')).toHaveText(/^\$\d+\.\d{2}$/);
      await expect(card.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    }
  });

  test('Sort by Name (A to Z)', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');

    await expect.poll(() => inventoryPage.getProductNames()).toEqual([...catalogNames].sort());
  });

  test('Sort by Name (Z to A)', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');

    await expect.poll(() => inventoryPage.getProductNames()).toEqual([...catalogNames].sort().reverse());
  });

  test('Sort by Price (low to high)', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    await expect
      .poll(() => inventoryPage.getProductPrices())
      .toEqual([...catalogPrices].sort((a, b) => a - b));
  });

  test('Sort by Price (high to low)', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');

    await expect
      .poll(() => inventoryPage.getProductPrices())
      .toEqual([...catalogPrices].sort((a, b) => b - a));
  });

  test('Add single product updates button to Remove and cart badge to 1', async ({ inventoryPage }) => {
    const { name } = PRODUCTS.backpack;

    await inventoryPage.addToCart(name);

    await expect(inventoryPage.removeButton(name)).toHaveText('Remove');
    await expect(inventoryPage.addButton(name)).toBeHidden();
    await expectCartCount(inventoryPage, 1);
  });

  test('Add multiple products updates cart badge count', async ({ inventoryPage }) => {
    await inventoryPage.addProducts([PRODUCTS.backpack, PRODUCTS.bikeLight, PRODUCTS.onesie]);

    await expectCartCount(inventoryPage, 3);
  });

  test('Remove product from inventory page decrements badge', async ({ inventoryPage }) => {
    await inventoryPage.addProducts([PRODUCTS.backpack, PRODUCTS.bikeLight]);
    await expectCartCount(inventoryPage, 2);

    await inventoryPage.removeFromCart(PRODUCTS.backpack.name);

    await expectCartCount(inventoryPage, 1);
    await expect(inventoryPage.addButton(PRODUCTS.backpack.name)).toBeVisible();
    await expect(inventoryPage.removeButton(PRODUCTS.bikeLight.name)).toBeVisible();
  });

  test('Add all six products shows badge 6', async ({ inventoryPage }) => {
    await inventoryPage.addProducts(ALL_PRODUCTS);

    await expectCartCount(inventoryPage, 6);
  });

  test('Reset App State clears cart and restores buttons', async ({ inventoryPage }) => {
    // Expected behavior: the badge is cleared AND every button goes back to "Add to cart".
    // SauceDemo clears the cart but leaves the buttons on "Remove" until the page is reloaded.
    test.fail(true, 'Known issue: Reset App State does not restore the Add to cart buttons');

    await inventoryPage.addProducts([PRODUCTS.backpack, PRODUCTS.bikeLight, PRODUCTS.onesie]);
    await expectCartCount(inventoryPage, 3);

    await inventoryPage.resetAppState();

    await expectCartCount(inventoryPage, 0);
    for (const product of ALL_PRODUCTS) {
      await expect(inventoryPage.addButton(product.name)).toBeVisible();
      await expect(inventoryPage.removeButton(product.name)).toBeHidden();
    }
  });

  test('Clicking product name opens product details', async ({ inventoryPage, productDetailsPage, page }) => {
    await inventoryPage.openProduct(PRODUCTS.backpack.name);
    await productDetailsPage.waitUntilLoaded();

    await expect(page).toHaveURL(/inventory-item\.html\?id=\d+/);
    await expect(productDetailsPage.name).toHaveText(PRODUCTS.backpack.name);
  });
});
