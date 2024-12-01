import { expect, test } from "../fixtures";

test.describe("Create Moderator", () => {
  test.beforeEach(async ({ login }) => {
    await login.gotoLoginPage(true);
  });

  test("create moderator page rendered successfully", async ({ page }) => {
    await expect(page.locator('role=button[name="Create"]')).toBeVisible();
  });

  test("create moderator validations", async ({ page }) => {
    await page.click("button");
    await expect(page.locator("text=Invalid email address")).toBeVisible();
    await expect(
      page.locator("text=Password must be at least 6 characters")
    ).toBeVisible();
    await expect(page.locator("text=Name is required")).toBeVisible();
  });

  test("should toggle the password visibility", async ({ page }) => {
    await page.fill('input[placeholder="Password"]', "password123");
    await page.click("#toggle-password");
    await expect(page.locator('input[placeholder="Password"]')).toHaveAttribute(
      "type",
      "text"
    );
    await expect(page.locator('input[placeholder="Password"]')).toHaveValue(
      "password123"
    );
    await page.click("#toggle-password");
    await expect(page.locator('input[placeholder="Password"]')).toHaveAttribute(
      "type",
      "password"
    );
  });

  test("should create an account for new users", async ({ page, login }) => {
    await expect(page.locator("text=Create Account")).toBeVisible();

    await login.submitCreateForm();

    await expect(
      page.locator("text=Moderator created! Please login!")
    ).toBeVisible();
  });
});

test.describe("Login Moderator", () => {
  test.beforeEach(async ({ login }) => {
    await login.gotoLoginPage();
  });

  test("login page rendered successfully", async ({ page }) => {
    await expect(page.locator('role=button[name="Login"]')).toBeVisible();
  });

  test("login validations", async ({ page }) => {
    await page.click("button");
    await expect(page.locator("text=Invalid email address")).toBeVisible();
    await expect(
      page.locator("text=Password must be at least 6 characters")
    ).toBeVisible();
  });

  test("should login an existing user", async ({ page, login }) => {
    await login.submitLoginForm();

    await expect(page.locator("text=Login successfully")).toBeVisible();
    await expect(page).toHaveURL("/admin");
  });
});
