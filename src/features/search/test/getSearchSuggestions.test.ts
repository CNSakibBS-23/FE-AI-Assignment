import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getSearchSuggestions,
  type SearchSuggestion,
} from "@/features/search/data/getSearchSuggestions";

describe("getSearchSuggestions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns suggestions for a valid query", async () => {
    const mockData: SearchSuggestion[] = [
      {
        id: "usr_2",
        email: "alex.morgan@example.com",
        name: "Alex Morgan",
      },
    ];

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: mockData }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await getSearchSuggestions("alex");

    expect(fetchSpy).toHaveBeenCalledWith("/api/search-suggestions?query=alex");
    expect(result).toEqual(mockData);
  });

  it("returns an empty list and skips API call for empty query", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const result = await getSearchSuggestions("   ");

    expect(result).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("throws a normalized error when request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network down"));

    await expect(getSearchSuggestions("alex")).rejects.toThrow(
      "Failed to fetch search suggestions",
    );
  });
});
