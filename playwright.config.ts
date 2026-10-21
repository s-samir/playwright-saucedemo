import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },

  use: {
    baseURL: process.env.BASE_URL,
    testIdAttribute: 'data-test', // lets getByTestId() work with SauceDemo's data-test attributes
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Full regression runs on Chromium only.
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },

    // Firefox and WebKit run only the @smoke tests (tests/smoke).
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, grep: /@smoke/ },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, grep: /@smoke/ },
  ],
});
