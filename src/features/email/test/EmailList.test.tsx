import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Email } from "@/features/email/model/email";
import { EmailList } from "@/features/email/ui/EmailList";

const emails: Email[] = [
  {
    id: "a",
    subject: "Alpha",
    sender: "a@example.com",
    body: "Body A",
    flagged: false,
  },
  {
    id: "b",
    subject: "Beta",
    sender: "b@example.com",
    body: "Body B",
    flagged: true,
  },
];

describe("EmailList", () => {
  it("renders an empty state when there are no emails", () => {
    render(
      <EmailList emails={[]} onToggleFlag={vi.fn()} emptyMessage="Nothing here." />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Nothing here.");
  });

  it("renders a list of items and forwards flag toggles", () => {
    const onToggleFlag = vi.fn();
    render(<EmailList emails={emails} onToggleFlag={onToggleFlag} />);

    expect(screen.getByRole("list", { name: "Emails" })).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /flag email/i })[0]);

    expect(onToggleFlag).toHaveBeenCalledWith("a");
  });
});
