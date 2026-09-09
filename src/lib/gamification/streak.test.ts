import { describe, expect, it } from "vitest";
import { nextStreak } from "@/lib/gamification/streak";

describe("nextStreak", () => {
  it("starts at one", () => {
    const result = nextStreak({ currentStreak: 0, longestStreak: 0, lastActivityDate: null }, new Date("2026-09-09T10:00:00Z"));
    expect(result.currentStreak).toBe(1);
    expect(result.changed).toBe(true);
  });

  it("does not increase twice in one day", () => {
    const day = new Date("2026-09-09T10:00:00Z");
    const result = nextStreak({ currentStreak: 3, longestStreak: 5, lastActivityDate: day }, new Date("2026-09-09T18:00:00Z"));
    expect(result.currentStreak).toBe(3);
    expect(result.changed).toBe(false);
  });

  it("increments on the next day and resets after a gap", () => {
    const continued = nextStreak(
      { currentStreak: 3, longestStreak: 5, lastActivityDate: new Date("2026-09-08T10:00:00Z") },
      new Date("2026-09-09T10:00:00Z"),
    );
    expect(continued.currentStreak).toBe(4);

    const reset = nextStreak(
      { currentStreak: 3, longestStreak: 5, lastActivityDate: new Date("2026-09-07T10:00:00Z") },
      new Date("2026-09-09T10:00:00Z"),
    );
    expect(reset.currentStreak).toBe(1);
  });
});
