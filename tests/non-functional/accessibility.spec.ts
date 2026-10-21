import { AxeBuilder } from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';
import { test, expect } from '../../fixtures';

/**
 * Runs axe-core (WCAG 2.0 A/AA rules), attaches the full violation list to the HTML report and
 * returns only the critical violations, which are the ones this suite fails on.
 */
async function scanForCriticalViolations(page: Page, testInfo: TestInfo, name: string) {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  await testInfo.attach(`axe-violations-${name}`, {
    body: JSON.stringify(violations, null, 2),
    contentType: 'application/json',
  });

  return violations
    .filter((violation) => violation.impact === 'critical')
    .map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.length} element(s))`);
}

test.describe('Accessibility scan on login, inventory and cart pages', () => {
  test('login page has no critical accessibility violations', async ({ loginPage, page }, testInfo) => {
    await loginPage.open();
    await expect(loginPage.loginButton).toBeVisible();

    expect(await scanForCriticalViolations(page, testInfo, 'login')).toEqual([]);
  });

  test('inventory page has no critical accessibility violations', async ({
    loggedInInventoryPage,
    page,
  }, testInfo) => {
    await expect(loggedInInventoryPage.items.first()).toBeVisible();

    expect(await scanForCriticalViolations(page, testInfo, 'inventory')).toEqual([]);
  });

  test('cart page has no critical accessibility violations', async ({
    loggedInInventoryPage,
    cartPage,
    page,
  }, testInfo) => {
    await loggedInInventoryPage.openCart();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    expect(await scanForCriticalViolations(page, testInfo, 'cart')).toEqual([]);
  });
});
