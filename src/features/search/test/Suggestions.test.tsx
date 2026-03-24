import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { Suggestions } from "@/features/search/ui/Suggestions";

const sample = [
  { id: "1", name: "Alex", email: "alex@example.com" },
  { id: "2", name: "Blake", email: "blake@example.com" },
  { id: "3", name: "Casey", email: "casey@example.com" },
];

const OPTION_PREFIX = "test-opt-prefix";

function SuggestionsHarness(
  props: Partial<ComponentProps<typeof Suggestions>> & {
    suggestions?: typeof sample;
  },
) {
  const { suggestions = sample, ...rest } = props;
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  return (
    <Suggestions
      suggestions={suggestions}
      highlightedIndex={highlightedIndex}
      onHighlightChange={setHighlightedIndex}
      optionIdPrefix={OPTION_PREFIX}
      {...rest}
    />
  );
}

describe("Suggestions", () => {
  it("renders a listbox with one option per suggestion", () => {
    render(<SuggestionsHarness />);

    const listbox = screen.getByRole("listbox", { name: "Search suggestions" });
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByRole("option", { name: /Alex/ })).toBeInTheDocument();
  });

  it("returns null when there are no suggestions", () => {
    const { container } = render(<SuggestionsHarness suggestions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("highlights the first item by default and moves highlight with arrow keys", async () => {
    const user = userEvent.setup();
    render(<SuggestionsHarness />);

    const listbox = screen.getByRole("listbox");
    listbox.focus();

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");

    await user.keyboard("{ArrowDown}");
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[1]).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowUp}");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
  });

  it("clamps highlight at list boundaries", async () => {
    const user = userEvent.setup();
    render(<SuggestionsHarness />);

    const listbox = screen.getByRole("listbox");
    listbox.focus();

    const options = screen.getAllByRole("option");
    await user.keyboard("{ArrowUp}");
    expect(options[0]).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    expect(options[2]).toHaveAttribute("aria-selected", "true");
  });

  it("calls onSelect with the highlighted suggestion on Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<SuggestionsHarness onSelect={onSelect} />);

    screen.getByRole("listbox").focus();

    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(sample[1]);
  });

  it("updates highlight when hovering an option", async () => {
    const user = userEvent.setup();
    render(<SuggestionsHarness />);

    const options = screen.getAllByRole("option");
    await user.hover(options[2]);

    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[2]).toHaveAttribute("aria-selected", "true");
  });
});
