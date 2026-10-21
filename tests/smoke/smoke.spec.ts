import { test, expect } from '../../fixtures';
import { expectCartCount } from '../../utils/assertions';
import { env } from '../../utils/env';
import { reachOverview } from '../../utils/flows';
import { PRODUCTS } from '../../utils/testData';

/*
 * Tagged @smoke: playwright.config.ts runs ONLY these tests on the firefox and webkit projects,
 * while the chromium project runs the whole suite.
 *   npm run test:smoke          -> smoke tests on all three browsers
 *   npx playwright test --project=webkit --grep @smoke
 */
test.describe('Smoke suite passes on Chromium, Firefox and WebKit', { tag: '@smoke' }, () => {
  test('Smoke: runs in a supported browser', async ({ browserName }) => {
    expect(['chromium', 'firefox', 'webkit']).toContain(browserName);
  });

  test('Smoke: standard user can log in', async ({ loginAs, inventoryPage, page }) => {
    await loginAs(env.users.standard);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('Smoke: product can be added to and removed from the cart', async ({ loggedInInventoryPage }) => {
    await loggedInInventoryPage.addToCart(PRODUCTS.backpack.name);
    await expectCartCount(loggedInInventoryPage, 1);

    await loggedInInventoryPage.removeFromCart(PRODUCTS.backpack.name);
    await expectCartCount(loggedInInventoryPage, 0);
  });

  test('Smoke: user can complete a purchase', async ({
    loggedInInventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    await reachOverview({ inventoryPage: loggedInInventoryPage, cartPage, checkoutInfoPage }, [PRODUCTS.backpack]);
    await checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
  });
});
