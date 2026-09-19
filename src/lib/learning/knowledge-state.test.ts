import { describe, expect, it } from "vitest";
import { nextKnowledgeState } from "@/lib/learning/knowledge-state";

describe("nextKnowledgeState", () => {
  it("moves NEW to LEARNING on the first attempt", () => {
    expect(
      nextKnowledgeState({
        state: "NEW",
        score: 20,
        consecutiveCorrect: 1,
        consecutiveWrong: 0,
        successfulReviews: 0,
        distinctReviewDays: 0,
      }),
    ).toBe("LEARNING");
  });

  it("requires multiple spaced successes before MASTERED", () => {
    expect(
      nextKnowledgeState({
        state: "LEARNED",
        score: 94,
        consecutiveCorrect: 5,
        consecutiveWrong: 0,
        successfulReviews: 1,
        distinctReviewDays: 1,
      }),
    ).toBe("LEARNED");
    expect(
      nextKnowledgeState({
        state: "LEARNED",
        score: 94,
        consecutiveCorrect: 5,
        consecutiveWrong: 0,
        successfulReviews: 3,
        distinctReviewDays: 2,
      }),
    ).toBe("MASTERED");
  });

  it("drops LEARNED or MASTERED to WEAK after repeated mistakes", () => {
    expect(
      nextKnowledgeState({
        state: "MASTERED",
        score: 68,
        consecutiveCorrect: 0,
        consecutiveWrong: 2,
        successfulReviews: 4,
        distinctReviewDays: 3,
      }),
    ).toBe("WEAK");
  });
});
