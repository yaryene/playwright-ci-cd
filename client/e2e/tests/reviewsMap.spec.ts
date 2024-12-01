import { expect, test } from "../fixtures";
import { mapDataResponse } from "../mockResponses";
import { API_ROUTES } from "../support/constant";

test.describe("Leaflet Map Test", () => {
  test.beforeEach(async ({ page, login }) => {
    await login.gotoLoginPage();
    await login.submitLoginForm();

    await page.route(API_ROUTES.GET_MAP_DATA, async (route) => {
      await route.fulfill({ json: mapDataResponse });
    });

    await page.goto("/map");
    await page.waitForLoadState("networkidle");
  });

  test("should render the leaflet map", async ({ page }) => {
    const mapContainer = await page.locator("#map-container");
    await expect(mapContainer).toBeVisible();
  });

  test("should render the map and display markers", async ({ page }) => {
    const markers = await page.locator(".leaflet-marker-icon");

    // Check if markers count is at least 1
    const count = await markers.count();
    expect(count).toBeGreaterThan(0); // Check if count is greater than 0

    // Ensure all markers are visible
    for (let i = 0; i < count; i++) {
      await expect(markers.nth(i)).toBeVisible();
    }
  });

  test("should open a popup when a marker is clicked", async ({ page }) => {
    const firstMarker = await page.locator(".leaflet-marker-icon").first();
    await firstMarker.click({ force: true });
    await expect(page.locator(".leaflet-popup")).toBeVisible();
  });
});
