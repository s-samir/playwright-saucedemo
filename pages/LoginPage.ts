import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput = this.page.getByTestId('username');
  readonly passwordInput = this.page.getByTestId('password');
  readonly loginButton = this.page.getByTestId('login-button');
  readonly errorMessage = this.page.getByTestId('error');
  readonly errorCloseButton = this.page.getByTestId('error-button');

  async open(): Promise<void> {
    await this.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Submits the form with the Enter key instead of clicking the button. */
  async loginWithEnter(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.passwordInput.press('Enter');
  }
}
