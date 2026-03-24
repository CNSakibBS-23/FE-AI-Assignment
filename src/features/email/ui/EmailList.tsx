import type { Email } from "@/features/email/model/email";
import { EmailItem } from "@/features/email/ui/EmailItem";

export type EmailListProps = {
  emails: readonly Email[];
  onToggleFlag: (id: string) => void;
  /** Shown when `emails` is empty. */
  emptyMessage?: string;
  /** Accessible label for the list. */
  ariaLabel?: string;
  previewMaxLength?: number;
};

export function EmailList({
  emails,
  onToggleFlag,
  emptyMessage = "No emails match your filters.",
  ariaLabel = "Emails",
  previewMaxLength,
}: EmailListProps) {
  if (emails.length === 0) {
    return (
      <div className="email-list email-list--empty" role="status">
        <p className="email-list__empty-text">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="email-list" aria-label={ariaLabel}>
      {emails.map((email) => (
        <EmailItem
          key={email.id}
          email={email}
          previewMaxLength={previewMaxLength}
          onToggleFlag={onToggleFlag}
        />
      ))}
    </ul>
  );
}
