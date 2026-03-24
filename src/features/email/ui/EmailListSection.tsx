import { useEmails } from "@/features/email/logic/useEmails";
import { EmailList } from "@/features/email/ui/EmailList";

export type EmailListSectionProps = {
  /** Filter string from search UI (typing or suggestion selection). */
  query: string;
};

/**
 * Email inbox slice: loads messages and filters by `query`.
 * Keeps data/hooks in the email feature; search only passes `query` via composition.
 */
export function EmailListSection({ query }: EmailListSectionProps) {
  const { emails, isLoading, error, toggleFlag } = useEmails(query);

  if (isLoading) {
    return (
      <section className="email-inbox" aria-label="Inbox messages" aria-busy="true">
        <p className="email-inbox__status" role="status" aria-live="polite">
          <span className="search-spinner" aria-hidden />
          Loading messages…
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="email-inbox" aria-label="Inbox messages">
        <p className="email-inbox__error" role="alert">
          <span aria-hidden>⚠</span>
          <span>{error}</span>
        </p>
      </section>
    );
  }

  return (
    <section className="email-inbox" aria-label="Inbox messages">
      <h2 className="email-inbox__heading">Messages</h2>
      <p className="email-inbox__hint">
        Results match your search in subject, sender, or body. Clear the box to see
        everything.
      </p>
      <EmailList
        emails={emails}
        onToggleFlag={toggleFlag}
        emptyMessage="No messages match this search. Try different words or clear the filter."
        ariaLabel="Filtered messages"
      />
    </section>
  );
}
