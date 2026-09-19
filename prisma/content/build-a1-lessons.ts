import { a1LessonGoals, a1LessonTitles, A1_LESSON_ROLES, type A1LessonRole } from "./a1-lessons";
import type { BuiltLesson } from "./build-course";
import {
  choiceQuestion,
  mcSentence,
  mcWord,
  translateSentence,
  translateWord,
  trueFalse,
  typeWord,
  withOrder,
  wordOrder,
  type DraftQuestion,
} from "./build-items";
import { drillsFor } from "./grammar-a1";
import type { A1UnitKey } from "./lexicon-a1";
import type { LanguageCode } from "@prisma/client";
import type { Lexeme } from "./types";
import { sentenceOf, type Sentence } from "./text";

type A1Input = {
  unitKey: A1UnitKey;
  lexemes: Lexeme[];
  sentences: Sentence[];
  source: LanguageCode;
  target: LanguageCode;
  slug: string;
};

export function buildA1Lessons(input: A1Input): BuiltLesson[] {
  const titles = a1LessonTitles(input.slug);
  const goals = a1LessonGoals(input.slug);
  const keys = input.lexemes.map((item) => `${input.slug}:${item.key}`);
  return A1_LESSON_ROLES.map((role, index) => ({
    title: titles[index] ?? role,
    description: goals[index] ?? role,
    order: index + 1,
    role,
    questions: withOrder(questionsFor(role, input)),
    wordKeys: role === "vocab" ? keys.slice(0, 8) : keys,
  }));
}

function questionsFor(role: A1LessonRole, input: A1Input): DraftQuestion[] {
  const { lexemes, sentences, source, target, unitKey } = input;
  if (role === "vocab") {
    return [
      ...lexemes.slice(0, 8).map((lexeme) => mcWord(lexeme, lexemes, source, target)),
      ...lexemes.slice(0, 4).map((lexeme) => mcWord(lexeme, lexemes, target, source)),
    ];
  }
  if (role === "grammar") {
    return drillsFor(unitKey, input.slug).map((drill) =>
      choiceQuestion(drill.prompt, drill.correct, drill.wrong, drill.correct, drill.explanation),
    );
  }
  if (role === "sentences") {
    return sentences.slice(0, 6).map((sentence) => wordOrder(sentence, source, target));
  }
  if (role === "translate") {
    return [
      ...lexemes.slice(0, 3).map((lexeme) => translateWord(lexeme, source, target)),
      ...sentences.slice(0, 3).map((sentence) => translateSentence(sentence, source, target)),
      ...lexemes.slice(3, 5).map((lexeme) => typeWord(lexeme, source, target)),
    ];
  }
  if (role === "reading") {
    return [
      ...sentences.slice(0, 3).map((sentence) => mcSentence(sentence, sentences, source, target)),
      ...readingChecks(sentences, source, target),
    ];
  }
  if (role === "listening") {
    return sentences.slice(0, 5).map((sentence) => mcSentence(sentence, sentences, target, source));
  }
  return reviewQuestions(input);
}

function readingChecks(
  sentences: Sentence[],
  source: LanguageCode,
  target: LanguageCode,
): DraftQuestion[] {
  const first = sentences[0];
  const second = sentences[1];
  if (!first || !second) {
    return [];
  }
  const trueLine = sentenceOf(first, target);
  const falseLine = corruptLine(sentenceOf(second, target), target);
  return [
    trueFalse(`True or false: ${sentenceOf(first, source)} → ${trueLine}`, true, trueLine, trueLine),
    trueFalse(`True or false: ${sentenceOf(second, source)} → ${falseLine}`, false, falseLine, falseLine),
  ];
}

function corruptLine(text: string, language: LanguageCode): string {
  if (language === "EN") {
    return text.replace(/\bI am\b/i, "I are");
  }
  if (language === "RU") {
    return text.replace(/\bЯ\b/, "Мы");
  }
  return text.includes("եմ") ? text.replace("եմ", "ես") : `ես ${text}`;
}

function reviewQuestions(input: A1Input): DraftQuestion[] {
  const { lexemes, sentences, source, target, unitKey } = input;
  const drills = drillsFor(unitKey, input.slug).slice(0, 2);
  return [
    ...lexemes.slice(0, 3).map((lexeme) => mcWord(lexeme, lexemes, source, target)),
    ...drills.map((drill) =>
      choiceQuestion(drill.prompt, drill.correct, drill.wrong, `rev:${drill.correct}`, drill.explanation),
    ),
    ...sentences.slice(0, 2).map((sentence) => wordOrder(sentence, source, target)),
    ...sentences.slice(2, 4).map((sentence) => translateSentence(sentence, source, target)),
  ];
}
