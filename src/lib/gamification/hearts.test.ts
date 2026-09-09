import { describe, expect, it } from "vitest";
import { canStartLesson, loseHeart, refillHeartsIfNeeded } from "@/lib/gamification/hearts";

describe("hearts", () => {
  it("never goes below zero", () => {
    expect(loseHeart(0)).toBe(0);
  });

  it("refills on a new day", () => {
    const result = refillHeartsIfNeeded(2, new Date("2026-09-08T10:00:00Z"), new Date("2026-09-09T10:00:00Z"));
    expect(result).toEqual({ hearts: 5, refilled: true });
  });

  it("blocks a lesson at zero hearts", () => {
    expect(canStartLesson(0)).toBe(false);
  });
});
