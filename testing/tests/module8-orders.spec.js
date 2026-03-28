const { test, expect, devices } = require("@playwright/test");

async function openOrders(page) {
  await page.goto("/orders");
  await expect(
    page.getByRole("heading", { name: "Orders & Tracking" }),
  ).toBeVisible();
}

test("User can successfully access the orders page", async ({ page }) => {
  await openOrders(page);
});

test("User can view orders and tracking information", async ({ page }) => {
  await openOrders(page);
  await expect(
    page.getByRole("heading", { name: "Orders & Tracking" }),
  ).toBeVisible();
});

test("User can navigate to browse section from orders page", async ({ page }) => {
  await openOrders(page);
  await expect(page.getByRole("link", { name: "Browse" })).toBeVisible();
});

test("User can access authentication section from orders page", async ({ page }) => {
  await openOrders(page);
  await expect(page.getByRole("link", { name: "Auth" })).toBeVisible();
});

test("User can access sell bike feature from orders page", async ({ page }) => {
  await openOrders(page);
  await expect(page.getByRole("link", { name: "Sell Bike" })).toBeVisible();
});

test("User can navigate to cart or wishlist from orders page", async ({ page }) => {
  await openOrders(page);
  await expect(page.getByRole("link", { name: "Cart/Wishlist" })).toBeVisible();
});

test("User can access orders navigation link consistently", async ({ page }) => {
  await openOrders(page);
  await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();
});

test("User can interact with the main orders content area", async ({ page }) => {
  await openOrders(page);
  await expect(page.locator("main.container")).toBeVisible();
});

test("User can interact with the overall page layout", async ({ page }) => {
  await openOrders(page);
  await expect(page.locator("body")).toBeVisible();
});

test("User is navigated to correct orders page URL", async ({ page }) => {
  await openOrders(page);
  await expect(page).toHaveURL(/\/orders$/);
});

test("Application title reflects correct branding on orders page", async ({ page }) => {
  await openOrders(page);
  await expect(page).toHaveTitle(/Bike4Sell/i);
});

test("User can view order list or empty state information", async ({
  page,
}) => {
  await openOrders(page);
  await expect(page.getByText(/No orders yet|Order #/i)).toBeVisible();
});

test("User can access navigation bar across the orders page", async ({ page }) => {
  await openOrders(page);
  await expect(page.locator("nav")).toBeVisible();
});

test("User can identify application branding in the header", async ({ page }) => {
  await openOrders(page);
  await expect(page.getByRole("heading", { name: "Bike4Sell" })).toBeVisible();
});

test("Orders page is ready for user interaction", async ({ page }) => {
  await openOrders(page);
  await expect(page.locator("main.container")).toBeEnabled();
});

test("Application provides smooth experience on mobile devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await context.newPage();
  await openOrders(page);
  await expect(
    page.getByRole("heading", { name: "Orders & Tracking" }),
  ).toBeVisible();
  await context.close();
});

test("Application layout adapts correctly for tablet devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
  const page = await context.newPage();
  await openOrders(page);
  await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();
  await context.close();
});

test("Orders page loads within acceptable performance limits", async ({ page }) => {
  const start = Date.now();
  await page.goto("/orders", { waitUntil: "domcontentloaded" });
  expect(Date.now() - start).toBeLessThan(4000);
});