import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Suggestions } from "@/features/search/ui/Suggestions";

const sample = [
  { id: "1", name: "Alex", email: "alex@example.com" },
  { id: "2", name: "Blake", email: "blake@example.com" },
  { id: "3", name: "Casey", email: "casey@example.com" },
];

describe("Suggestions", () => {
  it("renders a listbox with one option per suggestion", () => {
    render(<Suggestions suggestions={sample} />);

    const listbox = screen.getByRole("listbox", { name: "Search suggestions" });
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByRole("option", { name: /Alex/ })).toBeInTheDocument();
  });

  it("returns null when there are no suggestions", () => {
    const { container } = render(<Suggestions suggestions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("highlights the first item by default and moves highlight with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Suggestions suggestions={sample} />);

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
    render(<Suggestions suggestions={sample} />);

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
    render(<Suggestions suggestions={sample} onSelect={onSelect} />);

    screen.getByRole("listbox").focus();

    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(sample[1]);
  });

  it("updates highlight when hovering an option", async () => {
    const user = userEvent.setup();
    render(<Suggestions suggestions={sample} />);

    const options = screen.getAllByRole("option");
    await user.hover(options[2]);

    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[2]).toHaveAttribute("aria-selected", "true");
  });
});
