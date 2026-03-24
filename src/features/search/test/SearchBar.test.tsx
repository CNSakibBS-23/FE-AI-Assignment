import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "@/features/search/ui/SearchBar";

describe("SearchBar", () => {
  it("renders an accessible search form and input", () => {
    render(<SearchBar query="" onQueryChange={vi.fn()} />);

    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveAttribute(
      "type",
      "search",
    );
  });

  it("works as a controlled input", () => {
    const onQueryChange = vi.fn();
    const { rerender } = render(<SearchBar query="" onQueryChange={onQueryChange} />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Search" }), {
      target: { value: "react" },
    });

    expect(onQueryChange).toHaveBeenCalledWith("react");

    rerender(<SearchBar query="react" onQueryChange={onQueryChange} />);
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("react");
  });

  it("submits the normalized query through intent callback", () => {
    const onSearch = vi.fn();
    render(
      <SearchBar query="  react testing  " onQueryChange={vi.fn()} onSearch={onSearch} />,
    );

    fireEvent.submit(screen.getByRole("search", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledWith("react testing");
  });
});
