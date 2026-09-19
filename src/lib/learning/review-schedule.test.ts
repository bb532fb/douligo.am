import { describe, expect, it } from "vitest";
import { REVIEW_INTERVALS_MS } from "@/lib/learning/mastery-config";
import {
  calculateNextReviewDate,
  firstReviewAfterMistake,
  firstReviewAfterSuccess,
} from "@/lib/learning/review-schedule";

describe("review schedule", () => {
  it("increases the interval after a successful review", () => {
    const now = Date.parse("2026-09-19T12:00:00.000Z");
    const next = calculateNextReviewDate(1, true, now);
    expect(next.intervalIndex).toBe(2);
    expect(next.nextReviewAt.getTime()).toBe(now + REVIEW_INTERVALS_MS[2]);
  });

  it("resets or reduces the interval after a failed review", () => {
    const now = Date.parse("2026-09-19T12:00:00.000Z");
    const next = calculateNextReviewDate(3, false, now);
    expect(next.intervalIndex).toBe(1);
    expect(next.nextReviewAt.getTime()).toBe(now + REVIEW_INTERVALS_MS[1]);
  });

  it("schedules the first mistake for 10 minutes and first success for 1 day", () => {
    const now = Date.parse("2026-09-19T12:00:00.000Z");
    expect(firstReviewAfterMistake(now).nextReviewAt.getTime()).toBe(now + REVIEW_INTERVALS_MS[0]);
    expect(firstReviewAfterSuccess(now).nextReviewAt.getTime()).toBe(now + REVIEW_INTERVALS_MS[1]);
  });
});
