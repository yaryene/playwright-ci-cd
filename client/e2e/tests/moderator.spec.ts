import { expect, test } from "../fixtures";

test.describe("Moderator Admin Panel", () => {
  test.beforeEach(async ({ login }) => {
    await login.gotoLoginPage();
    await login.submitLoginForm();
  });

  test("Check admin login successfully", async ({ page }) => {
    await expect(page.locator("text=Login successfully")).toBeVisible();
  });

  test("Check all the menu accessible", async ({ page }) => {
    // Check admin URL
    await expect(page).toHaveURL("/admin");

    // Navigate to different menus
    await page.click("#home-card");
    await expect(page).toHaveURL("/");

    await page.goBack();
    await expect(page).toHaveURL("/admin");

    await page.click("#game-list-card");
    await expect(page).toHaveURL("/games");

    await page.goBack();
    await expect(page).toHaveURL("/admin");

    await page.click("#review-in-map");
    await expect(page).toHaveURL("/map");

    await page.goBack();
    await expect(page).toHaveURL("/admin");
  });

  test("Check logout functionality", async ({ page }) => {
    // Ensure URL is admin
    await expect(page).toHaveURL("/admin");

    // Perform logout
    await page.click("#logout-button");
    await expect(page.locator("text=Logout successful")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });
});

test("Check all the protected menu not accessible when logged out", async ({
  page,
}) => {
  // Try to access admin page directly
  await page.goto("/admin", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL("/login");

  // Try to access map page directly
  await page.goto("/map", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL("/login");

  // Try to access games page directly
  await page.goto("/games", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL("/login");
});
