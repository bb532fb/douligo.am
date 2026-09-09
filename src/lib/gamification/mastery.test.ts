import { describe, expect, it } from "vitest";
import { matchesMasteryFilter, nextMastery } from "@/lib/gamification/mastery";

describe("mastery", () => {
  it("increases and decreases within bounds", () => {
    expect(nextMastery(90, true)).toBe(100);
    expect(nextMastery(5, false)).toBe(0);
  });

  it("filters learning vs mastered", () => {
    expect(matchesMasteryFilter(50, "learning")).toBe(true);
    expect(matchesMasteryFilter(90, "mastered")).toBe(true);
  });
});
