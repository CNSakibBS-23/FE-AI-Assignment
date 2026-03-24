import { useId, useMemo, useState } from "react";
import type { SearchSuggestion } from "@/features/search/data/getSearchSuggestions";
import { useSearchHistory } from "@/features/search/logic/useSearchHistory";
import { useSearchSuggestions } from "@/features/search/logic/useSearchSuggestions";

export type SearchExperienceViewModel = {
  query: string;
  selectedSuggestion: SearchSuggestion | null;
  history: readonly string[];
  isLoading: boolean;
  error: string | null;
  visibleSuggestions: SearchSuggestion[];
  suggestionSig: string;
  showNoResults: boolean;
  hasQuery: boolean;
  suggestionsListId: string;
  optionIdPrefix: string;
  handleQueryChange: (nextQuery: string) => void;
  handleSuggestionSelect: (suggestion: SearchSuggestion) => void;
  handleSearch: (trimmedQuery: string) => void;
  handleHistoryPick: (term: string) => void;
};

export function useSearchExperience(): SearchExperienceViewModel {
  const [query, setQuery] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<SearchSuggestion | null>(null);

  const { history, recordSearch } = useSearchHistory();
  const { suggestions, isLoading, error } = useSearchSuggestions(query);
  const suggestionsListId = useId();
  const optionIdPrefix = useId();

  const hasQuery = query.trim().length > 0;
  const visibleSuggestions = useMemo(
    () => (hasQuery ? suggestions : []),
    [hasQuery, suggestions],
  );

  const suggestionSig = useMemo(
    () => visibleSuggestions.map((s) => s.id).join("|"),
    [visibleSuggestions],
  );

  const showNoResults =
    hasQuery && !isLoading && !error && visibleSuggestions.length === 0;

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    setSelectedSuggestion(null);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.email);
    setSelectedSuggestion(suggestion);
  };

  const handleSearch = (trimmedQuery: string) => {
    setQuery(trimmedQuery);
    recordSearch(trimmedQuery);
  };

  const handleHistoryPick = (term: string) => {
    setQuery(term);
    setSelectedSuggestion(null);
    recordSearch(term);
  };

  return {
    query,
    selectedSuggestion,
    history,
    isLoading,
    error,
    visibleSuggestions,
    suggestionSig,
    showNoResults,
    hasQuery,
    suggestionsListId,
    optionIdPrefix,
    handleQueryChange,
    handleSuggestionSelect,
    handleSearch,
    handleHistoryPick,
  };
}
