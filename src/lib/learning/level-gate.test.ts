import { describe, expect, it } from "vitest";
import { canUnlockNextLevel, type UnlockInput } from "@/lib/learning/level-gate";

const ready: UnlockInput = {
  levelKey: "A2",
  overall: 40,
  skills: { VOCABULARY: 30, GRAMMAR: 20 },
  curriculumSkills: ["VOCABULARY", "GRAMMAR"],
  assessmentScore: null,
  criticalTopics: [{ key: "past-simple", score: 40 }],
  lessonsCompleted: 12,
  lessonsTotal: 12,
  reviewDue: 3,
};

describe("canUnlockNextLevel", () => {
  it("unlocks the next level after every lesson in the current level is done", () => {
    expect(canUnlockNextLevel(ready).ok).toBe(true);
  });

  it("blocks unlock until every lesson in the level is done", () => {
    const result = canUnlockNextLevel({ ...ready, lessonsCompleted: 9 });
    expect(result.ok).toBe(false);
    expect(result.gaps.some((gap) => gap.kind === "lessons")).toBe(true);
  });

  it("ignores a client-provided unlocked flag", () => {
    const sneaky = { ...ready, unlocked: true, mastery: 100, lessonsCompleted: 4 };
    expect(canUnlockNextLevel(sneaky).ok).toBe(false);
  });
});
