import type { FormEvent } from "react";

type SearchBarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch?: (query: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  /** When set, links the input to a suggestions listbox for accessibility. */
  suggestionsListboxId?: string;
  /** Whether the suggestions list is currently visible. */
  suggestionsOpen?: boolean;
};

const DEFAULT_INPUT_ID = "search-input";

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchBar({
  query,
  onQueryChange,
  onSearch,
  label = "Search",
  placeholder = "Search...",
  disabled = false,
  id = DEFAULT_INPUT_ID,
  suggestionsListboxId,
  suggestionsOpen = false,
}: SearchBarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <form role="search" aria-label={label} className="search-bar" onSubmit={handleSubmit}>
      <label className="search-bar__label" htmlFor={id}>
        {label}
      </label>
      <div className="search-bar__row">
        <span className="search-bar__icon" aria-hidden>
          <SearchIcon />
        </span>
        <input
          id={id}
          type="search"
          className="search-bar__input"
          value={query}
          placeholder={placeholder}
          onChange={(event) => onQueryChange(event.target.value)}
          autoComplete="off"
          disabled={disabled}
          aria-controls={suggestionsListboxId}
          aria-expanded={suggestionsListboxId ? suggestionsOpen : undefined}
          aria-autocomplete={suggestionsListboxId ? "list" : undefined}
        />
        <button type="submit" className="search-bar__submit" disabled={disabled}>
          Search
        </button>
      </div>
      <p className="search-bar__hint">
        Press <kbd>Enter</kbd> to search, or pick a suggestion below.
      </p>
    </form>
  );
}
