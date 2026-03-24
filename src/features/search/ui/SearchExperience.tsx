import { useId, useMemo, useState } from "react";
import type { SearchSuggestion } from "@/features/search/data/getSearchSuggestions";
import { useSearchSuggestions } from "@/features/search/logic/useSearchSuggestions";
import { SearchBar } from "@/features/search/ui/SearchBar";
import { Suggestions } from "@/features/search/ui/Suggestions";

export function SearchExperience() {
  const [query, setQuery] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<SearchSuggestion | null>(null);
  const { suggestions, isLoading, error } = useSearchSuggestions(query);
  const suggestionsListId = useId();

  const hasQuery = query.trim().length > 0;
  const visibleSuggestions = useMemo(
    () => (hasQuery ? suggestions : []),
    [hasQuery, suggestions],
  );

  const suggestionsOpen = visibleSuggestions.length > 0;
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

  return (
    <section className="search-experience" aria-label="Email search">
      <p className="search-experience__hint">
        Start typing a name or email — suggestions appear after a short pause. Use
        keyboard or click to choose a contact.
      </p>

      <SearchBar
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={setQuery}
        label="Search emails"
        placeholder="Try “Alex” or “@company.com”"
        suggestionsListboxId={suggestionsListId}
        suggestionsOpen={suggestionsOpen}
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

      <Suggestions
        id={suggestionsListId}
        suggestions={visibleSuggestions}
        onSelect={handleSuggestionSelect}
        ariaLabel="Email suggestions"
      />

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
