import { test, expect } from '../../fixtures';
import { expectCartCount } from '../../utils/assertions';
import { PRODUCTS } from '../../utils/testData';

test.describe('Product details', () => {
  // Logs in as standard_user through the fixture and lands on the inventory page.
  test.beforeEach(async ({ loggedInInventoryPage: _ }) => {});

  test('Details page shows correct name, description, price and image', async ({
    inventoryPage,
    productDetailsPage,
  }) => {
    const { name, price } = PRODUCTS.backpack;
    const expected = await inventoryPage.getItemDetails(name);

    await inventoryPage.openProduct(name);
    await productDetailsPage.waitUntilLoaded();

    await expect(productDetailsPage.name).toHaveText(expected.name);
    await expect(productDetailsPage.description).toHaveText(expected.description);
    await expect(productDetailsPage.price).toHaveText(`$${price.toFixed(2)}`);
    await expect(productDetailsPage.image).toBeVisible();
    await expect(productDetailsPage.image).toHaveAttribute('src', expected.imageSrc);
    expect(expected.price).toBe(price);
  });

  test('Add to cart from details page', async ({ inventoryPage, productDetailsPage }) => {
    await inventoryPage.openProduct(PRODUCTS.backpack.name);

    await productDetailsPage.addToCart();

    await expect(productDetailsPage.removeButton).toBeVisible();
    await expect(productDetailsPage.addToCartButton).toBeHidden();
    await expectCartCount(productDetailsPage, 1);
  });

  test('Remove from details page', async ({ inventoryPage, productDetailsPage }) => {
    await inventoryPage.openProduct(PRODUCTS.backpack.name);
    await productDetailsPage.addToCart();
    await expectCartCount(productDetailsPage, 1);

    await productDetailsPage.removeFromCart();

    await expect(productDetailsPage.addToCartButton).toBeVisible();
    await expectCartCount(productDetailsPage, 0);
  });

  test('Back to products returns to inventory', async ({ inventoryPage, productDetailsPage, page }) => {
    await inventoryPage.openProduct(PRODUCTS.backpack.name);

    await productDetailsPage.backToProducts();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('Invalid product id shows “item not found” state', async ({ productDetailsPage }) => {
    await productDetailsPage.open(99999);

    await expect(productDetailsPage.notFoundMessage).toBeVisible();
  //await expect(productDetailsPage.addToCartButton).toBeHidden();  
  // Note: SauceDemo still renders an "Add to cart" button on this screen which is a bug, so it is not asserted as hidden.
  //       The test above checks that the "Add to cart" button is not visible, which is the expected behavior, 
  //       so the defect is logged as a known issue in the tests/special-users/special-users.spec.ts instead of 
  //       going along with the test until SauceDemo fixes this issue in the future. When that happens, the test 
  //       can be uncommented and the known issue removed from 'special-users.spec.ts'.
  });
});
