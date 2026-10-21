import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice, toTestIdSlug } from '../utils/helpers';
import type { ItemDetails, Product } from '../utils/types';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  readonly inventoryList = this.page.getByTestId('inventory-list');
  readonly items = this.page.getByTestId('inventory-item');
  readonly itemNames = this.page.getByTestId('inventory-item-name');
  readonly itemPrices = this.page.getByTestId('inventory-item-price');
  readonly itemImages = this.items.getByRole('img');
  readonly sortDropdown = this.page.getByTestId('product-sort-container');

  getItemCard(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  addButton(productName: string): Locator {
    return this.page.getByTestId(`add-to-cart-${toTestIdSlug(productName)}`);
  }

  removeButton(productName: string): Locator {
    return this.page.getByTestId(`remove-${toTestIdSlug(productName)}`);
  }

  async addToCart(productName: string): Promise<void> {
    await this.addButton(productName).click();
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.removeButton(productName).click();
  }

  async addProducts(products: readonly Product[]): Promise<void> {
    for (const product of products) {
      await this.addToCart(product.name);
    }
  }

  async removeProducts(products: readonly Product[]): Promise<void> {
    for (const product of products) {
      await this.removeFromCart(product.name);
    }
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map(parsePrice);
  }

  async getImageSources(): Promise<string[]> {
    return this.itemImages.evaluateAll((images) =>
      images.map((image) => image.getAttribute('src') ?? ''),
    );
  }

  async getItemDetails(productName: string): Promise<ItemDetails> {
    const card = this.getItemCard(productName);
    return {
      name: (await card.getByTestId('inventory-item-name').textContent()) ?? '',
      description: (await card.getByTestId('inventory-item-desc').textContent()) ?? '',
      price: parsePrice((await card.getByTestId('inventory-item-price').textContent()) ?? ''),
      imageSrc: (await card.getByRole('img').getAttribute('src')) ?? '',
    };
  }

  async openProduct(productName: string): Promise<void> {
    await this.itemNames.filter({ hasText: productName }).click();
  }

  /** Rounded bounding boxes of the key layout elements, one readable string per element. */
  async getLayoutBoxes(): Promise<string[]> {
    const targets: Array<[string, Locator]> = [
      ['cart', this.cartLink],
      ['menu', this.menuButton],
      ['sort', this.sortDropdown],
    ];
    const cards = await this.items.all();
    cards.forEach((card, index) => {
      targets.push(
        [`item${index}.image`, card.getByRole('img')],
        [`item${index}.name`, card.getByTestId('inventory-item-name')],
        [`item${index}.price`, card.getByTestId('inventory-item-price')],
        [`item${index}.button`, card.getByRole('button')],
      );
    });

    return Promise.all(
      targets.map(async ([key, locator]) => {
        const box = await locator.boundingBox();
        if (!box) return `${key}: not rendered`;
        return `${key}: ${Math.round(box.x)},${Math.round(box.y)} ${Math.round(box.width)}x${Math.round(box.height)}`;
      }),
    );
  }
}
