import { expect, test, type Page } from "@playwright/test";

const SEARCH_LABEL = "Search emails";

async function waitForInboxLoaded(page: Page) {
  await expect(page.getByRole("heading", { name: "Messages" })).toBeVisible();
}

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

test.describe("Email inbox", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForInboxLoaded(page);
  });

  test("search filters the message list", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: SEARCH_LABEL });

    await expect(page.getByText("Quarterly planning")).toBeVisible();
    await expect(page.getByText("Invoice #1042")).toBeVisible();

    await searchInput.fill("Invoice");
    await expect(page.getByText("Invoice #1042")).toBeVisible();
    await expect(page.getByText("Quarterly planning")).not.toBeVisible();

    await searchInput.fill("Welcome");
    await expect(page.getByText("Welcome to the team")).toBeVisible();
    await expect(page.getByText("Invoice #1042")).not.toBeVisible();
  });

  test("shows empty state when no messages match the filter", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: SEARCH_LABEL });
    await searchInput.fill("no-inbox-matches-this-fragment-xyz");

    const empty = page.locator(".email-list--empty");
    await expect(empty).toBeVisible();
    await expect(empty).toContainText("No messages match this search");
  });

  test("flag control toggles on the selected row", async ({ page }) => {
    const searchInput = page.getByRole("searchbox", { name: SEARCH_LABEL });
    await searchInput.fill("Quarterly");

    const flag = page.getByRole("button", { name: "Flag email" });
    await expect(flag).toBeVisible();
    await flag.click();

    const unflag = page.getByRole("button", { name: "Remove flag from email" });
    await expect(unflag).toBeVisible();
    await expect(unflag).toHaveAttribute("aria-pressed", "true");

    await unflag.click();
    await expect(page.getByRole("button", { name: "Flag email" })).toBeVisible();
  });
});
