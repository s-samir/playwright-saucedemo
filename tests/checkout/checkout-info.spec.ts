import { test, expect } from '../../fixtures';
import { startCheckout } from '../../utils/flows';
import { CHECKOUT_INFO, ERRORS } from '../../utils/testData';

test.describe('Checkout: your information', () => {
  // Logs in as standard_user, adds one product and opens "Checkout: Your Information".
  test.beforeEach(async ({ loggedInInventoryPage, cartPage, checkoutInfoPage, page }) => {
    await startCheckout({ inventoryPage: loggedInInventoryPage, cartPage });
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(checkoutInfoPage.pageTitle).toHaveText('Checkout: Your Information');
  });

  test('First name required validation', async ({ checkoutInfoPage, page }) => {
    await checkoutInfoPage.submit({ lastName: CHECKOUT_INFO.lastName, postalCode: CHECKOUT_INFO.postalCode });

    await expect(checkoutInfoPage.errorMessage).toHaveText(ERRORS.firstNameRequired);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('Last name required validation', async ({ checkoutInfoPage, page }) => {
    await checkoutInfoPage.submit({ firstName: CHECKOUT_INFO.firstName, postalCode: CHECKOUT_INFO.postalCode });

    await expect(checkoutInfoPage.errorMessage).toHaveText(ERRORS.lastNameRequired);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('Postal code required validation', async ({ checkoutInfoPage, page }) => {
    await checkoutInfoPage.submit({ firstName: CHECKOUT_INFO.firstName, lastName: CHECKOUT_INFO.lastName });

    await expect(checkoutInfoPage.errorMessage).toHaveText(ERRORS.postalCodeRequired);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('Whitespace-only values handling', async ({ checkoutInfoPage, page }) => {
    // Expected business behavior: whitespace-only values are rejected like empty ones.
    // SauceDemo currently accepts them, so this is an expected failure. Remove the annotation
    // once the app trims and validates its input.
    test.fail(true, 'Known issue: SauceDemo accepts whitespace-only checkout fields');

    await checkoutInfoPage.submit({ firstName: '   ', lastName: '   ', postalCode: '   ' });

    await expect(checkoutInfoPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('Special characters and long values accepted', async ({ checkoutInfoPage, checkoutOverviewPage, page }) => {
    await checkoutInfoPage.submit({
      firstName: `Zoë-Ann O'Brien <b>&</b>`,
      lastName: 'Š'.repeat(255),
      postalCode: '71 000-#1/A',
    });

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutOverviewPage.pageTitle).toHaveText('Checkout: Overview');
  });

  test('Cancel returns to cart', async ({ checkoutInfoPage, cartPage, page }) => {
    await checkoutInfoPage.cancel();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
  });

  test('Valid information proceeds to overview', async ({ checkoutInfoPage, checkoutOverviewPage, page }) => {
    await checkoutInfoPage.submit(CHECKOUT_INFO);

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutOverviewPage.pageTitle).toHaveText('Checkout: Overview');
  });
});
