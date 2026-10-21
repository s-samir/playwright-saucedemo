import type { Locator, Page } from '@playwright/test';
import { parsePrice } from '../utils/helpers';
import type { LineItem } from '../utils/types';

/** Elements shared by every logged-in page: header, burger menu, cart icon, footer. */
export abstract class BasePage {
  readonly pageTitle: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  readonly menuButton: Locator;
  readonly menuCloseButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  readonly footerCopy: Locator;
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedinLink: Locator;

  constructor(protected readonly page: Page) {
    this.pageTitle = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');

    this.menuButton = page.locator('#react-burger-menu-btn');
    this.menuCloseButton = page.locator('#react-burger-cross-btn');
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
    this.aboutLink = page.getByTestId('about-sidebar-link');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.resetAppStateLink = page.getByTestId('reset-sidebar-link');

    this.footerCopy = page.getByTestId('footer-copy');

    // DEBUGGING RESULT - Located by accessible name: the footer links have no data-test ids on the live site.
    this.twitterLink = page.getByRole('link', { name: /twitter|^x$/i });
    this.facebookLink = page.getByRole('link', { name: /facebook/i });
    this.linkedinLink = page.getByRole('link', { name: /linkedin/i });
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  async closeMenu(): Promise<void> {
    await this.menuCloseButton.click();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.resetAppStateLink.click();
  }

  async goToAllItems(): Promise<void> {
    await this.openMenu();
    await this.allItemsLink.click();
  }

  async goToAbout(): Promise<void> {
    await this.openMenu();
    await this.aboutLink.click();
  }

  /**
   * Reads name, price and quantity from cart/overview rows in ONE atomic DOM snapshot.
   * It does not wait: callers should first `await expect(rows).toHaveCount(n)` so the page has finished rendering.
   */
  protected async readLineItems(rows: Locator): Promise<LineItem[]> {
    const raw = await rows.evaluateAll((elements) =>
      elements.map((element) => ({
        name: element.querySelector('[data-test="inventory-item-name"]')?.textContent ?? '',
        price: element.querySelector('[data-test="inventory-item-price"]')?.textContent ?? '',
        quantity: element.querySelector('[data-test="item-quantity"]')?.textContent ?? '',
      })),
    );
    return raw.map((row) => ({
      name: row.name,
      price: parsePrice(row.price),
      quantity: Number(row.quantity),
    }));
  }
}