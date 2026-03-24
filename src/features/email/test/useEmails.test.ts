import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Email } from "@/features/email/model/email";
import { useEmails } from "@/features/email/logic/useEmails";
import * as getEmailsModule from "@/features/email/data/getEmails";

const sampleEmails: Email[] = [
  {
    id: "em_1",
    subject: "Quarterly planning",
    sender: "ops@example.com",
    body: "Agenda attached.",
    flagged: false,
  },
  {
    id: "em_2",
    subject: "Invoice #1042",
    sender: "billing@vendor.example.com",
    body: "Payment due soon.",
    flagged: true,
  },
];

describe("useEmails", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads emails on mount and exposes them when the query is empty", async () => {
    vi.spyOn(getEmailsModule, "getEmails").mockResolvedValue(sampleEmails);

    const { result } = renderHook(() => useEmails(""));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.emails).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.emails).toEqual(sampleEmails);
    expect(result.current.error).toBeNull();
  });

  it("sets error when fetch fails", async () => {
    vi.spyOn(getEmailsModule, "getEmails").mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useEmails(""));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.emails).toEqual([]);
  });

  it("filters emails by case-insensitive substring across subject, sender, and body", async () => {
    vi.spyOn(getEmailsModule, "getEmails").mockResolvedValue(sampleEmails);

    const { result, rerender } = renderHook(
      ({ query }: { query: string }) => useEmails(query),
      { initialProps: { query: "" } },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    rerender({ query: "  INVOICE  " });

    expect(result.current.emails).toEqual([sampleEmails[1]]);

    rerender({ query: "ops@example" });

    expect(result.current.emails).toEqual([sampleEmails[0]]);
  });

  it("toggles flagged state for an email by id and keeps filtering in sync", async () => {
    vi.spyOn(getEmailsModule, "getEmails").mockResolvedValue(sampleEmails);

    const { result } = renderHook(() => useEmails("planning"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.emails).toHaveLength(1);
    expect(result.current.emails[0]?.flagged).toBe(false);

    act(() => {
      result.current.toggleFlag("em_1");
    });

    expect(result.current.emails).toHaveLength(1);
    expect(result.current.emails[0]?.flagged).toBe(true);

    act(() => {
      result.current.toggleFlag("em_1");
    });

    expect(result.current.emails[0]?.flagged).toBe(false);
  });
});
