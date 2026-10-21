import { test, expect } from '../../fixtures';
import { expectCartCount } from '../../utils/assertions';
import { reachOverview, toLineItems } from '../../utils/flows';
import { roundMoney, sortByName, sum } from '../../utils/helpers';
import { ALL_PRODUCTS, CHECKOUT_INFO, PRODUCTS, TAX_RATE } from '../../utils/testData';
import { env } from '../../utils/env';

test.describe('End-to-end', () => {
  test('Complete purchase of one product', async ({
    loggedInInventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    const order = [PRODUCTS.backpack];

    await reachOverview({ inventoryPage: loggedInInventoryPage, cartPage, checkoutInfoPage }, order);
    await expect(checkoutOverviewPage.items).toHaveCount(order.length);

    expect(await checkoutOverviewPage.getItems()).toEqual(toLineItems(order));
    expect(await checkoutOverviewPage.getSubtotal()).toBeCloseTo(PRODUCTS.backpack.price, 2);

    await checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    await expectCartCount(checkoutCompletePage, 0);
  });

  test('Complete purchase of multiple products', async ({
    loggedInInventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    const order = [PRODUCTS.backpack, PRODUCTS.boltTShirt, PRODUCTS.onesie, PRODUCTS.fleeceJacket];
    const expectedSubtotal = sum(order.map((product) => product.price));

    await reachOverview({ inventoryPage: loggedInInventoryPage, cartPage, checkoutInfoPage }, order);
    await expect(checkoutOverviewPage.items).toHaveCount(order.length);

    expect(sortByName(await checkoutOverviewPage.getItems())).toEqual(sortByName(toLineItems(order)));
    expect(await checkoutOverviewPage.getSubtotal()).toBeCloseTo(expectedSubtotal, 2);
    expect(await checkoutOverviewPage.getTotal()).toBeCloseTo(
      roundMoney(expectedSubtotal + roundMoney(expectedSubtotal * TAX_RATE)),
      2,
    );

    await checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('Complete purchase after sorting and selecting by price', async ({
    loggedInInventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    const cheapestTwo = [...ALL_PRODUCTS].sort((a, b) => a.price - b.price).slice(0, 2);
    const sortedPrices = ALL_PRODUCTS.map((product) => product.price).sort((a, b) => a - b);

    await loggedInInventoryPage.sortBy('lohi');
    await expect.poll(() => loggedInInventoryPage.getProductPrices()).toEqual(sortedPrices);

    // Select the first two products of the price-sorted list.
    const firstTwoOnPage = (await loggedInInventoryPage.getProductNames()).slice(0, 2);
    expect(firstTwoOnPage).toEqual(cheapestTwo.map((product) => product.name));
    for (const name of firstTwoOnPage) {
      await loggedInInventoryPage.addToCart(name);
    }
    await expectCartCount(loggedInInventoryPage, 2);

    await loggedInInventoryPage.openCart();
    await cartPage.checkout();
    await checkoutInfoPage.submit(CHECKOUT_INFO);

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    expect(await checkoutOverviewPage.getSubtotal()).toBeCloseTo(sum(cheapestTwo.map((p) => p.price)), 2);

    await checkoutOverviewPage.finish();

    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('Login, add, remove, re-add, checkout flow', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    await loginPage.open();
    await loginPage.login(env.users.standard, env.password);
    await expect(inventoryPage.pageTitle).toHaveText('Products');

    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.addToCart(PRODUCTS.bikeLight.name);
    await expectCartCount(inventoryPage, 2);

    await inventoryPage.removeFromCart(PRODUCTS.backpack.name);
    await expectCartCount(inventoryPage, 1);

    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await expectCartCount(inventoryPage, 2);

    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(2);
    expect(sortByName(await cartPage.getItems())).toEqual(
      sortByName(toLineItems([PRODUCTS.backpack, PRODUCTS.bikeLight])),
    );

    await cartPage.checkout();
    await checkoutInfoPage.submit(CHECKOUT_INFO);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    await expectCartCount(checkoutCompletePage, 0);
  });
});
