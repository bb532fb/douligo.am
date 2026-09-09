import type { LanguageCode, QuestionType } from "@prisma/client";
import { LEXICON, SENTENCES, type Lexeme } from "./lexicon";
import { UNIT_LEVEL, UNIT_META, UNIT_ORDER, type CourseSeed } from "./courses";

export type BuiltOption = { text: string; isCorrect: boolean; order: number };

export type BuiltQuestion = {
  type: QuestionType;
  prompt: string;
  explanation: string;
  order: number;
  acceptedAnswers: string[];
  payload: { tokens: string[]; correctOrder: string[] } | null;
  options: BuiltOption[];
};

export type BuiltLesson = {
  title: string;
  description: string;
  order: number;
  questions: BuiltQuestion[];
  wordKeys: string[];
};

export type BuiltUnit = {
  title: string;
  description: string;
  order: number;
  level: string;
  lessons: BuiltLesson[];
};

export type BuiltWord = {
  key: string;
  sourceText: string;
  targetText: string;
  pronunciation: string;
  exampleSentence: string;
};

function textOf(lexeme: Lexeme, language: LanguageCode): string {
  if (language === "HY") return lexeme.hy;
  if (language === "RU") return lexeme.ru;
  return lexeme.en;
}

function pronOf(lexeme: Lexeme, language: LanguageCode): string {
  if (language === "HY") return lexeme.hyPron;
  if (language === "RU") return lexeme.ruPron;
  return lexeme.enPron;
}

function exampleOf(lexeme: Lexeme, language: LanguageCode): string {
  if (language === "HY") return lexeme.exampleHy;
  if (language === "RU") return lexeme.exampleRu;
  return lexeme.exampleEn;
}

function sentenceOf(
  sentence: { hy: string; en: string; ru: string },
  language: LanguageCode,
): string {
  if (language === "HY") return sentence.hy;
  if (language === "RU") return sentence.ru;
  return sentence.en;
}

function tokensOf(value: string): string[] {
  return value
    .replace(/[?!.,։՞՝;]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function distractors(lexemes: Lexeme[], current: Lexeme, language: LanguageCode): string[] {
  return lexemes
    .filter((item) => item.key !== current.key)
    .map((item) => textOf(item, language))
    .slice(0, 3);
}

function mcQuestion(
  lexeme: Lexeme,
  unitLexemes: Lexeme[],
  source: LanguageCode,
  target: LanguageCode,
  order: number,
): BuiltQuestion {
  const correct = textOf(lexeme, target);
  const options = [correct, ...distractors(unitLexemes, lexeme, target)].slice(0, 4);
  return {
    type: "MULTIPLE_CHOICE",
    prompt: textOf(lexeme, source),
    explanation: `${textOf(lexeme, source)} → ${correct}`,
    order,
    acceptedAnswers: [correct],
    payload: null,
    options: options.map((text, index) => ({
      text,
      isCorrect: text === correct,
      order: index,
    })),
  };
}

function typeQuestion(lexeme: Lexeme, source: LanguageCode, target: LanguageCode, order: number): BuiltQuestion {
  const correct = textOf(lexeme, target);
  return {
    type: "TYPE_ANSWER",
    prompt: textOf(lexeme, source),
    explanation: `${textOf(lexeme, source)} → ${correct}`,
    order,
    acceptedAnswers: [correct],
    payload: null,
    options: [],
  };
}

function translateQuestion(
  lexeme: Lexeme,
  source: LanguageCode,
  target: LanguageCode,
  order: number,
): BuiltQuestion {
  const correct = textOf(lexeme, target);
  return {
    type: "TRANSLATE",
    prompt: textOf(lexeme, source),
    explanation: `${textOf(lexeme, source)} → ${correct}`,
    order,
    acceptedAnswers: [correct],
    payload: null,
    options: [],
  };
}

function wordOrderQuestion(
  sentence: { hy: string; en: string; ru: string },
  source: LanguageCode,
  target: LanguageCode,
  order: number,
): BuiltQuestion {
  const prompt = sentenceOf(sentence, source);
  const targetSentence = sentenceOf(sentence, target);
  const correctOrder = tokensOf(targetSentence);
  const tokens = [...correctOrder].sort((left, right) => left.localeCompare(right));
  return {
    type: "WORD_ORDER",
    prompt,
    explanation: targetSentence,
    order,
    acceptedAnswers: [targetSentence],
    payload: { tokens, correctOrder },
    options: [],
  };
}

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
    const sentences = SENTENCES[unitKey];

    for (const lexeme of lexemes) {
      words.push({
        key: `${course.slug}:${lexeme.key}`,
        sourceText: textOf(lexeme, course.sourceLanguage),
        targetText: textOf(lexeme, course.targetLanguage),
        pronunciation: pronOf(lexeme, course.targetLanguage),
        exampleSentence: exampleOf(lexeme, course.targetLanguage),
      });
    }

    const recognition: BuiltQuestion[] = lexemes.slice(0, 6).map((lexeme, index) =>
      mcQuestion(lexeme, lexemes, course.sourceLanguage, course.targetLanguage, index + 1),
    );
    recognition.push(
      ...lexemes.slice(0, 4).map((lexeme, index) =>
        translateQuestion(lexeme, course.sourceLanguage, course.targetLanguage, recognition.length + index + 1),
      ),
    );

    const production: BuiltQuestion[] = lexemes.slice(0, 5).map((lexeme, index) =>
      typeQuestion(lexeme, course.sourceLanguage, course.targetLanguage, index + 1),
    );
    production.push(
      ...sentences.map((sentence, index) =>
        wordOrderQuestion(sentence, course.sourceLanguage, course.targetLanguage, production.length + index + 1),
      ),
    );
    production.push(
      ...lexemes.slice(5, 8).map((lexeme, index) =>
        translateQuestion(lexeme, course.sourceLanguage, course.targetLanguage, production.length + index + 1),
      ),
    );

    return {
      title: meta.title,
      description: meta.description,
      order: unitIndex + 1,
      level: UNIT_LEVEL[unitKey],
      lessons: [
        {
          title: meta.lessons[0],
          description: meta.description,
          order: 1,
          questions: recognition,
          wordKeys: lexemes.slice(0, 6).map((item) => `${course.slug}:${item.key}`),
        },
        {
          title: meta.lessons[1],
          description: meta.description,
          order: 2,
          questions: production,
          wordKeys: lexemes.map((item) => `${course.slug}:${item.key}`),
        },
      ],
    };
  });

  return { units, words };
}
