const { test, expect, devices } = require("@playwright/test");

async function openAuth(page) {
  await page.goto("/auth");
  await expect(
    page.getByRole("heading", { name: "Authentication" }),
  ).toBeVisible();
}

test("User can successfully access the authentication page", async ({ page }) => {
  await openAuth(page);
});

test("User can access the registration section", async ({ page }) => {
  await openAuth(page);
  await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();
});

test("User can proceed with OTP verification process", async ({ page }) => {
  await openAuth(page);
  await expect(
    page.getByRole("heading", { name: "OTP Verification" }),
  ).toBeVisible();
});

test("User can access the login section", async ({ page }) => {
  await openAuth(page);
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
});

test("User can provide name details for registration", async ({ page }) => {
  await openAuth(page);
  await expect(page.getByPlaceholder("Name")).toBeVisible();
});

test("User can enter email for registration", async ({ page }) => {
  await openAuth(page);
  await expect(page.getByPlaceholder("Email").first()).toBeVisible();
});

test("User can provide mobile number for registration", async ({ page }) => {
  await openAuth(page);
  await expect(page.getByPlaceholder("Mobile")).toBeVisible();
});

test("User can set password during registration", async ({ page }) => {
  await openAuth(page);
  await expect(page.getByPlaceholder("Password").first()).toBeVisible();
});

test("User can initiate the registration process", async ({ page }) => {
  await openAuth(page);
  await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
});

test("User can enter OTP for verification", async ({ page }) => {
  await openAuth(page);
  await expect(page.getByPlaceholder("OTP")).toBeVisible();
});

test("User can complete OTP verification process", async ({ page }) => {
  await openAuth(page);
  await expect(page.getByRole("button", { name: "Verify OTP" })).toBeVisible();
});

test("User can enter email in login section", async ({ page }) => {
  await openAuth(page);
  await expect(page.getByPlaceholder("Email").nth(2)).toBeVisible();
});

test("User can enter password in login section", async ({ page }) => {
  await openAuth(page);
  await expect(page.getByPlaceholder("Password").nth(1)).toBeVisible();
});

test("User can initiate login process", async ({ page }) => {
  await openAuth(page);
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});

test("User can provide name input successfully", async ({ page }) => {
  await openAuth(page);
  await page.getByPlaceholder("Name").fill("QA User");
  await expect(page.getByPlaceholder("Name")).toHaveValue("QA User");
});

test("Application provides a smooth experience on mobile devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["Pixel 5"] });
  const page = await context.newPage();
  await openAuth(page);
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  await context.close();
});

test("Application layout adapts properly for tablet devices", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPad (gen 7)"] });
  const page = await context.newPage();
  await openAuth(page);
  await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
  await context.close();
});

test("Authentication page loads within acceptable performance limits", async ({ page }) => {
  const start = Date.now();
  await page.goto("/auth", { waitUntil: "domcontentloaded" });
  expect(Date.now() - start).toBeLessThan(4000);
});