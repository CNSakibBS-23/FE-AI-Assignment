import { describe, expect, it } from "vitest";
import { getHighlightSegments } from "@/features/email/utils/highlightText";

describe("getHighlightSegments", () => {
  it("returns a single non-highlight segment when the query is empty", () => {
    expect(getHighlightSegments("Hello world", "")).toEqual([
      { text: "Hello world", highlight: false },
    ]);
    expect(getHighlightSegments("Hello world", "   ")).toEqual([
      { text: "Hello world", highlight: false },
    ]);
  });

  it("matches case-insensitively while preserving original casing in segments", () => {
    expect(getHighlightSegments("Quarterly REPORT", "report")).toEqual([
      { text: "Quarterly ", highlight: false },
      { text: "REPORT", highlight: true },
    ]);
  });

  it("highlights every non-overlapping occurrence", () => {
    expect(getHighlightSegments("foo bar foo", "foo")).toEqual([
      { text: "foo", highlight: true },
      { text: " bar ", highlight: false },
      { text: "foo", highlight: true },
    ]);
  });

  it("returns the full string as non-highlight when there is no match", () => {
    expect(getHighlightSegments("Hello world", "zzz")).toEqual([
      { text: "Hello world", highlight: false },
    ]);
  });

  it("treats the whole string as one match when it matches entirely", () => {
    expect(getHighlightSegments("Invoice", "invoice")).toEqual([
      { text: "Invoice", highlight: true },
    ]);
  });

  it("does not treat regex metacharacters in the query as special", () => {
    expect(getHighlightSegments("Price is $10+tax", "$10+")).toEqual([
      { text: "Price is ", highlight: false },
      { text: "$10+", highlight: true },
      { text: "tax", highlight: false },
    ]);
  });

  it("handles empty text", () => {
    expect(getHighlightSegments("", "x")).toEqual([{ text: "", highlight: false }]);
    expect(getHighlightSegments("", "")).toEqual([{ text: "", highlight: false }]);
  });
});
