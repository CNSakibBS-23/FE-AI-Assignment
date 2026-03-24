import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "@/infrastructure/msw/handlers";

const server = setupServer(...handlers);

describe("search suggestions mock API", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "error" });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it("returns default email suggestions when query is empty", async () => {
    const response = await fetch("/api/search-suggestions?query=");
    const payload = (await response.json()) as {
      data: Array<{ id: string; email: string; name: string }>;
    };

    expect(response.ok).toBe(true);
    expect(payload.data).toHaveLength(6);
    expect(payload.data[0]).toEqual({
      id: "usr_1",
      email: "alice.johnson@example.com",
      name: "Alice Johnson",
    });
  });

  it("filters suggestions by query across name and email, case-insensitive", async () => {
    const response = await fetch("/api/search-suggestions?query=ALEx");
    const payload = (await response.json()) as {
      data: Array<{ id: string; email: string; name: string }>;
    };

    expect(response.ok).toBe(true);
    expect(payload.data).toEqual([
      {
        id: "usr_2",
        email: "alex.morgan@example.com",
        name: "Alex Morgan",
      },
    ]);
  });

  it("returns an empty list when no suggestions match the query", async () => {
    const response = await fetch("/api/search-suggestions?query=nomatch");
    const payload = (await response.json()) as {
      data: Array<{ id: string; email: string; name: string }>;
    };

    expect(response.ok).toBe(true);
    expect(payload.data).toEqual([]);
  });
});
