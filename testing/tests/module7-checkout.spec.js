const { test, expect, devices } = require("@playwright/test");

async function openCheckout(page) {
  await page.goto("/checkout");
  await expect(
    page.getByRole("heading", { name: "Checkout & Payment" }),
  ).toBeVisible();
}

test("TC_CHECKOUT_F_01 - Checkout page opens", async ({ page }) => {
  await openCheckout(page);
});
test("TC_CHECKOUT_F_02 - Delivery address input visible", async ({ page }) => {
  await openCheckout(page);
  await expect(page.getByPlaceholder("Delivery Address")).toBeVisible();
});
test("TC_CHECKOUT_F_03 - Pay button visible", async ({ page }) => {
  await openCheckout(page);
  await expect(
    page.getByRole("button", { name: "Pay & Confirm" }),
  ).toBeVisible();
});
test("TC_CHECKOUT_F_04 - User can type address", async ({ page }) => {
  await openCheckout(page);
  await page.getByPlaceholder("Delivery Address").fill("Test Address");
  await expect(page.getByPlaceholder("Delivery Address")).toHaveValue(
    "Test Address",
  );
});
test("TC_CHECKOUT_F_05 - Header link Browse visible", async ({ page }) => {
  await openCheckout(page);
  await expect(page.getByRole("link", { name: "Browse" })).toBeVisible();
});
test("TC_CHECKOUT_F_06 - Header link Auth visible", async ({ page }) => {
  await openCheckout(page);
  await expect(page.getByRole("link", { name: "Auth" })).toBeVisible();
});
test("TC_CHECKOUT_F_07 - Header link Sell Bike visible", async ({ page }) => {
  await openCheckout(page);
  await expect(page.getByRole("link", { name: "Sell Bike" })).toBeVisible();
});
test("TC_CHECKOUT_F_08 - Header link Cart/Wishlist visible", async ({
  page,
}) => {
  await openCheckout(page);
  await expect(page.getByRole("link", { name: "Cart/Wishlist" })).toBeVisible();
});
test("TC_CHECKOUT_F_09 - Header link Orders visible", async ({ page }) => {
  await openCheckout(page);
  await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();
});
test("TC_CHECKOUT_F_10 - Pay button enabled", async ({ page }) => {
  await openCheckout(page);
  await expect(
    page.getByRole("button", { name: "Pay & Confirm" }),
  ).toBeEnabled();
});
test("TC_CHECKOUT_F_11 - Main container visible", async ({ page }) => {
  await openCheckout(page);
  await expect(page.locator("main.container")).toBeVisible();
});
test("TC_CHECKOUT_F_12 - Message area visible", async ({ page }) => {
  await openCheckout(page);
  await expect(page.locator("main.container p")).toBeVisible();
});
test("TC_CHECKOUT_F_13 - Page title contains Bike4Sell", async ({ page }) => {
  await openCheckout(page);
  await expect(page).toHaveTitle(/Bike4Sell/i);
});
test("TC_CHECKOUT_F_14 - Body visible", async ({ page }) => {
  await openCheckout(page);
  await expect(page.locator("body")).toBeVisible();
});
test("TC_CHECKOUT_F_15 - Checkout URL valid", async ({ page }) => {
  await openCheckout(page);
  await expect(page).toHaveURL(/\/checkout$/);
});

test("TC_CHECKOUT_NF_01 - Mobile responsiveness", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await context.newPage();
  await openCheckout(page);
  await expect(
    page.getByRole("button", { name: "Pay & Confirm" }),
  ).toBeVisible();
  await context.close();
});
test("TC_CHECKOUT_NF_02 - Tablet responsiveness", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
  const page = await context.newPage();
  await openCheckout(page);
  await expect(page.getByPlaceholder("Delivery Address")).toBeVisible();
  await context.close();
});
test("TC_CHECKOUT_NF_03 - Basic load performance", async ({ page }) => {
  const start = Date.now();
  await page.goto("/checkout", { waitUntil: "domcontentloaded" });
  expect(Date.now() - start).toBeLessThan(4000);
});
