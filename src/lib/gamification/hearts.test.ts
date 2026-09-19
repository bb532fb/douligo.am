import { describe, expect, it } from "vitest";
import { addHearts, canStartLesson, clampHearts, loseHeart, refillHeartsIfNeeded } from "@/lib/gamification/hearts";

describe("hearts", () => {
  it("never goes below zero", () => {
    expect(loseHeart(0)).toBe(0);
  });

  it("refills on a new day", () => {
    const result = refillHeartsIfNeeded(2, new Date("2026-09-08T10:00:00Z"), new Date("2026-09-09T10:00:00Z"));
    expect(result).toEqual({ hearts: 5, refilled: true });
  });

  it("refills to a custom max", () => {
    const result = refillHeartsIfNeeded(2, new Date("2026-09-08T10:00:00Z"), new Date("2026-09-09T10:00:00Z"), 8);
    expect(result).toEqual({ hearts: 8, refilled: true });
  });

  it("blocks a lesson at zero hearts", () => {
    expect(canStartLesson(0)).toBe(false);
  });

  it("clamps gifted hearts between 0 and the daily max", () => {
    expect(addHearts(4, 1)).toBe(5);
    expect(addHearts(5, 1)).toBe(5);
    expect(addHearts(1, -1)).toBe(0);
    expect(clampHearts(99)).toBe(5);
    expect(clampHearts(99, 10)).toBe(10);
    expect(addHearts(8, 1, 10)).toBe(9);
  });
});
