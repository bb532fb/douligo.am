import type { LanguageCode, QuestionType } from "@prisma/client";

export type WordOrderPayload = {
  tokens: string[];
  correctOrder: string[];
};

export type PublicQuestionOption = {
  id: string;
  text: string;
  order: number;
};

export type PublicQuestion = {
  id: string;
  type: QuestionType;
  prompt: string;
  order: number;
  options: PublicQuestionOption[];
  tokens: string[];
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

export type AnswerPayload =
  | { kind: "text"; value: string }
  | { kind: "option"; optionId: string }
  | { kind: "order"; tokens: string[] };

export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

export type PathLesson = {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  xpReward: number;
  status: "completed" | "current" | "available" | "locked";
};

export type PathUnit = {
  id: string;
  title: string;
  description: string;
  order: number;
  level: string;
  lessons: PathLesson[];
};
