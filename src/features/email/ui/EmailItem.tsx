import type { Email } from "@/features/email/model/email";

export type EmailItemProps = {
  email: Email;
  /** Max characters for the body preview line (ellipsis when longer). */
  previewMaxLength?: number;
  onToggleFlag: (id: string) => void;
};

function truncatePreview(body: string, maxLength: number): string {
  const normalized = body.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, Math.max(0, maxLength - 1))}…`;
}

function FlagIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 3v17.5l7-3.5 7 3.5V3H5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
        opacity={filled ? 1 : undefined}
      />
    </svg>
  );
}

export function EmailItem({
  email,
  previewMaxLength = 120,
  onToggleFlag,
}: EmailItemProps) {
  const preview = truncatePreview(email.body, previewMaxLength);
  const flagLabel = email.flagged ? "Remove flag from email" : "Flag email";

  return (
    <li
      className={
        email.flagged ? "email-item email-item--flagged" : "email-item"
      }
    >
      <div className="email-item__body">
        <p className="email-item__subject">{email.subject}</p>
        <p className="email-item__sender">{email.sender}</p>
        <p className="email-item__preview">{preview}</p>
      </div>
      <button
        type="button"
        className="email-item__flag"
        aria-label={flagLabel}
        aria-pressed={email.flagged}
        onClick={() => {
          onToggleFlag(email.id);
        }}
      >
        <FlagIcon filled={email.flagged} />
      </button>
    </li>
  );
}
