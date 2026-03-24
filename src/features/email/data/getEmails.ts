import type { Email } from "@/features/email/model/email";
import { MOCK_EMAILS } from "./mockEmails";

export async function getEmails(): Promise<Email[]> {
  return [...MOCK_EMAILS];
}
