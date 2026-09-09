import { describe, expect, it } from "vitest";
import { validateAnswer } from "@/lib/learning/validate-answer";

describe("validateAnswer", () => {
  it("accepts the correct multiple choice option", () => {
    const result = validateAnswer(
      {
        type: "MULTIPLE_CHOICE",
        acceptedAnswers: ["hello"],
        payload: null,
        options: [
          { id: "a", isCorrect: false },
          { id: "b", isCorrect: true },
        ],
      },
      { kind: "option", optionId: "b" },
    );
    expect(result.isCorrect).toBe(true);
  });

  it("validates typed answers", () => {
    const result = validateAnswer(
      { type: "TYPE_ANSWER", acceptedAnswers: ["hello"], payload: null, options: [] },
      { kind: "text", value: "Hello!" },
    );
    expect(result.isCorrect).toBe(true);
  });

  it("validates word order", () => {
    const result = validateAnswer(
      {
        type: "WORD_ORDER",
        acceptedAnswers: [],
        payload: { tokens: ["I", "am", "a", "student"], correctOrder: ["I", "am", "a", "student"] },
        options: [],
      },
      { kind: "order", tokens: ["I", "am", "a", "student"] },
    );
    expect(result.isCorrect).toBe(true);
  });
});
