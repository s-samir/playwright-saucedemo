import { BasePage } from './BasePage';
import { toTestIdSlug } from '../utils/helpers';
import type { LineItem } from '../utils/types';

export class CartPage extends BasePage {
  readonly items = this.page.getByTestId('inventory-item');
  readonly checkoutButton = this.page.getByTestId('checkout');
  readonly continueShoppingButton = this.page.getByTestId('continue-shopping');

  async open(): Promise<void> {
    await this.goto('/cart.html');
  }

  async getItems(): Promise<LineItem[]> {
    return this.readLineItems(this.items);
  }

  async removeItem(productName: string): Promise<void> {
    await this.page.getByTestId(`remove-${toTestIdSlug(productName)}`).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
