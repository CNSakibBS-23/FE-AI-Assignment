import { useCallback, useState } from "react";
import {
  getSearchHistory,
  saveSearchQuery,
  SEARCH_HISTORY_STORAGE_KEY,
} from "@/features/search/data/searchHistory";
import { getLocalSearchHistoryStorage } from "@/infrastructure/storage/localSearchHistoryStorage";

function readHistoryFromStorage(): string[] {
  const storage = getLocalSearchHistoryStorage();
  if (!storage) {
    return [];
  }
  return getSearchHistory(storage, SEARCH_HISTORY_STORAGE_KEY);
}

/**
 * Loads persisted search history from `localStorage` and exposes `recordSearch`
 * to append a trimmed query (submit / explicit search).
 */
export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(readHistoryFromStorage);

  const recordSearch = useCallback((rawQuery: string) => {
    const storage = getLocalSearchHistoryStorage();
    if (!storage) {
      return;
    }
    try {
      setHistory(saveSearchQuery(storage, SEARCH_HISTORY_STORAGE_KEY, rawQuery));
    } catch {
      // Quota or access errors: keep in-memory list unchanged
    }
  }, []);

  return { history, recordSearch };
}
