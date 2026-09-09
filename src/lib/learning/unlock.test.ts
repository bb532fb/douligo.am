import { describe, expect, it } from "vitest";
import { firstIncompleteLesson, firstIndexForLevel, isLessonUnlocked } from "@/lib/learning/unlock";

const lessons = [
  { id: "a1-1", level: "A1" },
  { id: "a1-2", level: "A1" },
  { id: "a2-1", level: "A2" },
  { id: "a2-2", level: "A2" },
  { id: "b1-1", level: "B1" },
  { id: "b1-2", level: "B1" },
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
    expect(isLessonUnlocked(lessons, new Set(), "a2-1", gate)).toBe(true);
    expect(isLessonUnlocked(lessons, new Set(), "a2-2", gate)).toBe(false);
    expect(isLessonUnlocked(lessons, new Set(["a2-1"]), "a2-2", gate)).toBe(true);
  });

  it("lets a B1 learner start the first B1 lesson immediately", () => {
    const gate = firstIndexForLevel(lessons, "B1");
    expect(isLessonUnlocked(lessons, new Set(), "b1-1", gate)).toBe(true);
    expect(isLessonUnlocked(lessons, new Set(), "b1-2", gate)).toBe(false);
    expect(isLessonUnlocked(lessons, new Set(["b1-1"]), "b1-2", gate)).toBe(true);
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
});
