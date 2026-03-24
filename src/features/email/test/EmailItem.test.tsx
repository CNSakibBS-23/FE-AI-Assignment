import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Email } from "@/features/email/model/email";
import { EmailItem } from "@/features/email/ui/EmailItem";

const baseEmail: Email = {
  id: "em_1",
  subject: "Project update",
  sender: "lead@example.com",
  body: "Here is a long body text that should be truncated when preview length is short.",
  flagged: false,
};

describe("EmailItem", () => {
  it("renders subject, sender, and a preview of the body", () => {
    render(
      <ul>
        <EmailItem email={baseEmail} onToggleFlag={vi.fn()} previewMaxLength={40} />
      </ul>,
    );

    expect(screen.getByText("Project update")).toBeInTheDocument();
    expect(screen.getByText("lead@example.com")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Here is a long body text that should be…",
        { exact: false },
      ),
    ).toBeInTheDocument();
  });

  it("invokes onToggleFlag with the email id when the flag control is activated", () => {
    const onToggleFlag = vi.fn();
    render(
      <ul>
        <EmailItem email={baseEmail} onToggleFlag={onToggleFlag} />
      </ul>,
    );

    fireEvent.click(screen.getByRole("button", { name: /flag email/i }));

    expect(onToggleFlag).toHaveBeenCalledWith("em_1");
  });

  it("reflects flagged state for assistive tech and styling hook", () => {
    const flagged: Email = { ...baseEmail, flagged: true };
    render(
      <ul>
        <EmailItem email={flagged} onToggleFlag={vi.fn()} />
      </ul>,
    );

    expect(
      screen.getByRole("button", { name: /remove flag from email/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
