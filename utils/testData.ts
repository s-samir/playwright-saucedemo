import type { CheckoutInfo, Product } from './types';

export const PRODUCTS = {
  backpack: { name: 'Sauce Labs Backpack', price: 29.99 },
  bikeLight: { name: 'Sauce Labs Bike Light', price: 9.99 },
  boltTShirt: { name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
  fleeceJacket: { name: 'Sauce Labs Fleece Jacket', price: 49.99 },
  onesie: { name: 'Sauce Labs Onesie', price: 7.99 },
  redTShirt: { name: 'Test.allTheThings() T-Shirt (Red)', price: 15.99 },
} as const satisfies Record<string, Product>;

export const ALL_PRODUCTS: readonly Product[] = Object.values(PRODUCTS);

export const ERRORS = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  accessDenied: (path: string) => `Epic sadface: You can only access '${path}' when you are logged in.`,
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
};

export const CHECKOUT_INFO: CheckoutInfo = {
  firstName: 'Samir',
  lastName: 'Tester',
  postalCode: '71000',
};

export const TAX_RATE = 0.08;

/** Login must finish within this many milliseconds (used for the performance_glitch_user test). */
export const LOGIN_TIME_BUDGET_MS = 3000;
