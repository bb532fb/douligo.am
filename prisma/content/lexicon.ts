import { LEXICON_A1, SENTENCES_A1, type A1UnitKey } from "./lexicon-a1";
import { LEXICON_A2, SENTENCES_A2, type A2UnitKey } from "./lexicon-a2";
import { LEXICON_B1, SENTENCES_B1, type B1UnitKey } from "./lexicon-b1";
import type { Lexeme } from "./types";

export type { Lexeme } from "./types";
export type { A1UnitKey } from "./lexicon-a1";
export type { A2UnitKey } from "./lexicon-a2";
export type { B1UnitKey } from "./lexicon-b1";

export type UnitKey = A1UnitKey | A2UnitKey | B1UnitKey;

export const LEXICON: Record<UnitKey, Lexeme[]> = {
  ...LEXICON_A1,
  ...LEXICON_A2,
  ...LEXICON_B1,
};

export const SENTENCES: Record<UnitKey, Array<{ hy: string; en: string; ru: string }>> = {
  ...SENTENCES_A1,
  ...SENTENCES_A2,
  ...SENTENCES_B1,
};
