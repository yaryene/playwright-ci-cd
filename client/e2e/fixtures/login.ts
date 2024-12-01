import { test as base } from "@playwright/test";
import type { Page, Locator } from "@playwright/test";
import {
  createModeratorResponse,
  gameListResponse,
  moderatorExistsResponse,
  moderatorNotExistsResponse,
} from "../mockResponses";
import { API_ROUTES } from "../support/constant";

export class Login {
  private readonly inputName: Locator;
  private readonly inputEmail: Locator;
  private readonly inputPassword: Locator;
  private readonly submitButton: Locator;

  constructor(public readonly page: Page) {
    this.inputName = this.page.locator('input[placeholder="Name"]');
    this.inputEmail = this.page.locator('input[placeholder="Email"]');
    this.inputPassword = this.page.locator('input[placeholder="Password"]');
    this.submitButton = this.page.locator("button");
  }

  async submitLoginForm() {
    await this.inputEmail.fill("john@example.com");
    await this.inputPassword.fill("password123");

    await this.page.route(API_ROUTES.LOGIN, async (route) => {
      route.fulfill({
        body: JSON.stringify({ token: "mockToken" }),
      });
    });

    await this.submitButton.click();
  }

  async submitCreateForm() {
    await this.inputName.fill("John Doe");
    await this.inputEmail.fill("john@example.com");
    await this.inputPassword.fill("password123");

    await this.page.route(API_ROUTES.CREATE_MODERATOR, async (route) => {
      await route.fulfill({ json: createModeratorResponse });
    });

    await this.submitButton.click();
  }

  // This function will work as login and create page based on the argument
  async gotoLoginPage(isCreatePage?: boolean) {
    await this.page.route(API_ROUTES.CHECK_MODERATOR, async (route) => {
      await route.fulfill({
        json: isCreatePage
          ? moderatorNotExistsResponse
          : moderatorExistsResponse,
      });
    });
    await this.page.goto("/login");
  }

  async gotoGamesPage() {
    await this.gotoLoginPage();
    await this.submitLoginForm();

    await this.page.route(API_ROUTES.GAME_LIST, async (route) => {
      await route.fulfill({ json: gameListResponse });
    });

    await this.page.goto("/games");
    await this.page.waitForLoadState("networkidle");
  }
}

export const loginTest = base.extend<{ login: Login }>({
  login: async ({ page }, use) => {
    const login = new Login(page);
    await use(login);
  },
});
