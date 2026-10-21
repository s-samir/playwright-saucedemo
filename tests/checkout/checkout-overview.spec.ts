import { test, expect } from '../../fixtures';
import { DEFAULT_ORDER, reachOverview, toLineItems } from '../../utils/flows';
import { roundMoney, sortByName, sum } from '../../utils/helpers';
import { TAX_RATE } from '../../utils/testData';

const orderTotal = sum(DEFAULT_ORDER.map((product) => product.price));

test.describe('Checkout: overview', () => {
  // Logs in as standard_user, adds the default order (backpack + bike light) and reaches the overview.
  test.beforeEach(async ({ loggedInInventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage, page }) => {
    await reachOverview({ inventoryPage: loggedInInventoryPage, cartPage, checkoutInfoPage });
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutOverviewPage.pageTitle).toHaveText('Checkout: Overview');
  });

  test('Overview lists the same items, quantities and prices as the cart', async ({ checkoutOverviewPage }) => {
    await expect(checkoutOverviewPage.items).toHaveCount(DEFAULT_ORDER.length);

    expect(sortByName(await checkoutOverviewPage.getItems())).toEqual(sortByName(toLineItems(DEFAULT_ORDER)));
  });

  test('Payment and shipping information are displayed', async ({ checkoutOverviewPage }) => {
    await expect(checkoutOverviewPage.paymentInfoLabel).toHaveText('Payment Information:');
    await expect(checkoutOverviewPage.paymentInfoValue).toHaveText(/^SauceCard #\d+$/);
    await expect(checkoutOverviewPage.shippingInfoLabel).toHaveText('Shipping Information:');
    await expect(checkoutOverviewPage.shippingInfoValue).toHaveText('Free Pony Express Delivery!');
  });

  test('Item total equals sum of item prices', async ({ checkoutOverviewPage }) => {
    const displayedPrices = (await checkoutOverviewPage.getItems()).map((item) => item.price);

    expect(await checkoutOverviewPage.getSubtotal()).toBeCloseTo(sum(displayedPrices), 2);
    expect(await checkoutOverviewPage.getSubtotal()).toBeCloseTo(orderTotal, 2);
  });

  test('Tax is calculated correctly', async ({ checkoutOverviewPage }) => {
    const subtotal = await checkoutOverviewPage.getSubtotal();

    expect(await checkoutOverviewPage.getTax()).toBeCloseTo(roundMoney(subtotal * TAX_RATE), 2);
  });

  test('Total equals item total plus tax', async ({ checkoutOverviewPage }) => {
    const subtotal = await checkoutOverviewPage.getSubtotal();
    const tax = await checkoutOverviewPage.getTax();

    expect(await checkoutOverviewPage.getTotal()).toBeCloseTo(roundMoney(subtotal + tax), 2);
  });

  test('Cancel returns to inventory', async ({ checkoutOverviewPage, inventoryPage, page }) => {
    await checkoutOverviewPage.cancel();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('Finish completes the order', async ({ checkoutOverviewPage, checkoutCompletePage, page }) => {
    await checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutCompletePage.pageTitle).toHaveText('Checkout: Complete!');
  });
});
