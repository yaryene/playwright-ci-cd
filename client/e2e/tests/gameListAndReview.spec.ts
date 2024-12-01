import { expect, test } from "../fixtures";
import { gameListResponse } from "../mockResponses";
import { API_ROUTES } from "../support/constant";

test.describe("Game List", () => {
  test.beforeEach(async ({ page, login, game }) => {
    await login.gotoLoginPage();
    await login.submitLoginForm();
    await game.gotoGameList();
  });

  test("Should display game cards with images, titles, and review counts", async ({
    page,
  }) => {
    await expect(page.locator(".grid")).toBeVisible();

    const gameCards = page.locator(".grid .col-span-1");

    const firstGameCard = gameCards.first();
    await expect(firstGameCard.locator("img")).toHaveAttribute(
      "src",
      /thumbnail\.jpg/
    );
    await expect(firstGameCard.locator("img")).toHaveAttribute(
      "alt",
      /Game Image/
    );

    await expect(firstGameCard.locator("p.text-lg")).toBeVisible();
    await expect(firstGameCard.locator("p.text-lg")).not.toBeEmpty();

    await expect(firstGameCard.locator("p.text-sm")).toBeVisible();
    await expect(firstGameCard.locator("p.text-sm")).not.toBeEmpty();

    await expect(firstGameCard.locator("p.text-xs")).toContainText("Reviews");
  });

  test("Should check hover effect on game cards", async ({ page }) => {
    const firstGameCard = page.locator(".grid .col-span-1 div").first();
    await firstGameCard.hover();
    await expect(firstGameCard).toHaveClass(/hover:-translate-y-1/);
  });
});

test.describe("Game Review", () => {
  const currentGame = gameListResponse.data[0];
  const mockLatLong = { latitude: 37.7749, longitude: -122.4194 };

  test.beforeEach(async ({ page, context, login, game }) => {
    await login.gotoLoginPage();
    await login.submitLoginForm();
    await game.gotoGameList();

    await page.route(game.gameReviewUrl(currentGame._id), async (route) => {
      await route.fulfill({ json: { data: currentGame } });
    });

    // Set geolocation permission and mock coordinates
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation(mockLatLong); // Set geolocation on context, not page

    await page.locator(".grid .col-span-1 div").first().click();
  });

  test("Game Review: should render game review page and details", async ({
    page,
  }) => {
    await expect(page).toHaveURL(/\/review\/[a-zA-Z0-9]+/);

    // Verify the game title
    const gameTitle = page.locator("p.chakra-text.text-protest.text-3xl");
    await expect(gameTitle).toHaveText(currentGame.gameName);

    // Verify the description
    const gameDescription = page.locator("p.chakra-text.text-black").first();
    await expect(gameDescription).toHaveText(currentGame.gameDescription);

    // Verify the review stars
    const svgContainer = page.locator("div.text-black").first();
    const svgCount = await svgContainer.locator("svg").count();
    expect(svgCount).toBe(currentGame.avgRating);

    // Verify the total rating score
    const totalRating = page.locator("div.text-black .chakra-text").first();
    await expect(totalRating).toHaveText(currentGame.avgRating.toFixed(2));

    // Verify the total reviews
    const totalReviews = page.locator("div.text-black .chakra-text").last();
    await expect(totalReviews).toHaveText(
      `${currentGame?.reviewCount} Reviews`
    );
  });

  test("Game Review: should submit a review", async ({ page, game }) => {
    const mockUserReview = {
      text: "Nice game. Loved it.",
      rating: 4,
      username: "John Doe",
      email: "john@example.com",
      _id: "test123",
      ...mockLatLong,
    };

    await page.fill('input[placeholder="Email"]', mockUserReview.email);
    await page.fill('input[placeholder="Name"]', mockUserReview.username);
    await page.fill(
      'textarea[placeholder="Here is a sample placeholder"]',
      mockUserReview.text
    );

    await page.locator('fieldset.rating label[for="star4"]').click();
    const addReviewUrl = API_ROUTES.ADD_GAME_REVIEW + "/" + currentGame._id;
    await page.route(addReviewUrl, async (route) => {
      await route.fulfill({
        json: { data: mockUserReview, message: "Data created successfully" },
      });
    });

    // Adding the new review into the old review list
    await page.route(game.gameReviewUrl(currentGame._id), async (route) => {
      await route.fulfill({
        json: {
          data: {
            ...currentGame,
            reviews: [...currentGame.reviews, mockUserReview],
          },
        },
      });
    });

    await page.click("#submit-review-button");

    await expect(page.locator("text=Thank you for your review!")).toBeVisible();
    await expect(page.locator(`text=${mockUserReview.username}`)).toBeVisible();
    await expect(page.locator(`text=${mockUserReview.text}`)).toBeVisible();
  });
});
