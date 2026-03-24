import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Email } from "@/features/email/model/email";
import { EmailListSection } from "@/features/email/ui/EmailListSection";
import * as getEmailsModule from "@/features/email/data/getEmails";

const mockEmails: Email[] = [
  {
    id: "1",
    subject: "Hello",
    sender: "a@example.com",
    body: "Body",
    flagged: false,
  },
  {
    id: "2",
    subject: "Other",
    sender: "b@example.com",
    body: "Secret text",
    flagged: false,
  },
];

describe("EmailListSection", () => {
  it("filters messages by the search query from the parent", async () => {
    vi.spyOn(getEmailsModule, "getEmails").mockResolvedValue(mockEmails);

    const { rerender } = render(<EmailListSection query="" />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Messages" })).toBeInTheDocument();
    });

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();

    rerender(<EmailListSection query="Secret" />);

    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });
});
