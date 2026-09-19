import type { LanguageCode } from "@prisma/client";
import { buildA1Lessons } from "./build-a1-lessons";
import type { BuiltLesson } from "./build-course";
import {
  exampleSentences,
  uniqueSentences,
  type Sentence,
} from "./text";
import type { CefrLevel, Lexeme } from "./types";
import type { A1UnitKey } from "./lexicon-a1";
import {
  choiceQuestion,
  mcSentence,
  mcWord,
  translateSentence,
  translateWord,
  typeSentence,
  typeWord,
  withOrder,
  wordOrder,
} from "./build-items";
import { laterDrillsFor } from "./grammar-later";

export type LessonInput = {
  level: CefrLevel;
  unitKey: string;
  lexemes: Lexeme[];
  sentences: Sentence[];
  source: LanguageCode;
  target: LanguageCode;
  titles: string[];
  description: string;
  slug: string;
};

export function buildUnitLessons(input: LessonInput): BuiltLesson[] {
  if (input.level === "A1") {
    return buildA1Lessons({
      unitKey: input.unitKey as A1UnitKey,
      lexemes: input.lexemes,
      sentences: input.sentences,
      source: input.source,
      target: input.target,
      slug: input.slug,
    });
  }
  if (input.level === "A2") {
    return buildA2Lessons(input);
  }
  return buildB1Lessons(input);
}

function buildA2Lessons(input: LessonInput): BuiltLesson[] {
  const { lexemes, sentences, source, target } = input;
  const extras = exampleSentences(lexemes);
  const pool = uniqueSentences([...sentences, ...extras]);
  const grammar = grammarQuestions(input);
  const recognition = withOrder([
    ...lexemes.slice(0, 4).map((lexeme) => mcWord(lexeme, lexemes, source, target)),
    ...lexemes.slice(4, 6).map((lexeme) => mcWord(lexeme, lexemes, target, source)),
    ...lexemes.slice(0, 2).map((lexeme) => translateWord(lexeme, source, target)),
    ...sentences.slice(0, 2).map((sentence) => mcSentence(sentence, pool, source, target)),
    ...grammar.slice(0, 2),
  ]);
  const production = withOrder([
    ...lexemes.slice(0, 3).map((lexeme) => typeWord(lexeme, source, target)),
    ...sentences.slice(0, 2).map((sentence) => translateSentence(sentence, source, target)),
    ...extras.slice(0, 2).map((sentence) => typeSentence(sentence, source, target)),
    ...pool.slice(0, 3).map((sentence) => wordOrder(sentence, source, target)),
    ...grammar.slice(2),
  ]);
  return pairLessons(input, recognition, production, lexemes.slice(0, 6));
}

function buildB1Lessons(input: LessonInput): BuiltLesson[] {
  const { lexemes, sentences, source, target } = input;
  const pool = uniqueSentences([...sentences, ...exampleSentences(lexemes)]);
  const grammar = grammarQuestions(input);
  const recognition = withOrder([
    ...pool.slice(0, 3).map((sentence) => mcSentence(sentence, pool, source, target)),
    ...lexemes.slice(0, 2).map((lexeme) => mcWord(lexeme, lexemes, target, source)),
    ...lexemes.slice(2, 5).map((lexeme) => translateWord(lexeme, source, target)),
    ...grammar.slice(0, 2),
  ]);
  const production = withOrder([
    ...lexemes.slice(5, 8).map((lexeme) => typeWord(lexeme, source, target)),
    ...pool.slice(0, 3).map((sentence) => translateSentence(sentence, source, target)),
    ...pool.slice(3, 5).map((sentence) => typeSentence(sentence, source, target)),
    ...pool.slice(0, 3).map((sentence) => wordOrder(sentence, source, target)),
    ...grammar.slice(2),
  ]);
  return pairLessons(input, recognition, production, lexemes.slice(0, 6));
}

function grammarQuestions(input: LessonInput) {
  return laterDrillsFor(input.unitKey, input.slug, input.level).map((drill) => ({
    ...choiceQuestion(drill.prompt, drill.correct, drill.wrong, drill.correct, drill.explanation),
    role: "grammar",
  }));
}

function pairLessons(
  input: LessonInput,
  recognition: ReturnType<typeof withOrder>,
  production: ReturnType<typeof withOrder>,
  firstKeys: Lexeme[],
): BuiltLesson[] {
  const allKeys = input.lexemes.map((item) => `${input.slug}:${item.key}`);
  return [
    {
      title: input.titles[0] ?? "Recognize",
      description: input.description,
      order: 1,
      questions: recognition,
      wordKeys: firstKeys.map((item) => `${input.slug}:${item.key}`),
    },
    {
      title: input.titles[1] ?? "Use",
      description: input.description,
      order: 2,
      questions: production,
      wordKeys: allKeys,
    },
  ];
}
