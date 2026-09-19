import { describe, expect, it } from "vitest";
import { firstIncompleteLesson, firstIndexForLevel, isLessonUnlocked, unitsFromStartLevel } from "@/lib/learning/unlock";

const lessons = [
  { id: "a1-1", level: "A1", kind: "STANDARD" },
  { id: "a1-2", level: "A1", kind: "STANDARD" },
  { id: "a2-1", level: "A2", kind: "STANDARD" },
  { id: "a2-2", level: "A2", kind: "STANDARD" },
  { id: "b1-1", level: "B1", kind: "STANDARD" },
  { id: "b1-2", level: "B1", kind: "STANDARD" },
];

describe("isLessonUnlocked", () => {
  it("unlocks the first lesson", () => {
    expect(isLessonUnlocked(lessons, new Set(), "a1-1")).toBe(true);
  });

  it("locks later lessons until the previous is done", () => {
    expect(isLessonUnlocked(lessons, new Set(), "a1-2")).toBe(false);
    expect(isLessonUnlocked(lessons, new Set(["a1-1"]), "a1-2")).toBe(true);
  });

  it("lets an A2 learner start the first A2 lesson immediately", () => {
    const gate = firstIndexForLevel(lessons, "A2");
    const open = new Set(["A2"]);
    expect(isLessonUnlocked(lessons, new Set(), "a2-1", gate, open)).toBe(true);
    expect(isLessonUnlocked(lessons, new Set(), "a1-1", gate, open)).toBe(false);
    expect(isLessonUnlocked(lessons, new Set(), "a2-2", gate, open)).toBe(false);
    expect(isLessonUnlocked(lessons, new Set(["a2-1"]), "a2-2", gate, open)).toBe(true);
    expect(isLessonUnlocked(lessons, new Set(["a2-1", "a2-2"]), "b1-1", gate, open)).toBe(false);
  });

  it("lets a B1 learner start the first B1 lesson immediately", () => {
    const gate = firstIndexForLevel(lessons, "B1");
    expect(isLessonUnlocked(lessons, new Set(), "b1-1", gate)).toBe(true);
    expect(isLessonUnlocked(lessons, new Set(), "b1-2", gate)).toBe(false);
    expect(isLessonUnlocked(lessons, new Set(["b1-1"]), "b1-2", gate)).toBe(true);
  });

  it("keeps the next CEFR level locked until that level is accessible", () => {
    const a1Only = new Set(["A1"]);
    expect(isLessonUnlocked(lessons, new Set(["a1-1", "a1-2"]), "a2-1", 0, a1Only)).toBe(false);
    expect(isLessonUnlocked(lessons, new Set(["a1-1", "a1-2"]), "a2-1", 0, new Set(["A1", "A2"]))).toBe(true);
  });
});

describe("firstIncompleteLesson", () => {
  it("skips A1 when the start level is A2", () => {
    const gate = firstIndexForLevel(lessons, "A2");
    expect(firstIncompleteLesson(lessons, new Set(), gate)).toBe("a2-1");
  });

  it("skips A1 and A2 when the start level is B1", () => {
    const gate = firstIndexForLevel(lessons, "B1");
    expect(firstIncompleteLesson(lessons, new Set(), gate)).toBe("b1-1");
  });

  it("stays on the current level when the next level is still locked", () => {
    expect(firstIncompleteLesson(lessons, new Set(["a1-1", "a1-2"]), 0, "A1", new Set(["A1"]))).toBe("a1-2");
  });

  it("moves to B1 after A2 is finished and unlocked", () => {
    expect(
      firstIncompleteLesson(lessons, new Set(["a2-1", "a2-2"]), 2, "A2", new Set(["A2", "B1"])),
    ).toBe("b1-1");
  });
});

describe("unitsFromStartLevel", () => {
  it("hides units below the chosen start level", () => {
    const units = [{ level: "A1" }, { level: "A2" }, { level: "B1" }];
    expect(unitsFromStartLevel(units, "A2").map((unit) => unit.level)).toEqual(["A2", "B1"]);
  });
});
