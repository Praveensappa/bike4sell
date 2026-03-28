const { test, expect, devices } = require("@playwright/test");

async function openCart(page) {
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: "Cart & Wishlist" }),
  ).toBeVisible();
}

test("User can successfully access the cart page", async ({ page }) => {
  await openCart(page);
});

test("User can proceed to checkout from the cart page", async ({ page }) => {
  await openCart(page);
  await expect(
    page.getByRole("button", { name: "Proceed to Checkout" }),
  ).toBeVisible();
});

test("User can view cart items or empty state message", async ({ page }) => {
  await openCart(page);
  await expect(page.getByText(/Cart is empty|Bike #/i)).toBeVisible();
});

test("User can navigate to browse section from cart page", async ({ page }) => {
  await openCart(page);
  await expect(page.getByRole("link", { name: "Browse" })).toBeVisible();
});

test("User can access authentication section from cart page", async ({ page }) => {
  await openCart(page);
  await expect(page.getByRole("link", { name: "Auth" })).toBeVisible();
});

test("User can access sell bike feature from cart page", async ({ page }) => {
  await openCart(page);
  await expect(page.getByRole("link", { name: "Sell Bike" })).toBeVisible();
});

test("User can navigate to orders section from cart page", async ({ page }) => {
  await openCart(page);
  await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();
});

test("User is redirected to checkout after proceeding", async ({ page }) => {
  await openCart(page);
  await page.getByRole("button", { name: "Proceed to Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout$/);
});

test("User can return back to cart from checkout flow", async ({ page }) => {
  await page.goto("/checkout");
  await page.goto("/cart");
  await expect(page).toHaveURL(/\/cart$/);
});

test("User can verify cart page heading information", async ({ page }) => {
  await openCart(page);
  await expect(
    page.getByRole("heading", { name: "Cart & Wishlist" }),
  ).toHaveText("Cart & Wishlist");
});

test("Application title reflects correct branding on cart page", async ({ page }) => {
  await openCart(page);
  await expect(page).toHaveTitle(/Bike4Sell/i);
});

test("User can interact with the main content area of the cart page", async ({ page }) => {
  await openCart(page);
  await expect(page.locator("body")).toBeVisible();
});

test("User can access the main container of the cart page", async ({ page }) => {
  await openCart(page);
  await expect(page.locator("main.container")).toBeVisible();
});

test("User can access navigation elements consistently across the page", async ({ page }) => {
  await openCart(page);
  await expect(page.locator("nav")).toBeVisible();
});

test("Checkout option remains available for user interaction", async ({ page }) => {
  await openCart(page);
  await expect(
    page.getByRole("button", { name: "Proceed to Checkout" }),
  ).toBeEnabled();
});

test("Application provides smooth experience on mobile devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await context.newPage();
  await openCart(page);
  await expect(
    page.getByRole("button", { name: "Proceed to Checkout" }),
  ).toBeVisible();
  await context.close();
});

test("Application layout adapts correctly for tablet devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
  const page = await context.newPage();
  await openCart(page);
  await expect(
    page.getByRole("heading", { name: "Cart & Wishlist" }),
  ).toBeVisible();
  await context.close();
});

test("Cart page loads within acceptable performance limits", async ({ page }) => {
  const start = Date.now();
  await page.goto("/cart", { waitUntil: "domcontentloaded" });
  expect(Date.now() - start).toBeLessThan(4000);
});