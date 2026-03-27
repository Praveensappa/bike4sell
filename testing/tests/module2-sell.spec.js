const { test, expect, devices } = require('@playwright/test');

async function openSellPage(page) {
  await page.goto('/sell');
  await expect(page.getByRole('heading', { name: 'Sell Bike' })).toBeVisible();
}

// Functional test cases (15)
test('TC_SELL_F_01 - Sell page loads successfully', async ({ page }) => {
  await openSellPage(page);
});

test('TC_SELL_F_02 - Title input is visible', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByPlaceholder('Title')).toBeVisible();
});

test('TC_SELL_F_03 - Brand input is visible', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByPlaceholder('Brand')).toBeVisible();
});

test('TC_SELL_F_04 - Year input is visible', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByPlaceholder('Year')).toBeVisible();
});

test('TC_SELL_F_05 - Price input is visible', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByPlaceholder('Price')).toBeVisible();
});

test('TC_SELL_F_06 - Fuel type input is visible', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByPlaceholder('Fuel Type')).toBeVisible();
});

test('TC_SELL_F_07 - Specs textarea is visible', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByPlaceholder('Specs')).toBeVisible();
});

test('TC_SELL_F_08 - Image upload input is visible', async ({ page }) => {
  await openSellPage(page);
  await expect(page.locator('input[type="file"]')).toBeVisible();
});

test('TC_SELL_F_09 - Add Bike button is visible', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByRole('button', { name: 'Add Bike' })).toBeVisible();
});

test('TC_SELL_F_10 - User can type in title field', async ({ page }) => {
  await openSellPage(page);
  await page.getByPlaceholder('Title').fill('Yamaha R15');
  await expect(page.getByPlaceholder('Title')).toHaveValue('Yamaha R15');
});

test('TC_SELL_F_11 - User can type in brand field', async ({ page }) => {
  await openSellPage(page);
  await page.getByPlaceholder('Brand').fill('Yamaha');
  await expect(page.getByPlaceholder('Brand')).toHaveValue('Yamaha');
});

test('TC_SELL_F_12 - User can type in year field', async ({ page }) => {
  await openSellPage(page);
  await page.getByPlaceholder('Year').fill('2022');
  await expect(page.getByPlaceholder('Year')).toHaveValue('2022');
});

test('TC_SELL_F_13 - User can type in price field', async ({ page }) => {
  await openSellPage(page);
  await page.getByPlaceholder('Price').fill('120000');
  await expect(page.getByPlaceholder('Price')).toHaveValue('120000');
});

test('TC_SELL_F_14 - User can type in fuel type field', async ({ page }) => {
  await openSellPage(page);
  await page.getByPlaceholder('Fuel Type').fill('Petrol');
  await expect(page.getByPlaceholder('Fuel Type')).toHaveValue('Petrol');
});

test('TC_SELL_F_15 - User can type in specs field', async ({ page }) => {
  await openSellPage(page);
  await page.getByPlaceholder('Specs').fill('Single owner, good condition');
  await expect(page.getByPlaceholder('Specs')).toHaveValue('Single owner, good condition');
});

// Non-functional test cases (3 only)
test('TC_SELL_NF_01 - Mobile responsiveness', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await context.newPage();
  await openSellPage(page);
  await expect(page.getByRole('button', { name: 'Add Bike' })).toBeVisible();
  await context.close();
});

test('TC_SELL_NF_02 - Tablet responsiveness', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['iPad (gen 7)'] });
  const page = await context.newPage();
  await openSellPage(page);
  await expect(page.getByPlaceholder('Title')).toBeVisible();
  await context.close();
});

test('TC_SELL_NF_03 - Basic load performance', async ({ page }) => {
  const start = Date.now();
  await page.goto('/sell', { waitUntil: 'domcontentloaded' });
  const loadMs = Date.now() - start;
  expect(loadMs).toBeLessThan(4000);
});
