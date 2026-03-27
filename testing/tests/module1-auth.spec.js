const { test, expect, devices } = require('@playwright/test');

async function openAuth(page) {
  await page.goto('/auth');
  await expect(page.getByRole('heading', { name: 'Authentication' })).toBeVisible();
}

test('TC_AUTH_F_01 - Auth page opens', async ({ page }) => { await openAuth(page); });
test('TC_AUTH_F_02 - Register section visible', async ({ page }) => { await openAuth(page); await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible(); });
test('TC_AUTH_F_03 - OTP section visible', async ({ page }) => { await openAuth(page); await expect(page.getByRole('heading', { name: 'OTP Verification' })).toBeVisible(); });
test('TC_AUTH_F_04 - Login section visible', async ({ page }) => { await openAuth(page); await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible(); });
test('TC_AUTH_F_05 - Name input visible', async ({ page }) => { await openAuth(page); await expect(page.getByPlaceholder('Name')).toBeVisible(); });
test('TC_AUTH_F_06 - Register email input visible', async ({ page }) => { await openAuth(page); await expect(page.getByPlaceholder('Email').first()).toBeVisible(); });
test('TC_AUTH_F_07 - Mobile input visible', async ({ page }) => { await openAuth(page); await expect(page.getByPlaceholder('Mobile')).toBeVisible(); });
test('TC_AUTH_F_08 - Register password input visible', async ({ page }) => { await openAuth(page); await expect(page.getByPlaceholder('Password').first()).toBeVisible(); });
test('TC_AUTH_F_09 - Register button visible', async ({ page }) => { await openAuth(page); await expect(page.getByRole('button', { name: 'Register' })).toBeVisible(); });
test('TC_AUTH_F_10 - OTP input visible', async ({ page }) => { await openAuth(page); await expect(page.getByPlaceholder('OTP')).toBeVisible(); });
test('TC_AUTH_F_11 - Verify OTP button visible', async ({ page }) => { await openAuth(page); await expect(page.getByRole('button', { name: 'Verify OTP' })).toBeVisible(); });
test('TC_AUTH_F_12 - Login email input visible', async ({ page }) => { await openAuth(page); await expect(page.getByPlaceholder('Email').nth(2)).toBeVisible(); });
test('TC_AUTH_F_13 - Login password input visible', async ({ page }) => { await openAuth(page); await expect(page.getByPlaceholder('Password').nth(1)).toBeVisible(); });
test('TC_AUTH_F_14 - Login button visible', async ({ page }) => { await openAuth(page); await expect(page.getByRole('button', { name: 'Login' })).toBeVisible(); });
test('TC_AUTH_F_15 - User can type name', async ({ page }) => { await openAuth(page); await page.getByPlaceholder('Name').fill('QA User'); await expect(page.getByPlaceholder('Name')).toHaveValue('QA User'); });

test('TC_AUTH_NF_01 - Mobile responsiveness', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await context.newPage();
  await openAuth(page);
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await context.close();
});
test('TC_AUTH_NF_02 - Tablet responsiveness', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['iPad (gen 7)'] });
  const page = await context.newPage();
  await openAuth(page);
  await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
  await context.close();
});
test('TC_AUTH_NF_03 - Basic load performance', async ({ page }) => {
  const start = Date.now();
  await page.goto('/auth', { waitUntil: 'domcontentloaded' });
  expect(Date.now() - start).toBeLessThan(4000);
});
