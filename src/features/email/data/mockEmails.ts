import type { Email } from "@/features/email/model/email";

/** Deterministic mock inbox for development and tests. */
export const MOCK_EMAILS: readonly Email[] = [
  {
    id: "em_1",
    subject: "Quarterly planning",
    sender: "operations@example.com",
    body: "Please review the attached agenda before Friday.",
    flagged: false,
  },
  {
    id: "em_2",
    subject: "Invoice #1042",
    sender: "billing@vendor.example.com",
    body: "Your payment is due in 14 days.",
    flagged: true,
  },
  {
    id: "em_3",
    subject: "Welcome to the team",
    sender: "hr@example.com",
    body: "Your onboarding checklist is in the portal.",
    flagged: false,
  },
];
