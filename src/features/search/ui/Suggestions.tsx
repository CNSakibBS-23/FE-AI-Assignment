import {
  useCallback,
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
  /** Root element id (for `aria-controls` on the search input). */
  id?: string;
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

type SuggestionsListInnerProps = {
  suggestions: SearchSuggestion[];
  onSelect?: (suggestion: SearchSuggestion) => void;
  ariaLabel: string;
  labelledBy?: string;
  listboxId: string;
};

function SuggestionsListInner({
  suggestions,
  onSelect,
  ariaLabel,
  labelledBy,
  listboxId,
}: SuggestionsListInnerProps) {
  const baseId = useId();
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  return (
    <div className="search-suggestions-wrap">
      <div
        id={listboxId}
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
              className={
                isSelected
                  ? "search-suggestions__option is-active"
                  : "search-suggestions__option"
              }
              onMouseEnter={() => setSelectedIndex(index)}
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

export function Suggestions({
  suggestions,
  onSelect,
  ariaLabel = "Search suggestions",
  labelledBy,
  id: idProp,
}: SuggestionsProps) {
  const reactId = useId();
  const listboxId = idProp ?? `search-suggestions-${reactId}`;
  const listKey = suggestions.map((s) => s.id).join("|");

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <SuggestionsListInner
      key={listKey}
      suggestions={suggestions}
      onSelect={onSelect}
      ariaLabel={ariaLabel}
      labelledBy={labelledBy}
      listboxId={listboxId}
    />
  );
}
