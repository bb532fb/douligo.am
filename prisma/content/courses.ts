import type { LanguageCode } from "@prisma/client";
import type { UnitKey } from "./lexicon";

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
    description: "Անգլերեն A1՝ հայերենից սկսողների համար։",
  },
  {
    slug: "en-hy",
    sourceLanguage: "EN",
    targetLanguage: "HY",
    title: "Անգլերենից հայերեն",
    description: "Հայերեն A1՝ անգլերեն խոսողների համար։",
  },
  {
    slug: "ru-hy",
    sourceLanguage: "RU",
    targetLanguage: "HY",
    title: "Ռուսերենից հայերեն",
    description: "Հայերեն A1՝ ռուսերեն խոսողների համար։",
  },
  {
    slug: "hy-ru",
    sourceLanguage: "HY",
    targetLanguage: "RU",
    title: "Հայերենից ռուսերեն",
    description: "Ռուսերեն A1՝ հայերենից սկսողների համար։",
  },
];

export const UNIT_META: Record<
  UnitKey,
  Record<string, { title: string; description: string; lessons: [string, string] }>
> = {
  "greetings": {
    "hy-en": {
      "title": "Ողջույններ",
      "description": "Առօրյա ողջույններ և քաղաքավարություն",
      "lessons": [
        "Ճանաչում",
        "Գործածում"
      ]
    },
    "en-hy": {
      "title": "Greetings",
      "description": "Everyday greetings and courtesy",
      "lessons": [
        "Recognize",
        "Use"
      ]
    },
    "ru-hy": {
      "title": "Приветствия",
      "description": "Повседневные приветствия",
      "lessons": [
        "Узнавание",
        "Применение"
      ]
    },
    "hy-ru": {
      "title": "Ողջույններ",
      "description": "Առօրյա ողջույններ ռուսերեն",
      "lessons": [
        "Ճանաչում",
        "Գործածում"
      ]
    }
  },
  "introduce": {
    "hy-en": {
      "title": "Ինքնաներկայացում",
      "description": "Անուն, ծագում, մասնագիտություն",
      "lessons": [
        "Հիմնական արտահայտություններ",
        "Նախադասություններ"
      ]
    },
    "en-hy": {
      "title": "Introducing yourself",
      "description": "Name, origin, occupation",
      "lessons": [
        "Core phrases",
        "Sentences"
      ]
    },
    "ru-hy": {
      "title": "Знакомство",
      "description": "Имя, происхождение, профессия",
      "lessons": [
        "Фразы",
        "Предложения"
      ]
    },
    "hy-ru": {
      "title": "Ինքնաներկայացում",
      "description": "Անուն, ծագում, մասնագիտություն",
      "lessons": [
        "Հիմնական արտահայտություններ",
        "Նախադասություններ"
      ]
    }
  },
  "family": {
    "hy-en": {
      "title": "Ընտանիք",
      "description": "Ընտանիքի անդամներ",
      "lessons": [
        "Բառեր",
        "Նկարագրություն"
      ]
    },
    "en-hy": {
      "title": "Family",
      "description": "Family members",
      "lessons": [
        "Words",
        "Description"
      ]
    },
    "ru-hy": {
      "title": "Семья",
      "description": "Члены семьи",
      "lessons": [
        "Слова",
        "Описание"
      ]
    },
    "hy-ru": {
      "title": "Ընտանիք",
      "description": "Ընտանիքի անդամներ",
      "lessons": [
        "Բառեր",
        "Նկարագրություն"
      ]
    }
  },
  "numbers": {
    "hy-en": {
      "title": "Թվեր",
      "description": "1-ից 10 հիմնական թվեր",
      "lessons": [
        "Թվեր",
        "Գործնական"
      ]
    },
    "en-hy": {
      "title": "Numbers",
      "description": "Core numbers 1 to 10",
      "lessons": [
        "Numbers",
        "Practice"
      ]
    },
    "ru-hy": {
      "title": "Числа",
      "description": "Основные числа от 1 до 10",
      "lessons": [
        "Числа",
        "Практика"
      ]
    },
    "hy-ru": {
      "title": "Թվեր",
      "description": "1-ից 10 հիմնական թվեր",
      "lessons": [
        "Թվեր",
        "Գործնական"
      ]
    }
  }
};

export const UNIT_ORDER: UnitKey[] = ["greetings", "introduce", "family", "numbers"];
