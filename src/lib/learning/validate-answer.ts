import type { QuestionType } from "@prisma/client";
import type { AnswerPayload, WordOrderPayload } from "@/types/learning";
import { answersMatch, serializeOrder } from "@/lib/learning/normalize-answer";

export type QuestionForValidation = {
  type: QuestionType;
  acceptedAnswers: string[];
  payload: unknown;
  options: Array<{ id: string; isCorrect: boolean }>;
};

export type ValidationResult = {
  isCorrect: boolean;
  storedAnswer: string;
};

function isWordOrderPayload(value: unknown): value is WordOrderPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as WordOrderPayload;
  return Array.isArray(payload.tokens) && Array.isArray(payload.correctOrder);
}

export function validateAnswer(
  question: QuestionForValidation,
  answer: AnswerPayload,
): ValidationResult {
  if (question.type === "MULTIPLE_CHOICE") {
    if (answer.kind !== "option") {
      return { isCorrect: false, storedAnswer: "" };
    }

    const option = question.options.find((item) => item.id === answer.optionId);
    return {
      isCorrect: Boolean(option?.isCorrect),
      storedAnswer: answer.optionId,
    };
  }

  if (question.type === "WORD_ORDER") {
    if (answer.kind !== "order" || !isWordOrderPayload(question.payload)) {
      return { isCorrect: false, storedAnswer: "" };
    }

    const storedAnswer = serializeOrder(answer.tokens);
    return {
      isCorrect: storedAnswer === serializeOrder(question.payload.correctOrder),
      storedAnswer,
    };
  }

  if (answer.kind !== "text") {
    return { isCorrect: false, storedAnswer: "" };
  }

  return {
    isCorrect: answersMatch(answer.value, question.acceptedAnswers),
    storedAnswer: answer.value.trim(),
  };
}
