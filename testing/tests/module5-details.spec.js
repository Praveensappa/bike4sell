const { test, expect, devices } = require("@playwright/test");

async function openDetails(page) {
  await page.goto("/bikes/1");
  await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
}

test("User can successfully access the bike details page", async ({ page }) => {
  await openDetails(page);
});

test("User can add the bike to cart from details page", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByRole("button", { name: "Add to Cart" })).toBeVisible();
});

test("User can add the bike to wishlist from details page", async ({ page }) => {
  await openDetails(page);
  await expect(
    page.getByRole("button", { name: "Add to Wishlist" }),
  ).toBeVisible();
});

test("User can view reviews section for the bike", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByRole("heading", { name: "Reviews" })).toBeVisible();
});

test("User can initiate adding a review for the bike", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByRole("button", { name: "Add Review" })).toBeVisible();
});

test("User can provide rating input for the bike", async ({ page }) => {
  await openDetails(page);
  await expect(page.locator('input[type="number"]').first()).toBeVisible();
});

test("User can provide comments for the review", async ({ page }) => {
  await openDetails(page);
  await expect(page.locator("textarea")).toBeVisible();
});

test("User can navigate back from the details page", async ({ page }) => {
  await openDetails(page);
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("User can enter rating value successfully", async ({ page }) => {
  await openDetails(page);
  await page.locator('input[type="number"]').first().fill("4");
  await expect(page.locator('input[type="number"]').first()).toHaveValue("4");
});

test("User can enter comment for the review", async ({ page }) => {
  await openDetails(page);
  await page.locator("textarea").fill("Good bike");
  await expect(page.locator("textarea")).toHaveValue("Good bike");
});

test("User can view price information of the bike", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByText(/Price:/i)).toBeVisible();
});

test("User can view seller information of the bike", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByText(/Seller:/i)).toBeVisible();
});

test("User can access bike specifications details", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByText(/Specifications:/i)).toBeVisible();
});

test("User can navigate to browse section from header", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByRole("link", { name: "Browse" })).toBeVisible();
});

test("User can access cart or wishlist from header navigation", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByRole("link", { name: "Cart/Wishlist" })).toBeVisible();
});

test("Application provides smooth experience on mobile devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await context.newPage();
  await openDetails(page);
  await expect(page.getByRole("button", { name: "Add to Cart" })).toBeVisible();
  await context.close();
});

test("Application layout adapts correctly for tablet devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
  const page = await context.newPage();
  await openDetails(page);
  await expect(
    page.getByRole("button", { name: "Add to Wishlist" }),
  ).toBeVisible();
  await context.close();
});

test("Details page loads within acceptable performance limits", async ({ page }) => {
  const start = Date.now();
  await page.goto("/bikes/1", { waitUntil: "domcontentloaded" });
  expect(Date.now() - start).toBeLessThan(4000);
});