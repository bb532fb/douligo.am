import type { A2UnitKey } from "./lexicon-a2";

export const UNIT_META_A2: Record<
  A2UnitKey,
  Record<string, { title: string; description: string; lessons: [string, string] }>
> = {
  routine: {
    "hy-en": { title: "Առօրյա", description: "Այսօր, հաճախականություն և օրվա ժամեր", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "Daily life", description: "Today, frequency, and times of day", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Распорядок", description: "Сегодня, частота и время суток", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Առօրյա", description: "Այսօր, հաճախականություն և օրվա ժամեր", lessons: ["Ճանաչում", "Գործածում"] },
  },
  city: {
    "hy-en": { title: "Քաղաք", description: "Փողոց, ուղղություն, մոտ և հեռու", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "The city", description: "Streets, directions, near and far", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Город", description: "Улица, направление, близко и далеко", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Քաղաք", description: "Փողոց, ուղղություն, մոտ և հեռու", lessons: ["Ճանաչում", "Գործածում"] },
  },
  travel: {
    "hy-en": { title: "Ճամփորդություն", description: "Տոմս, կայարան, ավտոբուս և հյուրանոց", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "Travel", description: "Tickets, station, bus, and hotel", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Поездки", description: "Билет, вокзал, автобус и гостиница", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Ճամփորդություն", description: "Տոմս, կայարան, ավտոբուս և հյուրանոց", lessons: ["Ճանաչում", "Գործածում"] },
  },
  shopping: {
    "hy-en": { title: "Գնումներ", description: "Գնել, գին, էժան և թանկ", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "Shopping", description: "Buy, price, cheap, and expensive", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Покупки", description: "Купить, цена, дешёвый и дорогой", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Գնումներ", description: "Գնել, գին, էժան և թանկ", lessons: ["Ճանաչում", "Գործածում"] },
  },
  past: {
    "hy-en": { title: "Անցյալ", description: "Երեկ, գնացի, էի և տեսա", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "The past", description: "Yesterday, I went, I was, I saw", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Прошлое", description: "Вчера, я пошёл, я был, я видел", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Անցյալ", description: "Երեկ, գնացի, էի և տեսա", lessons: ["Ճանաչում", "Գործածում"] },
  },
  future: {
    "hy-en": { title: "Ապագա", description: "Վաղը, կգնամ, կարող եմ և պետք է", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "The future", description: "Tomorrow, I will go, I can, I need", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Будущее", description: "Завтра, я пойду, я могу, мне нужно", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Ապագա", description: "Վաղը, կգնամ, կարող եմ և պետք է", lessons: ["Ճանաչում", "Գործածում"] },
  },
};
