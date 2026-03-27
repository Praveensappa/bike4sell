const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: ['**/module*.spec.js'],
  timeout: 60000,
  retries: 1,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list'],['allure-playwright']],
  use: {
    baseURL: 'http://localhost:5173',
    browserName: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  fullyParallel: true
});
