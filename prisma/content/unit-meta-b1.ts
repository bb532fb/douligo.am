import type { B1UnitKey } from "./lexicon-b1";

export const UNIT_META_B1: Record<
  B1UnitKey,
  Record<string, { title: string; description: string; lessons: [string, string] }>
> = {
  work: {
    "hy-en": {
      title: "Աշխատանք",
      description: "Աշխատանք, գրասենյակ, հանդիպում և փորձ",
      lessons: ["Ճանաչում", "Գործածում"],
    },
    "en-hy": {
      title: "Work",
      description: "Job, office, meetings, and experience",
      lessons: ["Recognize", "Use"],
    },
    "ru-hy": {
      title: "Работа",
      description: "Работа, офис, встречи и опыт",
      lessons: ["Узнавание", "Применение"],
    },
    "hy-ru": {
      title: "Աշխատանք",
      description: "Աշխատանք, գրասենյակ, հանդիպում և փորձ",
      lessons: ["Ճանաչում", "Գործածում"],
    },
  },
  health: {
    "hy-en": {
      title: "Առողջություն",
      description: "Բժիշկ, դեղ, ինքնազգացողություն",
      lessons: ["Ճանաչում", "Գործածում"],
    },
    "en-hy": {
      title: "Health",
      description: "Doctor, medicine, and how you feel",
      lessons: ["Recognize", "Use"],
    },
    "ru-hy": {
      title: "Здоровье",
      description: "Врач, лекарство и самочувствие",
      lessons: ["Узнавание", "Применение"],
    },
    "hy-ru": {
      title: "Առողջություն",
      description: "Բժիշկ, դեղ, ինքնազգացողություն",
      lessons: ["Ճանաչում", "Գործածում"],
    },
  },
  opinions: {
    "hy-en": {
      title: "Կարծիք",
      description: "Կարծիք, նախընտրություն և պատճառ",
      lessons: ["Ճանաչում", "Գործածում"],
    },
    "en-hy": {
      title: "Opinions",
      description: "Opinions, preferences, and reasons",
      lessons: ["Recognize", "Use"],
    },
    "ru-hy": {
      title: "Мнения",
      description: "Мнение, предпочтение и причина",
      lessons: ["Узнавание", "Применение"],
    },
    "hy-ru": {
      title: "Կարծիք",
      description: "Կարծիք, նախընտրություն և պատճառ",
      lessons: ["Ճանաչում", "Գործածում"],
    },
  },
  plans: {
    "hy-en": {
      title: "Ծրագրեր",
      description: "Անցյալ փորձ և ապագա ծրագրեր",
      lessons: ["Ճանաչում", "Գործածում"],
    },
    "en-hy": {
      title: "Plans",
      description: "Past experience and future plans",
      lessons: ["Recognize", "Use"],
    },
    "ru-hy": {
      title: "Планы",
      description: "Прошлый опыт и планы на будущее",
      lessons: ["Узнавание", "Применение"],
    },
    "hy-ru": {
      title: "Ծրագրեր",
      description: "Անցյալ փորձ և ապագա ծրագրեր",
      lessons: ["Ճանաչում", "Գործածում"],
    },
  },
};
