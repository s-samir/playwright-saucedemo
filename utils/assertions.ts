import { expect } from '@playwright/test';
import type { BasePage } from '../pages/BasePage';

/** The badge is absent from the DOM when the cart is empty, so 0 means "hidden". */
export async function expectCartCount(page: BasePage, count: number): Promise<void> {
  if (count === 0) {
    await expect(page.cartBadge).toBeHidden();
  } else {
    await expect(page.cartBadge).toHaveText(String(count));
  }
}
