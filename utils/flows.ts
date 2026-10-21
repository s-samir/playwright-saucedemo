import type { CartPage } from '../pages/CartPage';
import type { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import type { InventoryPage } from '../pages/InventoryPage';
import { CHECKOUT_INFO, PRODUCTS } from './testData';
import type { CheckoutInfo, LineItem, Product } from './types';

interface StartPages {
  inventoryPage: InventoryPage;
  cartPage: CartPage;
}

interface OverviewPages extends StartPages {
  checkoutInfoPage: CheckoutInfoPage;
}

export const DEFAULT_ORDER: readonly Product[] = [PRODUCTS.backpack, PRODUCTS.bikeLight];

/** Adds products, opens the cart and clicks Checkout. Ends on "Checkout: Your Information". */
export async function startCheckout(
  { inventoryPage, cartPage }: StartPages,
  products: readonly Product[] = [PRODUCTS.backpack],
): Promise<void> {
  await inventoryPage.addProducts(products);
  await inventoryPage.openCart();
  await cartPage.checkout();
}

/** Same as startCheckout, then submits the customer form. Ends on "Checkout: Overview". */
export async function reachOverview(
  pages: OverviewPages,
  products: readonly Product[] = DEFAULT_ORDER,
  info: CheckoutInfo = CHECKOUT_INFO,
): Promise<void> {
  await startCheckout(pages, products);
  await pages.checkoutInfoPage.submit(info);
}

/** What the cart/overview should list when each product was added once. */
export function toLineItems(products: readonly Product[]): LineItem[] {
  return products.map((product) => ({ name: product.name, price: product.price, quantity: 1 }));
}
