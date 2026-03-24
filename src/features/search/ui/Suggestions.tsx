import { useId, type KeyboardEvent } from "react";
import type { SearchSuggestion } from "@/features/search/data/getSearchSuggestions";

type SuggestionsProps = {
  suggestions: SearchSuggestion[];
  /** Controlled highlight index (must match the value driven by the search input). */
  highlightedIndex: number;
  onHighlightChange: (index: number) => void;
  onSelect?: (suggestion: SearchSuggestion) => void;
  /** Accessible name for the listbox (e.g. tied to search input via aria-controls). */
  ariaLabel?: string;
  /** Optional id for aria-labelledby if you use a visible heading instead. */
  labelledBy?: string;
  /** Root element id (for `aria-controls` on the search input). */
  id?: string;
  /** Prefix for option element ids (must match `aria-activedescendant` on the input). */
  optionIdPrefix: string;
};

function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    const a = parts[0]?.[0];
    const b = parts[parts.length - 1]?.[0];
    return `${a ?? ""}${b ?? ""}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

export function Suggestions({
  suggestions,
  highlightedIndex,
  onHighlightChange,
  onSelect,
  ariaLabel = "Search suggestions",
  labelledBy,
  id: idProp,
  optionIdPrefix,
}: SuggestionsProps) {
  const reactId = useId();
  const listboxId = idProp ?? `search-suggestions-${reactId}`;

  if (suggestions.length === 0) {
    return null;
  }

  const safeIndex = Math.max(0, Math.min(highlightedIndex, suggestions.length - 1));

  const moveHighlight = (delta: number) => {
    onHighlightChange(
      Math.max(0, Math.min(safeIndex + delta, suggestions.length - 1)),
    );
  };

  const handleListboxKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
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
        if (suggestions[safeIndex]) {
          onSelect?.(suggestions[safeIndex]);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="search-suggestions-wrap">
      <div
        id={listboxId}
        role="listbox"
        tabIndex={-1}
        aria-label={labelledBy ? undefined : ariaLabel}
        aria-labelledby={labelledBy}
        onKeyDown={handleListboxKeyDown}
        className="search-suggestions"
      >
        {suggestions.map((suggestion, index) => {
          const optionId = `${optionIdPrefix}-opt-${suggestion.id}`;
          const isSelected = index === safeIndex;

          return (
            <div
              key={suggestion.id}
              id={optionId}
              role="option"
              aria-selected={isSelected}
              className={
                isSelected
                  ? "search-suggestions__option is-active"
                  : "search-suggestions__option"
              }
              onMouseEnter={() => onHighlightChange(index)}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect?.(suggestion);
              }}
            >
              <span className="search-suggestions__avatar" aria-hidden>
                {getInitials(suggestion.name)}
              </span>
              <span className="search-suggestions__body">
                <span className="search-suggestions__name">{suggestion.name}</span>
                <span className="search-suggestions__email">{suggestion.email}</span>
              </span>
            </div>
          );
        })}
        <p className="search-suggestions__kbd">
          <kbd>↑</kbd>
          <kbd>↓</kbd> to move · <kbd>Enter</kbd> to select
        </p>
      </div>
    </div>
  );
}
