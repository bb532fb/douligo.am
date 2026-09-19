import type { LanguageCode } from "@prisma/client";
import type { BuiltOption, BuiltQuestion } from "./build-course";
import { sentenceOf, textOf, tokensOf, type Sentence } from "./text";
import type { Lexeme } from "./types";

export type DraftQuestion = Omit<BuiltQuestion, "order">;

export function withOrder(questions: DraftQuestion[]): BuiltQuestion[] {
  return questions.map((question, index) => ({ ...question, order: index + 1 }));
}

export function mcWord(
  lexeme: Lexeme,
  unitLexemes: Lexeme[],
  promptLang: LanguageCode,
  answerLang: LanguageCode,
): DraftQuestion {
  const correct = textOf(lexeme, answerLang);
  return choiceQuestion(
    textOf(lexeme, promptLang),
    correct,
    pickDistractors(
      unitLexemes.map((item) => textOf(item, answerLang)),
      correct,
    ),
    `${lexeme.key}:${promptLang}:${answerLang}`,
  );
}

export function mcSentence(
  sentence: Sentence,
  pool: Sentence[],
  source: LanguageCode,
  target: LanguageCode,
): DraftQuestion {
  const correct = sentenceOf(sentence, target);
  return choiceQuestion(
    sentenceOf(sentence, source),
    correct,
    pickDistractors(
      pool.map((item) => sentenceOf(item, target)),
      correct,
    ),
    `sent:${correct}`,
  );
}

export function choiceQuestion(
  prompt: string,
  correct: string,
  wrong: string[],
  seed: string,
  explanation = `${prompt} → ${correct}`,
): DraftQuestion {
  return {
    type: "MULTIPLE_CHOICE",
    prompt,
    explanation,
    acceptedAnswers: [correct],
    payload: null,
    options: shuffleOptions(correct, wrong, seed),
  };
}

export function trueFalse(
  prompt: string,
  isTrue: boolean,
  seed: string,
  explanation: string,
): DraftQuestion {
  return choiceQuestion(prompt, isTrue ? "True" : "False", [isTrue ? "False" : "True"], seed, explanation);
}

export function typeWord(lexeme: Lexeme, source: LanguageCode, target: LanguageCode): DraftQuestion {
  return typedQuestion("TYPE_ANSWER", textOf(lexeme, source), textOf(lexeme, target));
}

export function translateWord(lexeme: Lexeme, source: LanguageCode, target: LanguageCode): DraftQuestion {
  return typedQuestion("TRANSLATE", textOf(lexeme, source), textOf(lexeme, target));
}

export function typeSentence(sentence: Sentence, source: LanguageCode, target: LanguageCode): DraftQuestion {
  return typedQuestion("TYPE_ANSWER", sentenceOf(sentence, source), sentenceOf(sentence, target));
}

export function translateSentence(
  sentence: Sentence,
  source: LanguageCode,
  target: LanguageCode,
): DraftQuestion {
  return typedQuestion("TRANSLATE", sentenceOf(sentence, source), sentenceOf(sentence, target));
}

export function typedQuestion(
  type: "TYPE_ANSWER" | "TRANSLATE",
  prompt: string,
  correct: string,
  explanation = `${prompt} → ${correct}`,
): DraftQuestion {
  return {
    type,
    prompt,
    explanation,
    acceptedAnswers: [correct],
    payload: null,
    options: [],
  };
}

export function wordOrder(sentence: Sentence, source: LanguageCode, target: LanguageCode): DraftQuestion {
  const prompt = sentenceOf(sentence, source);
  const targetSentence = sentenceOf(sentence, target);
  const correctOrder = tokensOf(targetSentence);
  return {
    type: "WORD_ORDER",
    prompt,
    explanation: targetSentence,
    acceptedAnswers: [targetSentence],
    payload: { tokens: seededShuffle(correctOrder, targetSentence), correctOrder },
    options: [],
  };
}

export function pickDistractors(candidates: string[], correct: string): string[] {
  return candidates
    .filter((text) => text !== correct)
    .sort((left, right) => Math.abs(left.length - correct.length) - Math.abs(right.length - correct.length))
    .slice(0, 3);
}

function shuffleOptions(correct: string, wrong: string[], seed: string): BuiltOption[] {
  const unique = [...new Set([correct, ...wrong])].slice(0, 4);
  return seededShuffle(unique, seed).map((text, index) => ({
    text,
    isCorrect: text === correct,
    order: index,
  }));
}

export function seededShuffle<T>(items: T[], seed: string): T[] {
  const result = [...items];
  let state = hashSeed(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swap = state % (index + 1);
    const current = result[index];
    const other = result[swap];
    if (current === undefined || other === undefined) {
      continue;
    }
    result[index] = other;
    result[swap] = current;
  }
  return result;
}

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
