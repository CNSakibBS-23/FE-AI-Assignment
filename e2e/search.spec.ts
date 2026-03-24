import { expect, test } from "@playwright/test";

const SEARCH_LABEL = "Search emails";

test.describe("Email search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("typing shows suggestions after debounce", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: SEARCH_LABEL });

    await searchInput.fill("alex");

    const listbox = page.getByRole("listbox", { name: "Email suggestions" });
    await expect(listbox).toBeVisible();

    await expect(
      page.getByRole("option", { name: /Alex Morgan/i }),
    ).toBeVisible();
  });

  test("selecting a suggestion updates the selection UI", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: SEARCH_LABEL });
    await searchInput.fill("alex");

    const alexOption = page.getByRole("option", { name: /Alex Morgan/i });
    await expect(alexOption).toBeVisible();
    await alexOption.click();

    const selection = page.locator(".search-experience__selection");
    await expect(selection).toBeVisible();
    await expect(selection.getByText("Contact selected")).toBeVisible();
    await expect(selection.getByText("Alex Morgan")).toBeVisible();
    await expect(selection.getByText("alex.morgan@example.com")).toBeVisible();
  });

  test("search history survives a full page reload", async ({ page }) => {
    const uniqueQuery = `e2e-history-${Date.now()}`;

    await test.step("Submit a search to record history", async () => {
      await page.getByRole("searchbox", { name: SEARCH_LABEL }).fill(uniqueQuery);
      await page.getByRole("button", { name: "Search" }).click();
      await expect(page.getByText("Recent searches")).toBeVisible();
      await expect(
        page.getByRole("button", { name: uniqueQuery, exact: true }),
      ).toBeVisible();
    });

    await test.step("Reload and expect the same term in recent searches", async () => {
      await page.reload();
      await expect(page.getByText("Recent searches")).toBeVisible();
      await expect(
        page.getByRole("button", { name: uniqueQuery, exact: true }),
      ).toBeVisible();
    });
  });
});
