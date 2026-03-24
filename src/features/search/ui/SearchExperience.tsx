import { useId, useMemo, useState, type KeyboardEvent } from "react";
import type { SearchSuggestion } from "@/features/search/data/getSearchSuggestions";
import { useSearchHistory } from "@/features/search/logic/useSearchHistory";
import { useSearchSuggestions } from "@/features/search/logic/useSearchSuggestions";
import { SearchBar } from "@/features/search/ui/SearchBar";
import { Suggestions } from "@/features/search/ui/Suggestions";

type SearchBarWithSuggestionsProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  label: string;
  placeholder: string;
  suggestionsListId: string;
  optionIdPrefix: string;
  visibleSuggestions: SearchSuggestion[];
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
};

/**
 * Owns highlight index for the list + input keyboard handling. Remount when
 * `key` (suggestion list identity) changes so the highlight resets without an effect.
 */
function SearchBarWithSuggestions({
  query,
  onQueryChange,
  onSearch,
  label,
  placeholder,
  suggestionsListId,
  optionIdPrefix,
  visibleSuggestions,
  onSuggestionSelect,
}: SearchBarWithSuggestionsProps) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const suggestionsOpen = visibleSuggestions.length > 0;

  const safeHighlightedIndex =
    visibleSuggestions.length === 0
      ? 0
      : Math.max(0, Math.min(highlightedIndex, visibleSuggestions.length - 1));

  const activeDescendantId =
    suggestionsOpen && visibleSuggestions[safeHighlightedIndex]
      ? `${optionIdPrefix}-opt-${visibleSuggestions[safeHighlightedIndex].id}`
      : undefined;

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestionsOpen || visibleSuggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((i) =>
        Math.min(i + 1, visibleSuggestions.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const idx = Math.max(
        0,
        Math.min(highlightedIndex, visibleSuggestions.length - 1),
      );
      const pick = visibleSuggestions[idx];
      if (pick) {
        onSuggestionSelect(pick);
      }
    }
  };

  return (
    <>
      <SearchBar
        query={query}
        onQueryChange={onQueryChange}
        onSearch={onSearch}
        label={label}
        placeholder={placeholder}
        suggestionsListboxId={suggestionsListId}
        suggestionsOpen={suggestionsOpen}
        ariaActiveDescendant={activeDescendantId}
        onInputKeyDown={handleInputKeyDown}
      />

      <Suggestions
        id={suggestionsListId}
        optionIdPrefix={optionIdPrefix}
        suggestions={visibleSuggestions}
        highlightedIndex={safeHighlightedIndex}
        onHighlightChange={setHighlightedIndex}
        onSelect={onSuggestionSelect}
        ariaLabel="Email suggestions"
      />
    </>
  );
}

export function SearchExperience() {
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

  return (
    <section className="search-experience" aria-label="Email search">
      <p className="search-experience__hint">
        Start typing a name or email — suggestions appear after a short pause. Use
        keyboard or click to choose a contact.
      </p>

      {history.length > 0 ? (
        <div className="search-experience__history">
          <p className="search-experience__history-label" id="search-recent-label">
            Recent searches
          </p>
          <ul
            className="search-experience__history-list"
            aria-labelledby="search-recent-label"
          >
            {history.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  className="search-experience__history-chip"
                  onClick={() => handleHistoryPick(term)}
                >
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <SearchBarWithSuggestions
        key={suggestionSig}
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
        label="Search emails"
        placeholder="Try “Alex” or “@company.com”"
        suggestionsListId={suggestionsListId}
        optionIdPrefix={optionIdPrefix}
        visibleSuggestions={visibleSuggestions}
        onSuggestionSelect={handleSuggestionSelect}
      />

      {isLoading && hasQuery ? (
        <p className="search-experience__status" role="status" aria-live="polite">
          <span className="search-spinner" aria-hidden />
          Finding suggestions…
        </p>
      ) : null}

      {error ? (
        <p className="search-experience__error" role="alert">
          <span aria-hidden>⚠</span>
          <span>{error}</span>
        </p>
      ) : null}

      {showNoResults ? (
        <p className="search-experience__empty" role="status">
          No contacts match that search. Try another name or email fragment.
        </p>
      ) : null}

      {selectedSuggestion ? (
        <div className="search-experience__selection" role="status" aria-live="polite">
          <span className="search-experience__selection-label">Contact selected</span>
          <span className="search-experience__selection-name">
            {selectedSuggestion.name}
          </span>
          <span className="search-experience__selection-email">
            {selectedSuggestion.email}
          </span>
        </div>
      ) : null}
    </section>
  );
}
