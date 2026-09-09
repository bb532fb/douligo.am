import { describe, expect, it } from "vitest";
import { buildCourseContent } from "../../../prisma/content/build-course";
import { COURSE_SEEDS, UNIT_LEVEL, UNIT_ORDER } from "../../../prisma/content/courses";

function wordOrderPrompts(level: string) {
  const built = buildCourseContent(COURSE_SEEDS[0]!);
  return built.units
    .filter((unit) => unit.level === level)
    .flatMap((unit) => unit.lessons.flatMap((lesson) => lesson.questions))
    .filter((question) => question.type === "WORD_ORDER")
    .map((question) => question.acceptedAnswers[0] ?? "");
}

describe("curriculum", () => {
  it("orders six A1 units, then six A2, then six B1 on every track", () => {
    for (const seed of COURSE_SEEDS) {
      const built = buildCourseContent(seed);
      expect(built.units).toHaveLength(UNIT_ORDER.length);
      expect(built.units.map((unit) => unit.level)).toEqual(UNIT_ORDER.map((key) => UNIT_LEVEL[key]));
      expect(built.units.slice(0, 6).every((unit) => unit.level === "A1")).toBe(true);
      expect(built.units.slice(6, 12).every((unit) => unit.level === "A2")).toBe(true);
      expect(built.units.slice(12).every((unit) => unit.level === "B1")).toBe(true);
    }
  });

  it("keeps unique vocabulary keys and two lessons per unit", () => {
    const built = buildCourseContent(COURSE_SEEDS[0]!);
    const keys = built.words.map((word) => word.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(built.units.every((unit) => unit.lessons.length === 2)).toBe(true);
    expect(built.units.every((unit) => unit.lessons.every((lesson) => lesson.questions.length > 0))).toBe(true);
  });

  it("keeps A1 in present-tense survival language", () => {
    const text = wordOrderPrompts("A1").join(" ").toLowerCase();
    expect(text).not.toMatch(/yesterday|last week|because|already|although|i will/);
  });

  it("teaches A2 past and future", () => {
    const text = wordOrderPrompts("A2").join(" ").toLowerCase();
    expect(text).toMatch(/yesterday|last week|i was|i went/);
    expect(text).toMatch(/tomorrow|i will|i can/);
  });

  it("teaches B1 connected reasons and plans", () => {
    const answers = wordOrderPrompts("B1");
    const text = answers.join(" ").toLowerCase();
    expect(text).toMatch(/because|if |although/);
    const lengths = answers.map((answer) => answer.split(/\s+/).filter(Boolean).length);
    const average = lengths.reduce((sum, length) => sum + length, 0) / lengths.length;
    expect(average).toBeGreaterThan(6);
  });
});
