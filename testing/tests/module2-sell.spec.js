const { test, expect, devices } = require('@playwright/test');

async function openSellPage(page) {
  await page.goto('/sell');
  await expect(page.getByRole('heading', { name: 'Sell Bike' })).toBeVisible();
}

// Functional test cases
test('User can successfully access the sell bike page', async ({ page }) => {
  await openSellPage(page);
});

test('User can interact with the title input field', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByPlaceholder('Title')).toBeVisible();
});

test('User can interact with the brand input field', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByPlaceholder('Brand')).toBeVisible();
});

test('User can provide year details for the bike', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByPlaceholder('Year')).toBeVisible();
});

test('User can enter the price of the bike', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByPlaceholder('Price')).toBeVisible();
});

test('User can specify the fuel type of the bike', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByPlaceholder('Fuel Type')).toBeVisible();
});

test('User can provide additional specifications for the bike', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByPlaceholder('Specs')).toBeVisible();
});

test('User can upload an image for the bike listing', async ({ page }) => {
  await openSellPage(page);
  await expect(page.locator('input[type="file"]')).toBeVisible();
});

test('User can initiate adding a bike listing', async ({ page }) => {
  await openSellPage(page);
  await expect(page.getByRole('button', { name: 'Add Bike' })).toBeVisible();
});

test('User can enter details in the title field', async ({ page }) => {
  await openSellPage(page);
  await page.getByPlaceholder('Title').fill('Yamaha R15');
  await expect(page.getByPlaceholder('Title')).toHaveValue('Yamaha R15');
});

test('User can enter details in the brand field', async ({ page }) => {
  await openSellPage(page);
  await page.getByPlaceholder('Brand').fill('Yamaha');
  await expect(page.getByPlaceholder('Brand')).toHaveValue('Yamaha');
});

test('User can enter details in the year field', async ({ page }) => {
  await openSellPage(page);
  await page.getByPlaceholder('Year').fill('2022');
  await expect(page.getByPlaceholder('Year')).toHaveValue('2022');
});

test('User can enter details in the price field', async ({ page }) => {
  await openSellPage(page);
  await page.getByPlaceholder('Price').fill('120000');
  await expect(page.getByPlaceholder('Price')).toHaveValue('120000');
});

test('User can enter details in the fuel type field', async ({ page }) => {
  await openSellPage(page);
  await page.getByPlaceholder('Fuel Type').fill('Petrol');
  await expect(page.getByPlaceholder('Fuel Type')).toHaveValue('Petrol');
});

test('User can provide detailed specifications for the bike', async ({ page }) => {
  await openSellPage(page);
  await page.getByPlaceholder('Specs').fill('Single owner, good condition');
  await expect(page.getByPlaceholder('Specs')).toHaveValue('Single owner, good condition');
});

// Non-functional test cases
test('Application provides a smooth experience on mobile devices', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await context.newPage();
  await openSellPage(page);
  await expect(page.getByRole('button', { name: 'Add Bike' })).toBeVisible();
  await context.close();
});

test('Application layout adapts properly for tablet devices', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['iPad (gen 7)'] });
  const page = await context.newPage();
  await openSellPage(page);
  await expect(page.getByPlaceholder('Title')).toBeVisible();
  await context.close();
});

test('Sell page loads within acceptable performance limits', async ({ page }) => {
  const start = Date.now();
  await page.goto('/sell', { waitUntil: 'domcontentloaded' });
  const loadMs = Date.now() - start;
  expect(loadMs).toBeLessThan(4000);
});