import { describe, expect, it } from "vitest";
import { calculateLessonXp, levelFromTotalXp, shouldAwardDailyGoal } from "@/lib/gamification/xp";

describe("xp", () => {
  it("adds answer and completion xp", () => {
    expect(calculateLessonXp(8, false)).toBe(36);
  });

  it("skips completion xp on replay", () => {
    expect(calculateLessonXp(8, true)).toBe(16);
  });

  it("awards daily goal once", () => {
    expect(shouldAwardDailyGoal(50, 50, false)).toBe(true);
    expect(shouldAwardDailyGoal(50, 50, true)).toBe(false);
  });

  it("computes level from total xp", () => {
    expect(levelFromTotalXp(0)).toBe(1);
    expect(levelFromTotalXp(100)).toBe(2);
  });
});
