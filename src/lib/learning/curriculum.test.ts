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
  it("orders twelve A1 units, then six A2, then six B1 on every track", () => {
    for (const seed of COURSE_SEEDS) {
      const built = buildCourseContent(seed);
      expect(built.units).toHaveLength(UNIT_ORDER.length);
      expect(built.units.map((unit) => unit.level)).toEqual(UNIT_ORDER.map((key) => UNIT_LEVEL[key]));
      expect(built.units.slice(0, 12).every((unit) => unit.level === "A1")).toBe(true);
      expect(built.units.slice(12, 18).every((unit) => unit.level === "A2")).toBe(true);
      expect(built.units.slice(18).every((unit) => unit.level === "B1")).toBe(true);
    }
  });

  it("keeps unique vocabulary keys and A1 seven-lesson units", () => {
    const built = buildCourseContent(COURSE_SEEDS[0]!);
    const keys = built.words.map((word) => word.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(built.units.filter((unit) => unit.level === "A1").every((unit) => unit.lessons.length === 7)).toBe(true);
    expect(built.units.filter((unit) => unit.level !== "A1").every((unit) => unit.lessons.length === 2)).toBe(true);
    expect(built.units.every((unit) => unit.lessons.every((lesson) => lesson.questions.length > 0))).toBe(true);
  });

  it("keeps A1 in present-tense survival language", () => {
    const text = wordOrderPrompts("A1").join(" ").toLowerCase();
    expect(text).not.toMatch(/yesterday|last week|already|although|i will/);
  });

  it("teaches Russian A1 traps on hy-ru, not English articles", () => {
    const grammar = grammarAnswers("hy-ru");
    expect(grammar).toMatch(/я студент|у меня есть|на столе|сегодня холодно/i);
    expect(grammar).not.toMatch(/i am a student|i want a coffee/i);
  });

  it("teaches Armenian copula on en-hy and ru-hy", () => {
    expect(grammarAnswers("en-hy")).toMatch(/ես լավ եմ|ես ուսանող եմ/i);
    expect(grammarAnswers("ru-hy")).toMatch(/ես լավ եմ|ես ուսանող եմ/i);
  });

  it("teaches A2 grammar of the target language, not a swapped English course", () => {
    expect(laterGrammar("hy-en")).toMatch(/did not|going to|cheaper than/i);
    expect(laterGrammar("en-hy")).toMatch(/կգնամ|էի|ավելի/);
    expect(laterGrammar("ru-hy")).toMatch(/կգնամ|էի|ավելի/);
    expect(laterGrammar("hy-ru")).toMatch(/был|нужен|дешевле/i);
    expect(laterGrammar("hy-ru")).not.toMatch(/did not go|going to go home/i);
    expect(laterGrammar("en-hy")).not.toMatch(/I did not go|Would you like tea/i);
  });

  it("describes reverse tracks with target-language grammar", () => {
    const enHy = buildCourseContent(seedOf("en-hy"));
    const hyRu = buildCourseContent(seedOf("hy-ru"));
    const pastEnHy = enHy.units.find((unit) => unit.unitKey === "past");
    const pastHyRu = hyRu.units.find((unit) => unit.unitKey === "past");
    expect(pastEnHy?.description).toMatch(/էի|գնացի/);
    expect(pastHyRu?.description).toMatch(/был|пошёл/);
    expect(pastEnHy?.description).not.toMatch(/-ed|Did you/);
  });

  it("teaches A1 articles, pronouns, questions, and negation", () => {
    const text = wordOrderPrompts("A1").join(" ").toLowerCase();
    expect(text).toMatch(/\ba\b|\ban\b|\bthe\b/);
    expect(text).toMatch(/\bhe is\b|\byour name\b|\bare you\b/);
    expect(text).toMatch(/do not|does not|\bnot\b/);
    expect(text).toMatch(/\bwhere is\b|\bhow many\b|\bare you\b/);
  });

  it("teaches A2 past and future", () => {
    const text = wordOrderPrompts("A2").join(" ").toLowerCase();
    expect(text).toMatch(/yesterday|last week|i was|i went/);
    expect(text).toMatch(/tomorrow|i will|would you like|let us/);
  });

  it("teaches A2 past questions, comparatives, and going to", () => {
    const text = wordOrderPrompts("A2").join(" ").toLowerCase();
    expect(text).toMatch(/did not|didn't|did you/);
    expect(text).toMatch(/going to/);
    expect(text).toMatch(/cheaper|more expensive/);
  });

  it("teaches B1 connected reasons and plans", () => {
    const answers = wordOrderPrompts("B1");
    const text = answers.join(" ").toLowerCase();
    expect(text).toMatch(/because|if |although/);
    const lengths = answers.map((answer) => answer.split(/\s+/).filter(Boolean).length);
    const average = lengths.reduce((sum, length) => sum + length, 0) / lengths.length;
    expect(average).toBeGreaterThan(6);
  });

  it("teaches B1 present perfect contrast and first conditional", () => {
    const text = wordOrderPrompts("B1").join(" ").toLowerCase();
    expect(text).toMatch(/have been|have never|have lived/);
    expect(text).toMatch(/if i have|if it /);
  });

  it("makes A1 tap-heavy and B1 write-heavy", () => {
    const a1 = questionsForLevel("A1");
    const b1 = questionsForLevel("B1");
    expect(share(a1, "MULTIPLE_CHOICE")).toBeGreaterThan(share(b1, "MULTIPLE_CHOICE"));
    expect(share(b1, "TRANSLATE") + share(b1, "TYPE_ANSWER")).toBeGreaterThan(
      share(a1, "TRANSLATE") + share(a1, "TYPE_ANSWER"),
    );
  });

  it("shuffles multiple-choice answers instead of always putting the correct first", () => {
    const choices = questionsForLevel("A1").filter((question) => question.type === "MULTIPLE_CHOICE");
    const firstCorrect = choices.filter((question) => question.options[0]?.isCorrect).length;
    expect(choices.length).toBeGreaterThan(10);
    expect(firstCorrect).toBeGreaterThan(0);
    expect(firstCorrect).toBeLessThan(Math.floor(choices.length * 0.7));
  });

  it("asks for longer answers at B1 than at A1", () => {
    expect(averageAnswerWords("B1")).toBeGreaterThan(averageAnswerWords("A1") + 1.5);
  });
});

function seedOf(slug: string) {
  const seed = COURSE_SEEDS.find((item) => item.slug === slug);
  if (!seed) {
    throw new Error(`Missing course ${slug}`);
  }
  return seed;
}

function grammarAnswers(slug: string) {
  return buildCourseContent(seedOf(slug))
    .units.filter((unit) => unit.level === "A1")
    .flatMap((unit) => unit.lessons.filter((lesson) => lesson.role === "grammar"))
    .flatMap((lesson) => lesson.questions)
    .map((question) => question.acceptedAnswers[0] ?? "")
    .join(" ");
}

function laterGrammar(slug: string) {
  return buildCourseContent(seedOf(slug))
    .units.filter((unit) => unit.level === "A2" || unit.level === "B1")
    .flatMap((unit) => unit.lessons.flatMap((lesson) => lesson.questions))
    .filter((question) => question.role === "grammar")
    .map((question) => question.acceptedAnswers[0] ?? "")
    .join(" ");
}

function questionsForLevel(level: string) {
  return buildCourseContent(COURSE_SEEDS[0]!)
    .units.filter((unit) => unit.level === level)
    .flatMap((unit) => unit.lessons.flatMap((lesson) => lesson.questions));
}

function share(questions: ReturnType<typeof questionsForLevel>, type: string) {
  return questions.filter((question) => question.type === type).length / questions.length;
}

function averageAnswerWords(level: string) {
  const answers = questionsForLevel(level).map((question) => question.acceptedAnswers[0] ?? "");
  const lengths = answers.map((answer) => answer.split(/\s+/).filter(Boolean).length);
  return lengths.reduce((sum, length) => sum + length, 0) / lengths.length;
}
