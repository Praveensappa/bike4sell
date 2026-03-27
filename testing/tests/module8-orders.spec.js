const { test, expect, devices } = require("@playwright/test");

async function openOrders(page) {
  await page.goto("/orders");
  await expect(
    page.getByRole("heading", { name: "Orders & Tracking" }),
  ).toBeVisible();
}

test("TC_ORDER_F_01 - Orders page opens", async ({ page }) => {
  await openOrders(page);
});
test("TC_ORDER_F_02 - Orders heading visible", async ({ page }) => {
  await openOrders(page);
  await expect(
    page.getByRole("heading", { name: "Orders & Tracking" }),
  ).toBeVisible();
});
test("TC_ORDER_F_03 - Header link Browse visible", async ({ page }) => {
  await openOrders(page);
  await expect(page.getByRole("link", { name: "Browse" })).toBeVisible();
});
test("TC_ORDER_F_04 - Header link Auth visible", async ({ page }) => {
  await openOrders(page);
  await expect(page.getByRole("link", { name: "Auth" })).toBeVisible();
});
test("TC_ORDER_F_05 - Header link Sell Bike visible", async ({ page }) => {
  await openOrders(page);
  await expect(page.getByRole("link", { name: "Sell Bike" })).toBeVisible();
});
test("TC_ORDER_F_06 - Header link Cart/Wishlist visible", async ({ page }) => {
  await openOrders(page);
  await expect(page.getByRole("link", { name: "Cart/Wishlist" })).toBeVisible();
});
test("TC_ORDER_F_07 - Header link Orders visible", async ({ page }) => {
  await openOrders(page);
  await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();
});
test("TC_ORDER_F_08 - Main container visible", async ({ page }) => {
  await openOrders(page);
  await expect(page.locator("main.container")).toBeVisible();
});
test("TC_ORDER_F_09 - Body visible", async ({ page }) => {
  await openOrders(page);
  await expect(page.locator("body")).toBeVisible();
});
test("TC_ORDER_F_10 - Orders URL valid", async ({ page }) => {
  await openOrders(page);
  await expect(page).toHaveURL(/\/orders$/);
});
test("TC_ORDER_F_11 - Page title contains Bike4Sell", async ({ page }) => {
  await openOrders(page);
  await expect(page).toHaveTitle(/Bike4Sell/i);
});
test("TC_ORDER_F_12 - Empty state/order rows text visible", async ({
  page,
}) => {
  await openOrders(page);
  await expect(page.getByText(/No orders yet|Order #/i)).toBeVisible();
});
test("TC_ORDER_F_13 - Navigation bar visible", async ({ page }) => {
  await openOrders(page);
  await expect(page.locator("nav")).toBeVisible();
});
test("TC_ORDER_F_14 - Header brand visible", async ({ page }) => {
  await openOrders(page);
  await expect(page.getByRole("heading", { name: "Bike4Sell" })).toBeVisible();
});
test("TC_ORDER_F_15 - Orders page interactive ready", async ({ page }) => {
  await openOrders(page);
  await expect(page.locator("main.container")).toBeEnabled();
});

test("TC_ORDER_NF_01 - Mobile responsiveness", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await context.newPage();
  await openOrders(page);
  await expect(
    page.getByRole("heading", { name: "Orders & Tracking" }),
  ).toBeVisible();
  await context.close();
});
test("TC_ORDER_NF_02 - Tablet responsiveness", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
  const page = await context.newPage();
  await openOrders(page);
  await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();
  await context.close();
});
test("TC_ORDER_NF_03 - Basic load performance", async ({ page }) => {
  const start = Date.now();
  await page.goto("/orders", { waitUntil: "domcontentloaded" });
  expect(Date.now() - start).toBeLessThan(4000);
});
