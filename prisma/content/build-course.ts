import type { QuestionType } from "@prisma/client";
import { buildUnitLessons } from "./build-questions";
import { UNIT_LEVEL, UNIT_META, UNIT_ORDER, type CourseSeed } from "./courses";
import { LEXICON, SENTENCES, type UnitKey } from "./lexicon";
import { exampleOf, pronOf, textOf } from "./text";

export type BuiltOption = { text: string; isCorrect: boolean; order: number };

export type BuiltQuestion = {
  type: QuestionType;
  prompt: string;
  explanation: string;
  order: number;
  acceptedAnswers: string[];
  payload: { tokens: string[]; correctOrder: string[] } | null;
  options: BuiltOption[];
  role?: string;
};

export type BuiltLesson = {
  title: string;
  description: string;
  order: number;
  role?: string;
  questions: BuiltQuestion[];
  wordKeys: string[];
};

export type BuiltUnit = {
  title: string;
  description: string;
  order: number;
  level: string;
  unitKey: UnitKey;
  lessons: BuiltLesson[];
};

export type BuiltWord = {
  key: string;
  sourceText: string;
  targetText: string;
  pronunciation: string;
  exampleSentence: string;
};

export function buildCourseContent(course: CourseSeed): {
  units: BuiltUnit[];
  words: BuiltWord[];
} {
  const words: BuiltWord[] = [];
  const units = UNIT_ORDER.map((unitKey, unitIndex) => {
    const meta = UNIT_META[unitKey][course.slug];
    if (!meta) {
      throw new Error(`Missing UNIT_META for ${unitKey} (${course.slug})`);
    }
    const lexemes = LEXICON[unitKey];
    for (const lexeme of lexemes) {
      words.push({
        key: `${course.slug}:${lexeme.key}`,
        sourceText: textOf(lexeme, course.sourceLanguage),
        targetText: textOf(lexeme, course.targetLanguage),
        pronunciation: pronOf(lexeme, course.targetLanguage),
        exampleSentence: exampleOf(lexeme, course.targetLanguage),
      });
    }
    return {
      title: meta.title,
      description: meta.description,
      order: unitIndex + 1,
      level: UNIT_LEVEL[unitKey],
      unitKey,
      lessons: buildUnitLessons({
        level: UNIT_LEVEL[unitKey],
        unitKey,
        lexemes,
        sentences: SENTENCES[unitKey],
        source: course.sourceLanguage,
        target: course.targetLanguage,
        titles: [...meta.lessons],
        description: meta.description,
        slug: course.slug,
      }),
    };
  });

  return { units, words };
}
