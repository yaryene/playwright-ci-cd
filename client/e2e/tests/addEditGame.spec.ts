import { expect, test } from "../fixtures";
import { gameListResponse } from "../mockResponses";
import { API_ROUTES } from "../support/constant";

test.describe("Games: Add, Edit from Admin panel", () => {
  const currentGame = gameListResponse.data[0];

  test.beforeEach(async ({ page, login }) => {
    await login.gotoGamesPage();
  });

  test("Add Games validations check", async ({ page, game }) => {
    await page.click("#add-game-button");
    await page.click("#save-button-add-game");

    await game.gameFormValidation();

    await page.click("#cancel-button-add-game");
  });

  test("Edit games validations check", async ({ page, game }) => {
    const editButton = page.locator('[data-button="edit-game"]').first();
    await editButton.click();

    await game.fillGameForm({
      gameName: "",
      gameDescription: "",
      gameImage: "",
    });

    await page.click("#save-button-add-game");

    await game.gameFormValidation();

    await page.click("#cancel-button-add-game");
  });

  test("Check add new games", async ({ page, game }) => {
    await page.click("#add-game-button");

    await game.fillGameForm({
      gameName: "Lost Ark 2",
      gameDescription:
        "Free-to-play multiplayer massive adventure filled with lands waiting to be explored",
      gameImage: "https://www.freetogame.com/g/517/thumbnail.jpg",
    });

    await page.route(API_ROUTES.CREATE_NEW_GAME, async (route) => {
      await route.fulfill({
        json: { data: {}, message: "Data created successfully" },
      });
    });
    await page.click("#save-button-add-game");

    await expect(page.locator("text=Game created successfully")).toBeVisible();
  });

  test("Check edit games", async ({ page, game }) => {
    const editButton = page.locator('[data-button="edit-game"]').first();
    await editButton.click();

    await game.fillGameForm({
      gameName: "Lost Ark 2 Edited",
      gameDescription:
        "Edited Free-to-play multiplayer massive adventure filled with lands waiting to be explored",
      gameImage: "https://www.freetogame.com/g/517/thumbnail.jpg",
    });

    const updateApiURL = API_ROUTES.UPDATE_GAME + "/" + currentGame._id;
    await page.route(updateApiURL, async (route) => {
      await route.fulfill({
        json: { data: {}, message: "Update successfully" },
      });
    });
    await page.click("#save-button-add-game");

    await expect(page.locator("text=Game update successfully")).toBeVisible();
  });

  test("Check delete game", async ({ page }) => {
    const deleteButton = page.locator('[data-button="delete-game"]').first();

    const deleteApiURL = API_ROUTES.DELETE_GAME + "/" + currentGame._id;
    await page.route(deleteApiURL, async (route) => {
      await route.fulfill({
        json: { message: "Review deleted" },
      });
    });
    await deleteButton.click();

    await expect(page.locator("text=Game deleted successfully")).toBeVisible();
  });
});
