import type { Page } from "@playwright/test";
import { test as base, expect } from "@playwright/test";
import { gameListResponse } from "../mockResponses";
import { API_ROUTES } from "../support/constant";

type GameForm = {
  gameName: string;
  gameDescription: string;
  gameImage: string;
};

export class Game {
  constructor(public readonly page: Page) {}

  async gotoGameList(list?: typeof gameListResponse) {
    await this.page.route(API_ROUTES.GAME_LIST, async (route) => {
      await route.fulfill({ json: list || gameListResponse });
    });

    await this.page.goto("/");
  }

  async gameFormValidation() {
    await expect(
      this.page.locator("text=Game Name must be provided")
    ).toBeVisible();
    await expect(
      this.page.locator("text=Game Image must be a valid URL")
    ).toBeVisible();
    await expect(
      this.page.locator("text=Description must be provided")
    ).toBeVisible();
  }

  async fillGameForm({ gameName, gameDescription, gameImage }: GameForm) {
    const nameInput = this.page.locator('input[placeholder="Game Name"]');
    const descriptionInput = this.page.locator(
      'textarea[placeholder="Game description..."]'
    );
    const imageInput = this.page.locator(
      'input[placeholder="Game Image (URL Only)"]'
    );

    await nameInput.fill(gameName);
    await descriptionInput.fill(gameDescription);
    await imageInput.fill(gameImage);
  }

  gameReviewUrl(id: string) {
    return `${API_ROUTES.GAME_DETAILS + "/" + id}`;
  }
}

export const gameTest = base.extend<{ game: Game }>({
  game: async ({ page }, use) => {
    const game = new Game(page);
    await use(game);
  },
});
