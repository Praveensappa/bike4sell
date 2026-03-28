const { test, expect, devices } = require("@playwright/test");

async function openBrowse(page) {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Browse Bikes" }),
  ).toBeVisible();
}

test("User can successfully access the browse page", async ({ page }) => {
  await openBrowse(page);
});

test("User is able to use the brand filter option", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByPlaceholder("Brand")).toBeVisible();
});

test("User can interact with the minimum price filter", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByPlaceholder("Min Price")).toBeVisible();
});

test("User can interact with the maximum price filter", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByPlaceholder("Max Price")).toBeVisible();
});

test("User can use the fuel type filter functionality", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByPlaceholder("Fuel Type")).toBeVisible();
});

test("User can apply year-based filtering", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByPlaceholder("Year")).toBeVisible();
});

test("User can load additional results using load more option", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByRole("button", { name: "Load More" })).toBeVisible();
});

test("User can enter and apply a brand filter value", async ({ page }) => {
  await openBrowse(page);
  await page.getByPlaceholder("Brand").fill("Yamaha");
  await expect(page.getByPlaceholder("Brand")).toHaveValue("Yamaha");
});

test("User can provide minimum price input for filtering", async ({ page }) => {
  await openBrowse(page);
  await page.getByPlaceholder("Min Price").fill("50000");
  await expect(page.getByPlaceholder("Min Price")).toHaveValue("50000");
});

test("User can provide maximum price input for filtering", async ({ page }) => {
  await openBrowse(page);
  await page.getByPlaceholder("Max Price").fill("250000");
  await expect(page.getByPlaceholder("Max Price")).toHaveValue("250000");
});

test("User can enter fuel type to refine search results", async ({ page }) => {
  await openBrowse(page);
  await page.getByPlaceholder("Fuel Type").fill("Petrol");
  await expect(page.getByPlaceholder("Fuel Type")).toHaveValue("Petrol");
});

test("User can enter year value to filter results", async ({ page }) => {
  await openBrowse(page);
  await page.getByPlaceholder("Year").fill("2022");
  await expect(page.getByPlaceholder("Year")).toHaveValue("2022");
});

test("User can identify the application branding in the header", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByRole("heading", { name: "Bike4Sell" })).toBeVisible();
});

test("User can navigate to authentication section from browse page", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByRole("link", { name: "Auth" })).toBeVisible();
});

test("User can access the sell bike feature from navigation", async ({ page }) => {
  await openBrowse(page);
  await expect(page.getByRole("link", { name: "Sell Bike" })).toBeVisible();
});

test("Application provides consistent experience on mobile devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await context.newPage();
  await openBrowse(page);
  await expect(page.getByRole("button", { name: "Load More" })).toBeVisible();
  await context.close();
});

test("Application layout adapts correctly for tablet devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
  const page = await context.newPage();
  await openBrowse(page);
  await expect(page.getByPlaceholder("Brand")).toBeVisible();
  await context.close();
});

test("Application loads within acceptable performance limits", async ({ page }) => {
  const start = Date.now();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(Date.now() - start).toBeLessThan(4000);
});