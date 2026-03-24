import type { FormEvent } from "react";

type SearchBarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch?: (query: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
};

const DEFAULT_INPUT_ID = "search-input";

export function SearchBar({
  query,
  onQueryChange,
  onSearch,
  label = "Search",
  placeholder = "Search...",
  disabled = false,
  id = DEFAULT_INPUT_ID,
}: SearchBarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <form role="search" aria-label={label} onSubmit={handleSubmit}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="search"
        value={query}
        placeholder={placeholder}
        onChange={(event) => onQueryChange(event.target.value)}
        autoComplete="off"
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>
        Search
      </button>
    </form>
  );
}
