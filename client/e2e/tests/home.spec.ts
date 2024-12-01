import { expect, test } from "../fixtures";

test("Home page: Rendered successfully and show hero text", async ({
  page,
  game,
}) => {
  await game.gotoGameList({ data: [] });
  await expect(
    page.locator("text=Find your next captivating gaming moment")
  ).toBeVisible();
});

test("Game List: No games found", async ({ page, game }) => {
  await game.gotoGameList({ data: [] });
  await expect(page.locator("text=No game listed")).toBeVisible();
  await expect(page.locator("text=Only Moderator can list game")).toBeVisible();
});

test("Game List: Check game count greater than one", async ({ page, game }) => {
  await game.gotoGameList();

  const gameCards = page.locator(".grid .col-span-1");
  const cardCount = await gameCards.count(); // Get the number of game cards

  expect(cardCount).toBeGreaterThan(1);
});
