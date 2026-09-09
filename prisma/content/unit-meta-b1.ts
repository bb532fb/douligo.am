import type { B1UnitKey } from "./lexicon-b1";

export const UNIT_META_B1: Record<
  B1UnitKey,
  Record<string, { title: string; description: string; lessons: [string, string] }>
> = {
  work: {
    "hy-en": { title: "Աշխատանք", description: "Աշխատանք, գրասենյակ, հանդիպում և փորձ", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "Work", description: "Job, office, meetings, and experience", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Работа", description: "Работа, офис, встречи и опыт", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Աշխատանք", description: "Աշխատանք, գրասենյակ, հանդիպում և փորձ", lessons: ["Ճանաչում", "Գործածում"] },
  },
  health: {
    "hy-en": { title: "Առողջություն", description: "Բժիշկ, դեղ և ինքնազգացողություն", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "Health", description: "Doctor, medicine, and how you feel", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Здоровье", description: "Врач, лекарство и самочувствие", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Առողջություն", description: "Բժիշկ, դեղ և ինքնազգացողություն", lessons: ["Ճանաչում", "Գործածում"] },
  },
  opinions: {
    "hy-en": { title: "Կարծիք", description: "Կարծում եմ, նախընտրում եմ և որովհետև", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "Opinions", description: "I think, I prefer, and because", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Мнения", description: "Я думаю, я предпочитаю и потому что", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Կարծիք", description: "Կարծում եմ, նախընտրում եմ և որովհետև", lessons: ["Ճանաչում", "Գործածում"] },
  },
  plans: {
    "hy-en": { title: "Ծրագրեր", description: "Եթե, երբ, արդեն և կուզենայի", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "Plans", description: "If, when, already, and I would like", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Планы", description: "Если, когда, уже и я хотел бы", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Ծրագրեր", description: "Եթե, երբ, արդեն և կուզենայի", lessons: ["Ճանաչում", "Գործածում"] },
  },
  experiences: {
    "hy-en": { title: "Փորձառություն", description: "Անցյալ տարի, եղել եմ և հիշում եմ", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "Experiences", description: "Last year, I have been, and I remember", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Опыт", description: "В прошлом году, я бывал и я помню", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Փորձառություն", description: "Անցյալ տարի, եղել եմ և հիշում եմ", lessons: ["Ճանաչում", "Գործածում"] },
  },
  reasons: {
    "hy-en": { title: "Պատճառներ", description: "Իմ կարծիքով, չնայած և օրինակ", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "Reasons", description: "In my opinion, although, and for example", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Причины", description: "По-моему, хотя и например", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Պատճառներ", description: "Իմ կարծիքով, չնայած և օրինակ", lessons: ["Ճանաչում", "Գործածում"] },
  },
};
