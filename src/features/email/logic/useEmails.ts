import { useCallback, useEffect, useMemo, useState } from "react";
import type { Email } from "@/features/email/model/email";
import { getEmails } from "@/features/email/data/getEmails";

function normalizeQuery(raw: string): string {
  return raw.trim().toLowerCase();
}

function emailMatchesQuery(email: Email, normalizedQuery: string): boolean {
  if (!normalizedQuery) {
    return true;
  }
  const haystack = `${email.subject} ${email.sender} ${email.body}`.toLowerCase();
  return haystack.includes(normalizedQuery);
}

export type UseEmailsResult = {
  emails: Email[];
  isLoading: boolean;
  error: string | null;
  toggleFlag: (id: string) => void;
};

export function useEmails(searchQuery: string): UseEmailsResult {
  const [sourceEmails, setSourceEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void getEmails().then(
      (data) => {
        if (!cancelled) {
          setSourceEmails(data);
          setIsLoading(false);
        }
      },
      (err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load emails";
          setError(message);
          setSourceEmails([]);
          setIsLoading(false);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFlag = useCallback((id: string) => {
    setSourceEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, flagged: !email.flagged } : email,
      ),
    );
  }, []);

  const normalizedQuery = useMemo(
    () => normalizeQuery(searchQuery),
    [searchQuery],
  );

  const emails = useMemo(
    () => sourceEmails.filter((e) => emailMatchesQuery(e, normalizedQuery)),
    [sourceEmails, normalizedQuery],
  );

  return {
    emails,
    isLoading,
    error,
    toggleFlag,
  };
}
