import type { LanguageCode } from "@prisma/client";
import type { Lexeme } from "./types";

export type Sentence = { hy: string; en: string; ru: string };

function pick(language: LanguageCode, hy: string, ru: string, en: string): string {
  if (language === "HY") {
    return hy;
  }
  if (language === "RU") {
    return ru;
  }
  return en;
}

export function textOf(lexeme: Lexeme, language: LanguageCode): string {
  return pick(language, lexeme.hy, lexeme.ru, lexeme.en);
}

export function pronOf(lexeme: Lexeme, language: LanguageCode): string {
  return pick(language, lexeme.hyPron, lexeme.ruPron, lexeme.enPron);
}

export function exampleOf(lexeme: Lexeme, language: LanguageCode): string {
  return pick(language, lexeme.exampleHy, lexeme.exampleRu, lexeme.exampleEn);
}

export function sentenceOf(sentence: Sentence, language: LanguageCode): string {
  return pick(language, sentence.hy, sentence.ru, sentence.en);
}

export function tokensOf(value: string): string[] {
  return value
    .replace(/[?!.,։՞՝;]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

export function exampleSentences(lexemes: Lexeme[]): Sentence[] {
  return uniqueSentences(
    lexemes.map((lexeme) => ({
      hy: lexeme.exampleHy,
      en: lexeme.exampleEn,
      ru: lexeme.exampleRu,
    })),
  );
}

export function uniqueSentences(sentences: Sentence[]): Sentence[] {
  const seen = new Set<string>();
  return sentences.filter((sentence) => {
    const key = `${sentence.hy}|${sentence.en}|${sentence.ru}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
