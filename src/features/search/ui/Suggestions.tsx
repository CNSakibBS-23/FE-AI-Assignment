import {
  useCallback,
  useEffect,
  useId,
  useState,
  type KeyboardEvent,
} from "react";
import type { SearchSuggestion } from "@/features/search/data/getSearchSuggestions";

type SuggestionsProps = {
  suggestions: SearchSuggestion[];
  onSelect?: (suggestion: SearchSuggestion) => void;
  /** Accessible name for the listbox (e.g. tied to search input via aria-controls). */
  ariaLabel?: string;
  /** Optional id for aria-labelledby if you use a visible heading instead. */
  labelledBy?: string;
};

export function Suggestions({
  suggestions,
  onSelect,
  ariaLabel = "Search suggestions",
  labelledBy,
}: SuggestionsProps) {
  const baseId = useId();
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setSelectedIndex(suggestions.length > 0 ? 0 : -1);
  }, [suggestions]);

  const moveHighlight = useCallback(
    (delta: number) => {
      if (suggestions.length === 0) return;
      setSelectedIndex((current) => {
        const next = current + delta;
        if (next < 0) return 0;
        if (next >= suggestions.length) return suggestions.length - 1;
        return next;
      });
    },
    [suggestions.length],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (suggestions.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveHighlight(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveHighlight(-1);
        break;
      case "Enter":
        event.preventDefault();
        if (
          selectedIndex >= 0 &&
          selectedIndex < suggestions.length &&
          suggestions[selectedIndex]
        ) {
          onSelect?.(suggestions[selectedIndex]);
        }
        break;
      default:
        break;
    }
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div
      role="listbox"
      tabIndex={0}
      aria-label={labelledBy ? undefined : ariaLabel}
      aria-labelledby={labelledBy}
      onKeyDown={handleKeyDown}
      className="search-suggestions"
    >
      {suggestions.map((suggestion, index) => {
        const optionId = `${baseId}-option-${suggestion.id}`;
        const isSelected = index === selectedIndex;

        return (
          <div
            key={suggestion.id}
            id={optionId}
            role="option"
            aria-selected={isSelected}
            className={isSelected ? "search-suggestions__option is-active" : "search-suggestions__option"}
            onMouseEnter={() => setSelectedIndex(index)}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect?.(suggestion);
            }}
          >
            <span className="search-suggestions__name">{suggestion.name}</span>
            <span className="search-suggestions__email">{suggestion.email}</span>
          </div>
        );
      })}
    </div>
  );
}
