import { useMemo, useState } from "react";
import type { SearchSuggestion } from "@/features/search/data/getSearchSuggestions";
import { useSearchSuggestions } from "@/features/search/logic/useSearchSuggestions";
import { SearchBar } from "@/features/search/ui/SearchBar";
import { Suggestions } from "@/features/search/ui/Suggestions";

export function SearchExperience() {
  const [query, setQuery] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<SearchSuggestion | null>(null);
  const { suggestions, isLoading, error } = useSearchSuggestions(query);

  const hasQuery = query.trim().length > 0;
  const visibleSuggestions = useMemo(
    () => (hasQuery ? suggestions : []),
    [hasQuery, suggestions],
  );

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
      <SearchBar
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={setQuery}
        label="Search emails"
        placeholder="Search by name or email"
      />

      {isLoading && hasQuery ? (
        <p className="search-experience__status" role="status" aria-live="polite">
          Loading suggestions...
        </p>
      ) : null}

      {error ? (
        <p className="search-experience__error" role="alert">
          {error}
        </p>
      ) : null}

      <Suggestions
        suggestions={visibleSuggestions}
        onSelect={handleSuggestionSelect}
        ariaLabel="Email suggestions"
      />

      {selectedSuggestion ? (
        <p className="search-experience__selection" role="status" aria-live="polite">
          Selected: {selectedSuggestion.name} ({selectedSuggestion.email})
        </p>
      ) : null}
    </section>
  );
}
