import { describe, expect, it } from "vitest";
import { getEmails } from "@/features/email/data/getEmails";

describe("getEmails", () => {
  it("resolves with emails that include id, subject, sender, body, and flagged", async () => {
    const emails = await getEmails();

    expect(emails.length).toBeGreaterThan(0);
    for (const email of emails) {
      expect(email).toMatchObject({
        id: expect.any(String),
        subject: expect.any(String),
        sender: expect.any(String),
        body: expect.any(String),
        flagged: expect.any(Boolean),
      });
    }
  });

  it("returns a new array instance on each call", async () => {
    const first = await getEmails();
    const second = await getEmails();

    expect(first).not.toBe(second);
    expect(first).toEqual(second);
  });
});
