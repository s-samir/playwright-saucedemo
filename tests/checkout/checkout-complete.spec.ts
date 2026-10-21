import { test, expect } from '../../fixtures';
import { expectCartCount } from '../../utils/assertions';
import { reachOverview } from '../../utils/flows';
import { PRODUCTS } from '../../utils/testData';

test.describe('Checkout: complete', () => {
  // Logs in as standard_user, places an order for one product and lands on the confirmation page.
  test.beforeEach(async ({ loggedInInventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage, page }) => {
    await reachOverview({ inventoryPage: loggedInInventoryPage, cartPage, checkoutInfoPage }, [PRODUCTS.backpack]);
    await checkoutOverviewPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
  });

  test('Confirmation message is displayed', async ({ checkoutCompletePage }) => {
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutCompletePage.completeText).toContainText('Your order has been dispatched');
  });

  test('Cart badge is cleared after order', async ({ checkoutCompletePage }) => {
    await expectCartCount(checkoutCompletePage, 0);
  });

  test('Back Home returns to inventory', async ({ checkoutCompletePage, inventoryPage, page }) => {
    await checkoutCompletePage.backHome();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('A second purchase can be completed after the first', async ({
    checkoutCompletePage,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    page,
  }) => {
    await checkoutCompletePage.backHome();
    await expect(inventoryPage.pageTitle).toHaveText('Products');

    await reachOverview({ inventoryPage, cartPage, checkoutInfoPage }, [PRODUCTS.onesie]);
    await expect(checkoutOverviewPage.items).toHaveCount(1);
    await checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
  });
});
