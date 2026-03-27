const { test, expect } = require('@playwright/test');
const { AuthPage } = require('../pages/AuthPage');
const { HomePage } = require('../pages/HomePage');
const { CartPage } = require('../pages/CartPage');
const data = require('./test-data/module-data.json');

test('E2E: user registers -> login -> browse -> add cart -> checkout', async ({ page }) => {
  const auth = new AuthPage(page);
  const home = new HomePage(page);
  const cart = new CartPage(page);

  await auth.goto();
  await auth.register(data.auth.valid);
  await auth.verifyOtp(data.auth.valid.email, data.auth.otp);
  await auth.login(data.auth.valid.email, data.auth.valid.password);
  await expect(page.getByText(/Login successful/i)).toBeVisible();

  await home.goto();
  await home.openFirstBike();
  await page.getByRole('button', { name: 'Add to Cart' }).click();

  await cart.goto();
  await cart.proceedToCheckout();
  await page.getByPlaceholder('Delivery Address').fill(data.checkout.address);
  await page.getByRole('button', { name: 'Pay & Confirm' }).click();
  await expect(page.getByText(/Booking confirmed|Checkout blocked/i)).toBeVisible();
});
