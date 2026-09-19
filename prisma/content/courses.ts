import type { LanguageCode } from "@prisma/client";
import type { UnitKey } from "./lexicon";
import { UNIT_META_A1 } from "./unit-meta-a1";
import { UNIT_META_A2 } from "./unit-meta-a2";
import { UNIT_META_B1 } from "./unit-meta-b1";
import type { CefrLevel } from "./types";

export type CourseSeed = {
  slug: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  title: string;
  description: string;
};

export const COURSE_SEEDS: CourseSeed[] = [
  {
    slug: "hy-en",
    sourceLanguage: "HY",
    targetLanguage: "EN",
    title: "Հայերենից անգլերեն",
    description: "Անգլերեն A1–B1 ուղի՝ ներկայից մինչև կարծիք և ծրագրեր։",
  },
  {
    slug: "en-hy",
    sourceLanguage: "EN",
    targetLanguage: "HY",
    title: "Անգլերենից հայերեն",
    description: "Հայերեն A1–B1 ուղի՝ ներկայից մինչև կարծիք և ծրագրեր։",
  },
  {
    slug: "ru-hy",
    sourceLanguage: "RU",
    targetLanguage: "HY",
    title: "Ռուսերենից հայերեն",
    description: "Հայերեն A1–B1 ուղի՝ ներկայից մինչև կարծիք և ծրագրեր։",
  },
  {
    slug: "hy-ru",
    sourceLanguage: "HY",
    targetLanguage: "RU",
    title: "Հայերենից ռուսերեն",
    description: "Ռուսերեն A1–B1 ուղի՝ ներկայից մինչև կարծիք և ծրագրեր։",
  },
];

export const UNIT_META: Record<
  UnitKey,
  Record<string, { title: string; description: string; lessons: string[] }>
> = {
  ...UNIT_META_A1,
  ...UNIT_META_A2,
  ...UNIT_META_B1,
};

export const UNIT_LEVEL: Record<UnitKey, CefrLevel> = {
  greetings: "A1",
  introduce: "A1",
  family: "A1",
  numbers: "A1",
  food: "A1",
  places: "A1",
  routine: "A1",
  shopping: "A1",
  hobbies: "A1",
  school: "A1",
  everyday: "A1",
  review: "A1",
  city: "A2",
  travel: "A2",
  past: "A2",
  future: "A2",
  compare: "A2",
  invites: "A2",
  work: "B1",
  health: "B1",
  opinions: "B1",
  plans: "B1",
  experiences: "B1",
  reasons: "B1",
};

export const UNIT_ORDER: UnitKey[] = [
  "greetings",
  "introduce",
  "family",
  "numbers",
  "food",
  "places",
  "routine",
  "shopping",
  "hobbies",
  "school",
  "everyday",
  "review",
  "city",
  "travel",
  "past",
  "future",
  "compare",
  "invites",
  "work",
  "health",
  "opinions",
  "plans",
  "experiences",
  "reasons",
];
