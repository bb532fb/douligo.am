import type { A2UnitKey } from "./lexicon-a2";

export const UNIT_META_A2: Record<
  A2UnitKey,
  Record<string, { title: string; description: string; lessons: [string, string] }>
> = {
  food: {
    "hy-en": {
      title: "Սնունդ",
      description: "Ուտելիք, խմիչք և ռեստորան",
      lessons: ["Ճանաչում", "Գործածում"],
    },
    "en-hy": {
      title: "Food",
      description: "Food, drink, and eating out",
      lessons: ["Recognize", "Use"],
    },
    "ru-hy": {
      title: "Еда",
      description: "Еда, напитки и ресторан",
      lessons: ["Узнавание", "Применение"],
    },
    "hy-ru": {
      title: "Սնունդ",
      description: "Ուտելիք, խմիչք և ռեստորան",
      lessons: ["Ճանաչում", "Գործածում"],
    },
  },
  routine: {
    "hy-en": {
      title: "Առօրյա",
      description: "Այսօր, հիմա և օրվա ժամեր",
      lessons: ["Ճանաչում", "Գործածում"],
    },
    "en-hy": {
      title: "Daily life",
      description: "Today, now, and times of day",
      lessons: ["Recognize", "Use"],
    },
    "ru-hy": {
      title: "Распорядок",
      description: "Сегодня, сейчас и время суток",
      lessons: ["Узнавание", "Применение"],
    },
    "hy-ru": {
      title: "Առօրյա",
      description: "Այսօր, հիմա և օրվա ժամեր",
      lessons: ["Ճանաչում", "Գործածում"],
    },
  },
  city: {
    "hy-en": {
      title: "Քաղաք",
      description: "Տուն, դպրոց, խանութ և փողոց",
      lessons: ["Ճանաչում", "Գործածում"],
    },
    "en-hy": {
      title: "The city",
      description: "Home, school, shops, and streets",
      lessons: ["Recognize", "Use"],
    },
    "ru-hy": {
      title: "Город",
      description: "Дом, школа, магазин и улица",
      lessons: ["Узнавание", "Применение"],
    },
    "hy-ru": {
      title: "Քաղաք",
      description: "Տուն, դպրոց, խանութ և փողոց",
      lessons: ["Ճանաչում", "Գործածում"],
    },
  },
  travel: {
    "hy-en": {
      title: "Ճամփորդություն",
      description: "Ավտոբուս, տոմս, հյուրանոց",
      lessons: ["Ճանաչում", "Գործածում"],
    },
    "en-hy": {
      title: "Travel",
      description: "Bus, tickets, hotel, and airport",
      lessons: ["Recognize", "Use"],
    },
    "ru-hy": {
      title: "Поездки",
      description: "Автобус, билет, гостиница",
      lessons: ["Узнавание", "Применение"],
    },
    "hy-ru": {
      title: "Ճամփորդություն",
      description: "Ավտոբուս, տոմս, հյուրանոց",
      lessons: ["Ճանաչում", "Գործածում"],
    },
  },
};
