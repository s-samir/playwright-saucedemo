import type { LineItem } from './types';

/** "Item total: $39.98" -> 39.98 */
export function parsePrice(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}

/** "Sauce Labs Backpack" -> "sauce-labs-backpack" (matches SauceDemo's data-test ids) */
export function toTestIdSlug(productName: string): string {
  return productName.toLowerCase().replace(/ /g, '-');
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function sum(values: readonly number[]): number {
  return roundMoney(values.reduce((total, value) => total + value, 0));
}

export function sortByName(items: readonly LineItem[]): LineItem[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}
