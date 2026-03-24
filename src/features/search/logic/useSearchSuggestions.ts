import { useEffect, useReducer } from "react";
import {
  getSearchSuggestions,
  type SearchSuggestion,
} from "@/features/search/data/getSearchSuggestions";

/** Default debounce delay before calling the search suggestions API. */
export const SEARCH_SUGGESTIONS_DEBOUNCE_MS = 300;

type UseSearchSuggestionsOptions = {
  debounceMs?: number;
};

type UseSearchSuggestionsResult = {
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  error: string | null;
};

type SuggestionsState = {
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  error: string | null;
};

type SuggestionsAction =
  | { type: "emptyQuery" }
  | { type: "startFetch" }
  | { type: "fetchSuccess"; suggestions: SearchSuggestion[] }
  | { type: "fetchError"; message: string };

function suggestionsReducer(
  state: SuggestionsState,
  action: SuggestionsAction,
): SuggestionsState {
  switch (action.type) {
    case "emptyQuery":
      return { suggestions: [], isLoading: false, error: null };
    case "startFetch":
      return { ...state, isLoading: true, error: null };
    case "fetchSuccess":
      return {
        suggestions: action.suggestions,
        isLoading: false,
        error: null,
      };
    case "fetchError":
      return {
        suggestions: [],
        isLoading: false,
        error: action.message,
      };
    default:
      return state;
  }
}

const initialState: SuggestionsState = {
  suggestions: [],
  isLoading: false,
  error: null,
};

export function useSearchSuggestions(
  query: string,
  options: UseSearchSuggestionsOptions = {},
): UseSearchSuggestionsResult {
  const { debounceMs = SEARCH_SUGGESTIONS_DEBOUNCE_MS } = options;
  const [state, dispatch] = useReducer(suggestionsReducer, initialState);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      dispatch({ type: "emptyQuery" });
      return;
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: "startFetch" });

      void getSearchSuggestions(normalizedQuery).then(
        (suggestions) => {
          if (!cancelled) {
            dispatch({ type: "fetchSuccess", suggestions });
          }
        },
        (err: unknown) => {
          if (!cancelled) {
            const message =
              err instanceof Error ? err.message : "Failed to load suggestions";
            dispatch({ type: "fetchError", message });
          }
        },
      );
    }, debounceMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [query, debounceMs]);

  return {
    suggestions: state.suggestions,
    isLoading: state.isLoading,
    error: state.error,
  };
}
