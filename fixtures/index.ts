import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { env } from '../utils/env';

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;

  /** Opens the login page and submits credentials (password defaults to the shared one in .env). No assertions. */
  loginAs: (username: string, password?: string) => Promise<void>;

  /** standard_user already logged in and sitting on the inventory page. */
  loggedInInventoryPage: InventoryPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  loginAs: async ({ loginPage }, use) => {
    await use(async (username: string, password: string = env.password) => {
      await loginPage.open();
      await loginPage.login(username, password);
    });
  },

  loggedInInventoryPage: async ({ loginAs, inventoryPage }, use) => {
    await loginAs(env.users.standard);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    await use(inventoryPage);
  },
});

export { expect };
