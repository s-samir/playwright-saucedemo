import { BasePage } from './BasePage';
import { parsePrice } from '../utils/helpers';
import type { ItemDetails } from '../utils/types';

export class ProductDetailsPage extends BasePage {
  readonly name = this.page.getByTestId('inventory-item-name');
  readonly description = this.page.getByTestId('inventory-item-desc');
  readonly price = this.page.getByTestId('inventory-item-price');
  readonly image = this.page.locator('.inventory_details_img');
  readonly addToCartButton = this.page.getByTestId('add-to-cart');
  readonly removeButton = this.page.getByTestId('remove');
  readonly backToProductsButton = this.page.getByTestId('back-to-products');
  readonly notFoundMessage = this.page.getByText(/item not found/i);

  async open(id: number | string): Promise<void> {
    await this.goto(`/inventory-item.html?id=${id}`);
  }

  /**
   * DEBUGGING RESULT - The app is a single-page app: the URL changes before the new screen is drawn, and for a moment the old
   * inventory list (6x `inventory-item-name`) is still in the DOM. Wait for an element that only exists here.
   */
  
  async waitUntilLoaded(): Promise<void> {
    await this.backToProductsButton.waitFor({ state: 'visible' });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  async getDetails(): Promise<ItemDetails> {
    return {
      name: (await this.name.textContent()) ?? '',
      description: (await this.description.textContent()) ?? '',
      price: parsePrice((await this.price.textContent()) ?? ''),
      imageSrc: (await this.image.getAttribute('src')) ?? '',
    };
  }
}
