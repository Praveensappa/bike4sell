const { test, expect, devices } = require("@playwright/test");

async function openDetails(page) {
  await page.goto("/bikes/1");
  await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
}

test("TC_DETAILS_F_01 - Details page opens", async ({ page }) => {
  await openDetails(page);
});
test("TC_DETAILS_F_02 - Add to Cart button visible", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByRole("button", { name: "Add to Cart" })).toBeVisible();
});
test("TC_DETAILS_F_03 - Add to Wishlist button visible", async ({ page }) => {
  await openDetails(page);
  await expect(
    page.getByRole("button", { name: "Add to Wishlist" }),
  ).toBeVisible();
});
test("TC_DETAILS_F_04 - Reviews heading visible", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByRole("heading", { name: "Reviews" })).toBeVisible();
});
test("TC_DETAILS_F_05 - Add Review button visible", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByRole("button", { name: "Add Review" })).toBeVisible();
});
test("TC_DETAILS_F_06 - Rating input visible", async ({ page }) => {
  await openDetails(page);
  await expect(page.locator('input[type="number"]').first()).toBeVisible();
});
test("TC_DETAILS_F_07 - Comment textarea visible", async ({ page }) => {
  await openDetails(page);
  await expect(page.locator("textarea")).toBeVisible();
});
test("TC_DETAILS_F_08 - Back button works", async ({ page }) => {
  await openDetails(page);
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page).toHaveURL(/\/$/);
});
test("TC_DETAILS_F_09 - Rating accepts value", async ({ page }) => {
  await openDetails(page);
  await page.locator('input[type="number"]').first().fill("4");
  await expect(page.locator('input[type="number"]').first()).toHaveValue("4");
});
test("TC_DETAILS_F_10 - Comment accepts value", async ({ page }) => {
  await openDetails(page);
  await page.locator("textarea").fill("Good bike");
  await expect(page.locator("textarea")).toHaveValue("Good bike");
});
test("TC_DETAILS_F_11 - Page shows price label", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByText(/Price:/i)).toBeVisible();
});
test("TC_DETAILS_F_12 - Page shows seller label", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByText(/Seller:/i)).toBeVisible();
});
test("TC_DETAILS_F_13 - Page shows specifications label", async ({ page }) => {
  await openDetails(page);
  await expect(page.getByText(/Specifications:/i)).toBeVisible();
});
test("TC_DETAILS_F_14 - Navigation link Browse visible in header", async ({
  page,
}) => {
  await openDetails(page);
  await expect(page.getByRole("link", { name: "Browse" })).toBeVisible();
});
test("TC_DETAILS_F_15 - Navigation link Cart/Wishlist visible in header", async ({
  page,
}) => {
  await openDetails(page);
  await expect(page.getByRole("link", { name: "Cart/Wishlist" })).toBeVisible();
});

test("TC_DETAILS_NF_01 - Mobile responsiveness", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await context.newPage();
  await openDetails(page);
  await expect(page.getByRole("button", { name: "Add to Cart" })).toBeVisible();
  await context.close();
});
test("TC_DETAILS_NF_02 - Tablet responsiveness", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
  const page = await context.newPage();
  await openDetails(page);
  await expect(
    page.getByRole("button", { name: "Add to Wishlist" }),
  ).toBeVisible();
  await context.close();
});
test("TC_DETAILS_NF_03 - Basic load performance", async ({ page }) => {
  const start = Date.now();
  await page.goto("/bikes/1", { waitUntil: "domcontentloaded" });
  expect(Date.now() - start).toBeLessThan(4000);
});
