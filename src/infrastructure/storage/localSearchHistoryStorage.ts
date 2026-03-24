import type { SearchHistoryStorage } from "@/features/search/data/searchHistory";

/**
 * Returns `localStorage` when available and accessible (browser, jsdom).
 * Returns `null` when storage is missing or throws (e.g. disabled / quota).
 */
export function getLocalSearchHistoryStorage(): SearchHistoryStorage | null {
  try {
    if (typeof globalThis.localStorage === "undefined") {
      return null;
    }
    return globalThis.localStorage;
  } catch {
    return null;
  }
}
