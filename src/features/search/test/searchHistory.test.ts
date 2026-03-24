import { describe, expect, it } from "vitest";
import {
  appendSearchHistory,
  getSearchHistory,
  parseSearchHistoryJson,
  saveSearchQuery,
  SEARCH_HISTORY_MAX,
  SEARCH_HISTORY_STORAGE_KEY,
  serializeSearchHistory,
} from "@/features/search/data/searchHistory";

function createMemoryStorage(
  initial: Record<string, string> = {},
): {
  storage: { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void };
  snapshot: () => Record<string, string>;
} {
  const store = { ...initial };
  return {
    storage: {
      getItem(key: string) {
        return store[key] ?? null;
      },
      setItem(key: string, value: string) {
        store[key] = value;
      },
    },
    snapshot: () => ({ ...store }),
  };
}

describe("appendSearchHistory", () => {
  it("keeps at most the last five distinct searches (most recent first)", () => {
    const history = ["a", "b", "c", "d", "e"].reduce(
      (acc, q) => appendSearchHistory(acc, q),
      [] as string[],
    );

    expect(history).toEqual(["e", "d", "c", "b", "a"]);
    expect(history).toHaveLength(SEARCH_HISTORY_MAX);

    const afterSixth = appendSearchHistory(history, "new");
    expect(afterSixth).toHaveLength(SEARCH_HISTORY_MAX);
    expect(afterSixth[0]).toBe("new");
    expect(afterSixth).toEqual(["new", "e", "d", "c", "b"]);
  });

  it("does not add duplicate entries; repeats move the term to the front", () => {
    const once = appendSearchHistory([], "alpha");
    expect(once).toEqual(["alpha"]);

    const twice = appendSearchHistory(once, "beta");
    expect(twice).toEqual(["beta", "alpha"]);

    const dupBeta = appendSearchHistory(twice, "beta");
    expect(dupBeta).toEqual(["beta", "alpha"]);
    expect(new Set(dupBeta).size).toBe(dupBeta.length);
  });

  it("ignores whitespace-only queries", () => {
    expect(appendSearchHistory(["a"], "   ")).toEqual(["a"]);
  });
});

describe("getSearchHistory / saveSearchQuery", () => {
  it("retrieves history previously saved to storage", () => {
    const { storage, snapshot } = createMemoryStorage();

    saveSearchQuery(storage, SEARCH_HISTORY_STORAGE_KEY, "first");
    saveSearchQuery(storage, SEARCH_HISTORY_STORAGE_KEY, "second");

    expect(getSearchHistory(storage, SEARCH_HISTORY_STORAGE_KEY)).toEqual([
      "second",
      "first",
    ]);
    expect(snapshot()[SEARCH_HISTORY_STORAGE_KEY]).toBe(
      serializeSearchHistory(["second", "first"]),
    );
  });

  it("returns empty history when storage is empty or invalid JSON", () => {
    const { storage } = createMemoryStorage({
      [SEARCH_HISTORY_STORAGE_KEY]: "not-json",
    });
    expect(getSearchHistory(storage, SEARCH_HISTORY_STORAGE_KEY)).toEqual([]);
  });
});

describe("parseSearchHistoryJson", () => {
  it("parses a valid JSON array of strings", () => {
    expect(parseSearchHistoryJson('["x", "y"]')).toEqual(["x", "y"]);
  });

  it("returns [] for null, empty, non-array, or invalid JSON", () => {
    expect(parseSearchHistoryJson(null)).toEqual([]);
    expect(parseSearchHistoryJson("")).toEqual([]);
    expect(parseSearchHistoryJson("{}")).toEqual([]);
    expect(parseSearchHistoryJson("[")).toEqual([]);
  });
});
