import { test, expect } from '../../fixtures';

test.describe('Menu, footer and navigation', () => {
  // Logs in as standard_user through the fixture and lands on the inventory page.
  test.beforeEach(async ({ loggedInInventoryPage: _ }) => {});

  test('Burger menu opens and closes', async ({ inventoryPage }) => {
    await inventoryPage.openMenu();

    await expect(inventoryPage.allItemsLink).toBeVisible();
    await expect(inventoryPage.aboutLink).toBeVisible();
    await expect(inventoryPage.logoutLink).toBeVisible();
    await expect(inventoryPage.resetAppStateLink).toBeVisible();

    await inventoryPage.closeMenu();

    await expect(inventoryPage.logoutLink).toBeHidden();
    await expect(inventoryPage.allItemsLink).toBeHidden();
  });

  test('All Items link returns to inventory', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/cart\.html/);

    await cartPage.goToAllItems();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('About link navigates to saucelabs.com', async ({ inventoryPage, page }) => {
    await inventoryPage.goToAbout();

    await expect(page).toHaveURL(/saucelabs\.com/);
  });

  test('Social links (Twitter, Facebook, LinkedIn) have correct targets', async ({ inventoryPage }) => {
    // The links point to third-party sites, so the targets are verified without following them.
    const socialLinks = [
      { link: inventoryPage.twitterLink, href: /(twitter|x)\.com\/saucelabs/i },
      { link: inventoryPage.facebookLink, href: /facebook\.com\/saucelabs/i },
      { link: inventoryPage.linkedinLink, href: /linkedin\.com\/company\/sauce-labs/i },
    ];

    for (const { link, href } of socialLinks) {
      await expect.soft(link).toBeVisible();
      await expect.soft(link).toHaveAttribute('href', href);
      await expect.soft(link).toHaveAttribute('target', '_blank');
    }
  });

  test('Footer copyright text is displayed', async ({ inventoryPage }) => {
    await expect(inventoryPage.footerCopy).toBeVisible();
    await expect(inventoryPage.footerCopy).toHaveText(/© \d{4} Sauce Labs\. All Rights Reserved\./);
  });
});
