const { test, expect, devices } = require("@playwright/test");

async function openCart(page) {
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: "Cart & Wishlist" }),
  ).toBeVisible();
}

test("TC_CART_F_01 - Cart page opens", async ({ page }) => {
  await openCart(page);
});
test("TC_CART_F_02 - Proceed to checkout visible", async ({ page }) => {
  await openCart(page);
  await expect(
    page.getByRole("button", { name: "Proceed to Checkout" }),
  ).toBeVisible();
});
test("TC_CART_F_03 - Empty state or list visible", async ({ page }) => {
  await openCart(page);
  await expect(page.getByText(/Cart is empty|Bike #/i)).toBeVisible();
});
test("TC_CART_F_04 - Header link Browse visible", async ({ page }) => {
  await openCart(page);
  await expect(page.getByRole("link", { name: "Browse" })).toBeVisible();
});
test("TC_CART_F_05 - Header link Auth visible", async ({ page }) => {
  await openCart(page);
  await expect(page.getByRole("link", { name: "Auth" })).toBeVisible();
});
test("TC_CART_F_06 - Header link Sell Bike visible", async ({ page }) => {
  await openCart(page);
  await expect(page.getByRole("link", { name: "Sell Bike" })).toBeVisible();
});
test("TC_CART_F_07 - Header link Orders visible", async ({ page }) => {
  await openCart(page);
  await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();
});
test("TC_CART_F_08 - Proceed button click navigates", async ({ page }) => {
  await openCart(page);
  await page.getByRole("button", { name: "Proceed to Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout$/);
});
test("TC_CART_F_09 - Return to cart from checkout link", async ({ page }) => {
  await page.goto("/checkout");
  await page.goto("/cart");
  await expect(page).toHaveURL(/\/cart$/);
});
test("TC_CART_F_10 - Cart heading text correct", async ({ page }) => {
  await openCart(page);
  await expect(
    page.getByRole("heading", { name: "Cart & Wishlist" }),
  ).toHaveText("Cart & Wishlist");
});
test("TC_CART_F_11 - Cart page title contains Bike4Sell", async ({ page }) => {
  await openCart(page);
  await expect(page).toHaveTitle(/Bike4Sell/i);
});
test("TC_CART_F_12 - Page body visible", async ({ page }) => {
  await openCart(page);
  await expect(page.locator("body")).toBeVisible();
});
test("TC_CART_F_13 - Main container visible", async ({ page }) => {
  await openCart(page);
  await expect(page.locator("main.container")).toBeVisible();
});
test("TC_CART_F_14 - Navigation remains accessible", async ({ page }) => {
  await openCart(page);
  await expect(page.locator("nav")).toBeVisible();
});
test("TC_CART_F_15 - Checkout button remains enabled", async ({ page }) => {
  await openCart(page);
  await expect(
    page.getByRole("button", { name: "Proceed to Checkout" }),
  ).toBeEnabled();
});

test("TC_CART_NF_01 - Mobile responsiveness", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await context.newPage();
  await openCart(page);
  await expect(
    page.getByRole("button", { name: "Proceed to Checkout" }),
  ).toBeVisible();
  await context.close();
});
test("TC_CART_NF_02 - Tablet responsiveness", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
  const page = await context.newPage();
  await openCart(page);
  await expect(
    page.getByRole("heading", { name: "Cart & Wishlist" }),
  ).toBeVisible();
  await context.close();
});
test("TC_CART_NF_03 - Basic load performance", async ({ page }) => {
  const start = Date.now();
  await page.goto("/cart", { waitUntil: "domcontentloaded" });
  expect(Date.now() - start).toBeLessThan(4000);
});
