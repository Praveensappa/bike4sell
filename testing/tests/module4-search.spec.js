const { test, expect, devices } = require("@playwright/test");

async function openSearch(page) {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Browse Bikes" }),
  ).toBeVisible();
}

test("User is able to open the search page successfully", async ({ page }) => {
  await openSearch(page);
});

test("Brand input field is visible on the search page", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByPlaceholder("Brand")).toBeVisible();
});

test("Minimum price input field is available for filtering", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByPlaceholder("Min Price")).toBeVisible();
});

test("Maximum price input field is available for filtering", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByPlaceholder("Max Price")).toBeVisible();
});

test("Fuel type input field is visible to the user", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByPlaceholder("Fuel Type")).toBeVisible();
});

test("Year input field is displayed correctly", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByPlaceholder("Year")).toBeVisible();
});

test("User can enter a brand value in the input field", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Brand").fill("Honda");
  await expect(page.getByPlaceholder("Brand")).toHaveValue("Honda");
});

test("User can enter a minimum price value", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Min Price").fill("10000");
  await expect(page.getByPlaceholder("Min Price")).toHaveValue("10000");
});

test("User can enter a maximum price value", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Max Price").fill("300000");
  await expect(page.getByPlaceholder("Max Price")).toHaveValue("300000");
});

test("User can enter a fuel type value", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Fuel Type").fill("Petrol");
  await expect(page.getByPlaceholder("Fuel Type")).toHaveValue("Petrol");
});

test("User can enter a year value", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Year").fill("2021");
  await expect(page.getByPlaceholder("Year")).toHaveValue("2021");
});

test("User can apply multiple filters together successfully", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Brand").fill("Yamaha");
  await page.getByPlaceholder("Year").fill("2022");
  await expect(page.getByPlaceholder("Brand")).toHaveValue("Yamaha");
});

test("Load more button appears after applying filters", async ({ page }) => {
  await openSearch(page);
  await page.getByPlaceholder("Brand").fill("Yamaha");
  await expect(page.getByRole("button", { name: "Load More" })).toBeVisible();
});

test("Browse navigation link is visible on the page", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByRole("link", { name: "Browse" })).toBeVisible();
});

test("Orders navigation link is visible on the page", async ({ page }) => {
  await openSearch(page);
  await expect(page.getByRole("link", { name: "Orders" })).toBeVisible();
});

test("Search page works properly on mobile devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await context.newPage();
  await openSearch(page);
  await expect(page.getByPlaceholder("Brand")).toBeVisible();
  await context.close();
});

test("Search page layout works correctly on tablet devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
  const page = await context.newPage();
  await openSearch(page);
  await expect(page.getByPlaceholder("Min Price")).toBeVisible();
  await context.close();
});

test("Search page loads within acceptable time", async ({ page }) => {
  const start = Date.now();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(Date.now() - start).toBeLessThan(4000);
});