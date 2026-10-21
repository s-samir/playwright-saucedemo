import { BasePage } from './BasePage';
import type { CheckoutInfo } from '../utils/types';

export class CheckoutInfoPage extends BasePage {
  readonly firstNameInput = this.page.getByTestId('firstName');
  readonly lastNameInput = this.page.getByTestId('lastName');
  readonly postalCodeInput = this.page.getByTestId('postalCode');
  readonly continueButton = this.page.getByTestId('continue');
  readonly cancelButton = this.page.getByTestId('cancel');
  readonly errorMessage = this.page.getByTestId('error');

  /** Fields left out of `info` are filled with an empty string. */
  async fillInfo(info: Partial<CheckoutInfo>): Promise<void> {
    await this.firstNameInput.fill(info.firstName ?? '');
    await this.lastNameInput.fill(info.lastName ?? '');
    await this.postalCodeInput.fill(info.postalCode ?? '');
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async submit(info: Partial<CheckoutInfo>): Promise<void> {
    await this.fillInfo(info);
    await this.continue();
  }
}
