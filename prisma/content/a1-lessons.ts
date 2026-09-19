export const A1_LESSON_ROLES = [
  "vocab",
  "grammar",
  "sentences",
  "translate",
  "reading",
  "listening",
  "review",
] as const;

export type A1LessonRole = (typeof A1_LESSON_ROLES)[number];

const HY_TITLES = [
  "Բառապաշար",
  "Քերականություն",
  "Նախադասություն",
  "Թարգմանություն",
  "Կարդալ",
  "Լսել",
  "Կրկնություն",
];

const HY_GOALS = [
  "Ճանաչիր և հիշիր թեմայի բառերը։",
  "Կիրառիր այս unit-ի քերականությունը հայերենի և թիրախ լեզվի հակադրությամբ։",
  "Կազմիր իրական նախադասություններ ճիշտ բառակարգով։",
  "Թարգմանիր հայերենից թիրախ լեզու և հակառակը։",
  "Հասկացիր կարճ տեքստ և երկխոսություն։",
  "Լսիր կարճ արտահայտություն և ընտրիր իմաստը։",
  "Կրկնիր բառը, քերականությունը և սխալ թարգմանությունները։",
];

export const A1_LESSON_TITLES: Record<string, string[]> = {
  "hy-en": HY_TITLES,
  "en-hy": ["Vocabulary", "Grammar", "Sentences", "Translation", "Reading", "Listening", "Review"],
  "ru-hy": ["Слова", "Грамматика", "Предложения", "Перевод", "Чтение", "Аудирование", "Повтор"],
  "hy-ru": HY_TITLES,
};

export const A1_LESSON_GOALS: Record<string, string[]> = {
  "hy-en": HY_GOALS,
  "en-hy": [
    "Recognize and remember the unit words.",
    "Use this unit's grammar with clear form contrasts.",
    "Build real sentences in the right word order.",
    "Translate in both directions.",
    "Understand a short text or dialogue.",
    "Hear a short phrase and choose the meaning.",
    "Review words, grammar, and typical mistakes.",
  ],
  "ru-hy": [
    "Узнай и запомни слова темы.",
    "Примени грамматику урока.",
    "Собери живые предложения.",
    "Переведи в обе стороны.",
    "Пойми короткий текст или диалог.",
    "Услышь короткую фразу и выбери смысл.",
    "Повтори слова, грамматику и типичные ошибки.",
  ],
  "hy-ru": HY_GOALS,
};

export function a1LessonTitles(slug: string): string[] {
  return A1_LESSON_TITLES[slug] ?? A1_LESSON_TITLES["en-hy"] ?? [];
}

export function a1LessonGoals(slug: string): string[] {
  return A1_LESSON_GOALS[slug] ?? A1_LESSON_GOALS["en-hy"] ?? [];
}
