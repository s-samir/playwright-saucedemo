import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly completeHeader = this.page.getByTestId('complete-header');
  readonly completeText = this.page.getByTestId('complete-text');
  readonly backHomeButton = this.page.getByTestId('back-to-products');

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
