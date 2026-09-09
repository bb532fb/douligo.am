import type { LanguageCode, Prisma } from "@prisma/client";
import type { PublicQuestion, WordOrderPayload } from "@/types/learning";

type QuestionWithOptions = Prisma.QuestionGetPayload<{
  include: { options: true };
}>;

type QuestionLangs = {
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

function isWordOrderPayload(value: unknown): value is WordOrderPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as WordOrderPayload;
  return Array.isArray(payload.tokens) && Array.isArray(payload.correctOrder);
}

export function toPublicQuestion(question: QuestionWithOptions, langs: QuestionLangs): PublicQuestion {
  const payload = isWordOrderPayload(question.payload) ? question.payload : null;

  return {
    id: question.id,
    type: question.type,
    prompt: question.prompt,
    order: question.order,
    options: question.options
      .map((option) => ({ id: option.id, text: option.text, order: option.order }))
      .sort((left, right) => left.order - right.order),
    tokens: payload?.tokens ?? [],
    sourceLanguage: langs.sourceLanguage,
    targetLanguage: langs.targetLanguage,
  };
}

export function revealCorrectAnswer(question: QuestionWithOptions): string {
  if (question.type === "MULTIPLE_CHOICE") {
    return question.options.find((option) => option.isCorrect)?.text ?? "";
  }

  if (isWordOrderPayload(question.payload)) {
    return question.payload.correctOrder.join(" ");
  }

  return question.acceptedAnswers[0] ?? "";
}
