import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchExperience } from "@/features/search/ui/SearchExperience";

const useSearchSuggestionsMock = vi.fn();

vi.mock("@/features/search/logic/useSearchSuggestions", () => ({
  useSearchSuggestions: (query: string) => useSearchSuggestionsMock(query),
}));

describe("SearchExperience", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("passes current input query to useSearchSuggestions", () => {
    useSearchSuggestionsMock.mockReturnValue({
      suggestions: [],
      isLoading: false,
      error: null,
    });

    render(<SearchExperience />);

    const input = screen.getByRole("searchbox", { name: "Search emails" });
    fireEvent.change(input, { target: { value: "alex" } });

    expect(useSearchSuggestionsMock).toHaveBeenLastCalledWith("alex");
  });

  it("shows hook suggestions while user types and handles selection", () => {
    useSearchSuggestionsMock.mockImplementation((query: string) => {
      if (!query.trim()) {
        return { suggestions: [], isLoading: false, error: null };
      }
      // After picking a suggestion, the query becomes an email — hide list like a real match would.
      if (query.includes("@")) {
        return { suggestions: [], isLoading: false, error: null };
      }

      return {
        suggestions: [{ id: "1", name: "Alex", email: "alex@example.com" }],
        isLoading: false,
        error: null,
      };
    });

    render(<SearchExperience />);

    const input = screen.getByRole("searchbox", { name: "Search emails" });
    fireEvent.change(input, { target: { value: "al" } });

    const option = screen.getByRole("option", { name: /Alex/ });
    fireEvent.mouseDown(option);

    expect(screen.getByRole("searchbox", { name: "Search emails" })).toHaveValue(
      "alex@example.com",
    );
    expect(screen.getByText("Alex")).toBeInTheDocument();
    expect(screen.getByText("alex@example.com")).toBeInTheDocument();
    expect(screen.getByText("Contact selected")).toBeInTheDocument();
  });
});
