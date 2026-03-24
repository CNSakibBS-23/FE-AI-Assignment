/** Maximum number of recent search strings to retain. */
export const SEARCH_HISTORY_MAX = 5;

export const SEARCH_HISTORY_STORAGE_KEY = "searchHistory";

/**
 * Merges a new query into the history: trims, skips empty, de-duplicates (case-sensitive),
 * most recent first, capped at {@link SEARCH_HISTORY_MAX}.
 */
export function appendSearchHistory(
  current: readonly string[],
  rawQuery: string,
): string[] {
  const query = rawQuery.trim();
  if (!query) {
    return [...current];
  }

  const withoutDuplicate = current.filter((item) => item !== query);
  const next = [query, ...withoutDuplicate];
  return next.slice(0, SEARCH_HISTORY_MAX);
}

export function parseSearchHistoryJson(json: string | null): string[] {
  if (json == null || json === "") {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  } catch {
    return [];
  }
}

export function serializeSearchHistory(history: readonly string[]): string {
  return JSON.stringify([...history]);
}

export type SearchHistoryStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

export function getSearchHistory(
  storage: SearchHistoryStorage,
  key: string,
): string[] {
  return parseSearchHistoryJson(storage.getItem(key));
}

/**
 * Persists the updated history after appending `rawQuery`. Returns the new list.
 */
export function saveSearchQuery(
  storage: SearchHistoryStorage,
  key: string,
  rawQuery: string,
): string[] {
  const previous = getSearchHistory(storage, key);
  const next = appendSearchHistory(previous, rawQuery);
  storage.setItem(key, serializeSearchHistory(next));
  return next;
}
