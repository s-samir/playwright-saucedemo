import { BasePage } from './BasePage';
import { parsePrice } from '../utils/helpers';
import type { LineItem } from '../utils/types';

export class CheckoutOverviewPage extends BasePage {
  readonly items = this.page.getByTestId('inventory-item');
  readonly paymentInfoLabel = this.page.getByTestId('payment-info-label');
  readonly paymentInfoValue = this.page.getByTestId('payment-info-value');
  readonly shippingInfoLabel = this.page.getByTestId('shipping-info-label');
  readonly shippingInfoValue = this.page.getByTestId('shipping-info-value');
  readonly subtotalLabel = this.page.getByTestId('subtotal-label');
  readonly taxLabel = this.page.getByTestId('tax-label');
  readonly totalLabel = this.page.getByTestId('total-label');
  readonly finishButton = this.page.getByTestId('finish');
  readonly cancelButton = this.page.getByTestId('cancel');

  async getItems(): Promise<LineItem[]> {
    return this.readLineItems(this.items);
  }

  async getSubtotal(): Promise<number> {
    return parsePrice((await this.subtotalLabel.textContent()) ?? '');
  }

  async getTax(): Promise<number> {
    return parsePrice((await this.taxLabel.textContent()) ?? '');
  }

  async getTotal(): Promise<number> {
    return parsePrice((await this.totalLabel.textContent()) ?? '');
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
