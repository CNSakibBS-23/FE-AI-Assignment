export type HighlightSegment = {
  text: string;
  /** When true, this slice matched the search query (case-insensitive). */
  highlight: boolean;
};

/**
 * Splits `text` into segments so matches for `query` can be wrapped for emphasis.
 * Matching is case-insensitive; the returned slices preserve original casing from `text`.
 * Empty or whitespace-only `query` yields a single non-highlighted segment.
 */
export function getHighlightSegments(
  text: string,
  query: string,
): HighlightSegment[] {
  const needle = query.trim();
  if (needle.length === 0) {
    return [{ text, highlight: false }];
  }

  if (text.length === 0) {
    return [{ text: "", highlight: false }];
  }

  const lowerText = text.toLowerCase();
  const lowerNeedle = needle.toLowerCase();
  const segments: HighlightSegment[] = [];
  let i = 0;

  while (i < text.length) {
    const foundAt = lowerText.indexOf(lowerNeedle, i);
    if (foundAt === -1) {
      segments.push({ text: text.slice(i), highlight: false });
      break;
    }

    if (foundAt > i) {
      segments.push({ text: text.slice(i, foundAt), highlight: false });
    }

    const end = foundAt + needle.length;
    segments.push({ text: text.slice(foundAt, end), highlight: true });
    i = end;
  }

  return segments;
}
