import { describe, expect, it } from "vitest";
import { answersMatch, normalizeAnswer } from "@/lib/learning/normalize-answer";

describe("normalizeAnswer", () => {
  it("normalizes Armenian punctuation and ev", () => {
    expect(normalizeAnswer("  Բարև! ")).toBe("բարեւ");
  });

  it("normalizes Russian yo", () => {
    expect(normalizeAnswer("ребёнок")).toBe("ребенок");
  });

  it("matches accepted variants", () => {
    expect(answersMatch("Thank you.", ["thank you", "thanks"])).toBe(true);
  });
});
