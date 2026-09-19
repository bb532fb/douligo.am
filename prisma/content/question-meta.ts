import type { ExerciseDifficulty, SkillType } from "@prisma/client";
import type { BuiltQuestion } from "./build-course";
import type { UnitKey } from "./lexicon";
import { learnsArmenian } from "./tracks";
import { grammarTopicFor, vocabTopicFor } from "./topics";
import type { CefrLevel } from "./types";

export type QuestionMeta = {
  skillType: SkillType;
  difficulty: ExerciseDifficulty;
  topicKey: string;
};

export function questionMeta(
  question: BuiltQuestion,
  unitKey: UnitKey,
  level: CefrLevel,
  lessonOrder: number,
  role?: string,
  slug = "hy-en",
): QuestionMeta {
  const sentence = isSentence(question);
  const resolvedRole = question.role ?? role;
  return {
    skillType: skillOf(question, sentence, resolvedRole),
    difficulty: difficultyOf(level, lessonOrder, question.type, sentence, slug),
    topicKey: topicOf(unitKey, question, sentence, resolvedRole),
  };
}

function skillOf(question: BuiltQuestion, sentence: boolean, role?: string): SkillType {
  if (role === "listening") {
    return "LISTENING";
  }
  if (role === "reading") {
    return "READING";
  }
  if (role === "grammar" || role === "sentences") {
    return "GRAMMAR";
  }
  if (question.type === "TRANSLATE" || role === "translate") {
    return "TRANSLATION";
  }
  if (question.type === "WORD_ORDER") {
    return "GRAMMAR";
  }
  if (sentence && question.type === "MULTIPLE_CHOICE") {
    return "READING";
  }
  return sentence ? "GRAMMAR" : "VOCABULARY";
}

function difficultyOf(
  level: CefrLevel,
  lessonOrder: number,
  type: BuiltQuestion["type"],
  sentence: boolean,
  slug: string,
): ExerciseDifficulty {
  const producing = type === "TRANSLATE" || type === "TYPE_ANSWER" || type === "WORD_ORDER";
  if (learnsArmenian(slug)) {
    return armenianTargetDifficulty(level, lessonOrder, producing, sentence);
  }
  return foreignFromHyDifficulty(level, lessonOrder, type, sentence);
}

function armenianTargetDifficulty(
  level: CefrLevel,
  lessonOrder: number,
  producing: boolean,
  sentence: boolean,
): ExerciseDifficulty {
  if (level === "A1") {
    return producing || lessonOrder > 1 ? "MEDIUM" : "EASY";
  }
  if (level === "A2") {
    return producing || sentence ? "HARD" : "MEDIUM";
  }
  return "HARD";
}

function foreignFromHyDifficulty(
  level: CefrLevel,
  lessonOrder: number,
  type: BuiltQuestion["type"],
  sentence: boolean,
): ExerciseDifficulty {
  if (level === "A1") {
    return lessonOrder === 1 ? "EASY" : "MEDIUM";
  }
  if (level === "A2") {
    return lessonOrder === 2 && (type === "TRANSLATE" || sentence) ? "HARD" : "MEDIUM";
  }
  return lessonOrder === 1 ? "MEDIUM" : "HARD";
}

function topicOf(unitKey: UnitKey, question: BuiltQuestion, sentence: boolean, role?: string): string {
  if (role === "grammar" || question.type === "WORD_ORDER" || (sentence && question.type !== "TRANSLATE")) {
    return grammarTopicFor(unitKey);
  }
  return vocabTopicFor(unitKey);
}

function isSentence(question: BuiltQuestion): boolean {
  const sample = question.acceptedAnswers[0] ?? question.prompt;
  return sample.includes(" ");
}
