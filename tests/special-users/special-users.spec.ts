import { test, expect } from '../../fixtures';
import { InventoryPage } from '../../pages/InventoryPage';
import { LoginPage } from '../../pages/LoginPage';
import { expectCartCount } from '../../utils/assertions';
import { env } from '../../utils/env';
import { startCheckout } from '../../utils/flows';
import { ALL_PRODUCTS, CHECKOUT_INFO, LOGIN_TIME_BUDGET_MS, PRODUCTS } from '../../utils/testData';

/*
 * SauceDemo's special users have deliberate defects. Each test below asserts the CORRECT behavior and,
 * where the defect is documented, is marked with test.fail(): the suite stays green while the defect
 * exists, and a test that starts passing ("unexpected pass") tells you the app was fixed and the
 * annotation can be removed.
 */
test.describe('Special users (known-defect hunting)', () => {
  test('problem_user: product images match products', async ({ loginAs, inventoryPage }) => {
    test.fail(true, 'Known issue: problem_user sees the same placeholder image for every product');

    await loginAs(env.users.problem);
    await expect(inventoryPage.items).toHaveCount(ALL_PRODUCTS.length);

    const sources = await inventoryPage.getImageSources();
    expect(new Set(sources).size).toBe(ALL_PRODUCTS.length);
    for (const source of sources) {
      expect(source).not.toContain('sl-404');
    }
  });

  test('problem_user: sorting works', async ({ loginAs, inventoryPage }) => {
    test.fail(true, 'Known issue: sorting does nothing for problem_user');

    await loginAs(env.users.problem);
    await expect(inventoryPage.items).toHaveCount(ALL_PRODUCTS.length);

    await inventoryPage.sortBy('za');

    const expected = ALL_PRODUCTS.map((product) => product.name).sort().reverse();
    await expect.poll(() => inventoryPage.getProductNames()).toEqual(expected);
  });

  test('problem_user: can add and remove all products', async ({ loginAs, inventoryPage }) => {
    test.fail(true, 'Known issue: several add/remove buttons do not work for problem_user');

    await loginAs(env.users.problem);
    await expect(inventoryPage.items).toHaveCount(ALL_PRODUCTS.length);

    await inventoryPage.addProducts(ALL_PRODUCTS);
    await expectCartCount(inventoryPage, ALL_PRODUCTS.length);

    await inventoryPage.removeProducts(ALL_PRODUCTS);
    await expectCartCount(inventoryPage, 0);
  });

  test('problem_user: checkout accepts last name', async ({
    loginAs,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    page,
  }) => {
    test.fail(true, 'Known issue: the last name field does not keep its value for problem_user');

    await loginAs(env.users.problem);
    await startCheckout({ inventoryPage, cartPage });

    await checkoutInfoPage.fillInfo(CHECKOUT_INFO);
    await expect(checkoutInfoPage.lastNameInput).toHaveValue(CHECKOUT_INFO.lastName);

    await checkoutInfoPage.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  test('performance_glitch_user: login completes within acceptable time', async ({ loginAs, inventoryPage }) => {
    test.fail(true, `Known issue: performance_glitch_user logins take several seconds (budget ${LOGIN_TIME_BUDGET_MS} ms)`);

    const startedAt = Date.now();
    await loginAs(env.users.performance);
    await expect(inventoryPage.pageTitle).toBeVisible({ timeout: 20_000 });
    const elapsedMs = Date.now() - startedAt;

    test.info().annotations.push({ type: 'login-duration-ms', description: String(elapsedMs) });
    expect(elapsedMs).toBeLessThan(LOGIN_TIME_BUDGET_MS);
  });

  test('error_user: add/remove and checkout finish behave correctly', async ({
    loginAs,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    test.fail(true, 'Known issue: error_user hits errors on remove buttons and when finishing checkout');

    await loginAs(env.users.error);
    await expect(inventoryPage.items).toHaveCount(ALL_PRODUCTS.length);

    const order = [PRODUCTS.backpack, PRODUCTS.bikeLight, PRODUCTS.onesie];
    await inventoryPage.addProducts(order);
    await expectCartCount(inventoryPage, order.length);

    await inventoryPage.removeProducts(order);
    await expectCartCount(inventoryPage, 0);

    await startCheckout({ inventoryPage, cartPage });
    await checkoutInfoPage.submit(CHECKOUT_INFO);
    await checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('visual_user: inventory layout matches visual baseline', async ({ browser, baseURL }) => {
    test.fail(true, 'Known issue: visual_user sees a deliberately broken inventory layout');

    // Baseline = the same page rendered for standard_user (the correct layout) in a separate session.
    const captureLayout = async (username: string): Promise<string[]> => {
      const context = await browser.newContext({ baseURL });
      try {
        const page = await context.newPage();
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        await loginPage.open();
        await loginPage.login(username, env.password);
        await expect(inventoryPage.items).toHaveCount(ALL_PRODUCTS.length);
        return await inventoryPage.getLayoutBoxes();
      } finally {
        await context.close();
      }
    };

    const baseline = await captureLayout(env.users.standard);
    const visualUserLayout = await captureLayout(env.users.visual);

    expect(visualUserLayout).toEqual(baseline);
  });

    test('Invalid product id shows “item not found” state', async ({ productDetailsPage }) => {
    test.fail(true, 'Known issue: the "Add to cart" button is still visible on the "item not found" screen');

    await productDetailsPage.open(99999);

    await expect(productDetailsPage.notFoundMessage).toBeVisible();
    await expect(productDetailsPage.addToCartButton).toBeHidden();
  });
});
