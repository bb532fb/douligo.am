import { describe, expect, it } from "vitest";
import { isLessonUnlocked } from "@/lib/learning/unlock";

describe("isLessonUnlocked", () => {
  const lessons = [{ id: "a" }, { id: "b" }, { id: "c" }];

  it("unlocks the first lesson", () => {
    expect(isLessonUnlocked(lessons, new Set(), "a")).toBe(true);
  });

  it("locks later lessons until the previous is done", () => {
    expect(isLessonUnlocked(lessons, new Set(), "b")).toBe(false);
    expect(isLessonUnlocked(lessons, new Set(["a"]), "b")).toBe(true);
  });
});
