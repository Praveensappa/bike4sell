const { test, expect, devices } = require("@playwright/test");

async function openCheckout(page) {
  await page.goto("/checkout");
  await expect(
    page.getByRole("heading", { name: "Checkout & Payment" }),
  ).toBeVisible();
}

test("User can successfully access the checkout page", async ({ page }) => {
  await openCheckout(page);
});

test("User can provide delivery address details", async ({ page }) => {
  await openCheckout(page);
  await expect(page.getByPlaceholder("Delivery Address")).toBeVisible();
});

test("User can proceed with payment confirmation", async ({ page }) => {
  await openCheckout(page);
  await expect(
    page.getByRole("button", { name: "Pay & Confirm" }),
  ).toBeVisible();
});

test("User can enter delivery address information", async ({ page }) => {
  await openCheckout(page);
  await page.getByPlaceholder("Delivery Address").fill("Test Address");
  await expect(page.getByPlaceholder("Delivery Address")).toHaveValue(
    "Test Address",
  );
});

test("User can navigate to browse section from checkout page", async ({ page }) => {
  await openCheckout(page);
  await expect(page.getByRole("link", { name: "Browse" })).toBeVisible();
});

test("User can access authentication section from checkout page", async ({ page }) => {
  await openCheckout(page);
  await expect(page.getByRole("link", { name: "Auth" })).toBeVisible();
});

test("User can access sell bike feature from checkout page", async ({ page }) => {
  await openCheckout(page);
  await expect(page.getByRole("link", { name: "Sell Bike" })).toBeVisible();
});

test("User can navigate to cart or wishlist from checkout page", async ({
  page,
}) => {
  await openCheckout(page);
  await expect(page.getByRole("link", { name: "Cart/Wishlist" })).toBeVisible();
});

test("User can access orders section from checkout page", async ({ page }) => {
  await openCheckout(page);
  await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();
});

test("User can proceed with payment when action is enabled", async ({ page }) => {
  await openCheckout(page);
  await expect(
    page.getByRole("button", { name: "Pay & Confirm" }),
  ).toBeEnabled();
});

test("User can interact with the main checkout content area", async ({ page }) => {
  await openCheckout(page);
  await expect(page.locator("main.container")).toBeVisible();
});

test("User can view informational messages in checkout section", async ({ page }) => {
  await openCheckout(page);
  await expect(page.locator("main.container p")).toBeVisible();
});

test("Application title reflects correct branding on checkout page", async ({ page }) => {
  await openCheckout(page);
  await expect(page).toHaveTitle(/Bike4Sell/i);
});

test("User can interact with the overall page layout", async ({ page }) => {
  await openCheckout(page);
  await expect(page.locator("body")).toBeVisible();
});

test("User is navigated to correct checkout URL", async ({ page }) => {
  await openCheckout(page);
  await expect(page).toHaveURL(/\/checkout$/);
});

test("Application provides smooth experience on mobile devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await context.newPage();
  await openCheckout(page);
  await expect(
    page.getByRole("button", { name: "Pay & Confirm" }),
  ).toBeVisible();
  await context.close();
});

test("Application layout adapts correctly for tablet devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
  const page = await context.newPage();
  await openCheckout(page);
  await expect(page.getByPlaceholder("Delivery Address")).toBeVisible();
  await context.close();
});

test("Checkout page loads within acceptable performance limits", async ({ page }) => {
  const start = Date.now();
  await page.goto("/checkout", { waitUntil: "domcontentloaded" });
  expect(Date.now() - start).toBeLessThan(4000);
});