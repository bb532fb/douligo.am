import { describe, expect, it } from "vitest";
import { buildCourseContent } from "../../../prisma/content/build-course";
import { COURSE_SEEDS, UNIT_LEVEL, UNIT_ORDER } from "../../../prisma/content/courses";

describe("A2 curriculum", () => {
  it("appends four A2 units after A1 on every track", () => {
    for (const seed of COURSE_SEEDS) {
      const built = buildCourseContent(seed);
      expect(built.units).toHaveLength(UNIT_ORDER.length);
      expect(built.units.map((unit) => unit.level)).toEqual(UNIT_ORDER.map((key) => UNIT_LEVEL[key]));
      expect(built.units.slice(0, 4).every((unit) => unit.level === "A1")).toBe(true);
      expect(built.units.slice(4).every((unit) => unit.level === "A2")).toBe(true);
    }
  });

  it("keeps unique vocabulary keys and two lessons per unit", () => {
    const built = buildCourseContent(COURSE_SEEDS[0]!);
    const keys = built.words.map((word) => word.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(built.units.every((unit) => unit.lessons.length === 2)).toBe(true);
    expect(built.units.every((unit) => unit.lessons.every((lesson) => lesson.questions.length > 0))).toBe(true);
  });
});
