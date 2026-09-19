import { describe, expect, it } from "vitest";
import type { BuiltQuestion } from "../../../prisma/content/build-course";
import { questionMeta } from "../../../prisma/content/question-meta";

const translate: BuiltQuestion = {
  type: "TRANSLATE",
  prompt: "hello",
  explanation: "hello",
  order: 1,
  acceptedAnswers: ["բարև"],
  payload: null,
  options: [],
};

const tap: BuiltQuestion = {
  type: "MULTIPLE_CHOICE",
  prompt: "hello",
  explanation: "hello",
  order: 1,
  acceptedAnswers: ["բարև"],
  payload: null,
  options: [],
};

describe("questionMeta difficulty by track", () => {
  it("makes Armenian-target production harder than hy-en at A1", () => {
    const hyEn = questionMeta(translate, "greetings", "A1", 1, "translate", "hy-en");
    const enHy = questionMeta(translate, "greetings", "A1", 1, "translate", "en-hy");
    const ruHy = questionMeta(translate, "greetings", "A1", 1, "translate", "ru-hy");
    const hyRu = questionMeta(translate, "greetings", "A1", 1, "translate", "hy-ru");
    expect(hyEn.difficulty).toBe("EASY");
    expect(hyRu.difficulty).toBe("EASY");
    expect(enHy.difficulty).toBe("MEDIUM");
    expect(ruHy.difficulty).toBe("MEDIUM");
  });

  it("keeps first-lesson taps easy on every track", () => {
    expect(questionMeta(tap, "greetings", "A1", 1, "vocab", "hy-en").difficulty).toBe("EASY");
    expect(questionMeta(tap, "greetings", "A1", 1, "vocab", "en-hy").difficulty).toBe("EASY");
    expect(questionMeta(tap, "greetings", "A1", 1, "vocab", "ru-hy").difficulty).toBe("EASY");
    expect(questionMeta(tap, "greetings", "A1", 1, "vocab", "hy-ru").difficulty).toBe("EASY");
  });

  it("makes Armenian-target A2 production hard like a reverse of hy-en", () => {
    const hyEn = questionMeta(translate, "past", "A2", 1, undefined, "hy-en");
    const enHy = questionMeta(translate, "past", "A2", 1, undefined, "en-hy");
    expect(hyEn.difficulty).toBe("MEDIUM");
    expect(enHy.difficulty).toBe("HARD");
  });
});
