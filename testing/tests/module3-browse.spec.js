const { test, expect, devices } = require("@playwright/test");

async function openBrowse(page) {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Browse Bikes" }),
  ).toBeVisible();
}

test("TC_BROWSE_F_01 - Browse page opens", async ({ page }) => {
  await openBrowse(page);
});
test("TC_BROWSE_F_02 - Brand filter visible", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByPlaceholder("Brand")).toBeVisible();
});
test("TC_BROWSE_F_03 - Min price filter visible", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByPlaceholder("Min Price")).toBeVisible();
});
test("TC_BROWSE_F_04 - Max price filter visible", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByPlaceholder("Max Price")).toBeVisible();
});
test("TC_BROWSE_F_05 - Fuel type filter visible", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByPlaceholder("Fuel Type")).toBeVisible();
});
test("TC_BROWSE_F_06 - Year filter visible", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByPlaceholder("Year")).toBeVisible();
});
test("TC_BROWSE_F_07 - Load more button visible", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByRole("button", { name: "Load More" })).toBeVisible();
});
test("TC_BROWSE_F_08 - User can type brand filter", async ({ page }) => {
  await openBrowse(page);
  await page.getByPlaceholder("Brand").fill("Yamaha");
  await expect(page.getByPlaceholder("Brand")).toHaveValue("Yamaha");
});
test("TC_BROWSE_F_09 - User can type min price", async ({ page }) => {
  await openBrowse(page);
  await page.getByPlaceholder("Min Price").fill("50000");
  await expect(page.getByPlaceholder("Min Price")).toHaveValue("50000");
});
test("TC_BROWSE_F_10 - User can type max price", async ({ page }) => {
  await openBrowse(page);
  await page.getByPlaceholder("Max Price").fill("250000");
  await expect(page.getByPlaceholder("Max Price")).toHaveValue("250000");
});
test("TC_BROWSE_F_11 - User can type fuel type", async ({ page }) => {
  await openBrowse(page);
  await page.getByPlaceholder("Fuel Type").fill("Petrol");
  await expect(page.getByPlaceholder("Fuel Type")).toHaveValue("Petrol");
});
test("TC_BROWSE_F_12 - User can type year", async ({ page }) => {
  await openBrowse(page);
  await page.getByPlaceholder("Year").fill("2022");
  await expect(page.getByPlaceholder("Year")).toHaveValue("2022");
});
test("TC_BROWSE_F_13 - Header brand visible", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByRole("heading", { name: "Bike4Sell" })).toBeVisible();
});
test("TC_BROWSE_F_14 - Auth nav visible", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByRole("link", { name: "Auth" })).toBeVisible();
});
test("TC_BROWSE_F_15 - Sell Bike nav visible", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByRole("link", { name: "Sell Bike" })).toBeVisible();
});

test("TC_BROWSE_NF_01 - Mobile responsiveness", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await context.newPage();
  await openBrowse(page);
  await expect(page.getByRole("button", { name: "Load More" })).toBeVisible();
  await context.close();
});
test("TC_BROWSE_NF_02 - Tablet responsiveness", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
  const page = await context.newPage();
  await openBrowse(page);
  await expect(page.getByPlaceholder("Brand")).toBeVisible();
  await context.close();
});
test("TC_BROWSE_NF_03 - Basic load performance", async ({ page }) => {
  const start = Date.now();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(Date.now() - start).toBeLessThan(4000);
});
