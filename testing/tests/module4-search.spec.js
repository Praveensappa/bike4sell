const { test, expect, devices } = require("@playwright/test");

async function openSearch(page) {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Browse Bikes" }),
  ).toBeVisible();
}

test("TC_SEARCH_F_01 - Search page opens", async ({ page }) => {
  await openSearch(page);
});
test("TC_SEARCH_F_02 - Brand input available", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByPlaceholder("Brand")).toBeVisible();
});
test("TC_SEARCH_F_03 - Min price input available", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByPlaceholder("Min Price")).toBeVisible();
});
test("TC_SEARCH_F_04 - Max price input available", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByPlaceholder("Max Price")).toBeVisible();
});
test("TC_SEARCH_F_05 - Fuel input available", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByPlaceholder("Fuel Type")).toBeVisible();
});
test("TC_SEARCH_F_06 - Year input available", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByPlaceholder("Year")).toBeVisible();
});
test("TC_SEARCH_F_07 - Brand value set", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Brand").fill("Honda");
  await expect(page.getByPlaceholder("Brand")).toHaveValue("Honda");
});
test("TC_SEARCH_F_08 - Min price value set", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Min Price").fill("10000");
  await expect(page.getByPlaceholder("Min Price")).toHaveValue("10000");
});
test("TC_SEARCH_F_09 - Max price value set", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Max Price").fill("300000");
  await expect(page.getByPlaceholder("Max Price")).toHaveValue("300000");
});
test("TC_SEARCH_F_10 - Fuel value set", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Fuel Type").fill("Petrol");
  await expect(page.getByPlaceholder("Fuel Type")).toHaveValue("Petrol");
});
test("TC_SEARCH_F_11 - Year value set", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Year").fill("2021");
  await expect(page.getByPlaceholder("Year")).toHaveValue("2021");
});
test("TC_SEARCH_F_12 - Multiple filters set together", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Brand").fill("Yamaha");
  await page.getByPlaceholder("Year").fill("2022");
  await expect(page.getByPlaceholder("Brand")).toHaveValue("Yamaha");
});
test("TC_SEARCH_F_13 - Load more present after filters", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Brand").fill("Yamaha");
  await expect(page.getByRole("button", { name: "Load More" })).toBeVisible();
});
test("TC_SEARCH_F_14 - Browse nav visible", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByRole("link", { name: "Browse" })).toBeVisible();
});
test("TC_SEARCH_F_15 - Orders nav visible", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();
});

test("TC_SEARCH_NF_01 - Mobile responsiveness", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await context.newPage();
  await openSearch(page);
  await expect(page.getByPlaceholder("Brand")).toBeVisible();
  await context.close();
});
test("TC_SEARCH_NF_02 - Tablet responsiveness", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
  const page = await context.newPage();
  await openSearch(page);
  await expect(page.getByPlaceholder("Min Price")).toBeVisible();
  await context.close();
});
test("TC_SEARCH_NF_03 - Basic load performance", async ({ page }) => {
  const start = Date.now();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(Date.now() - start).toBeLessThan(4000);
});
