import type { A1UnitKey } from "./lexicon-a1";

const A1_LESSONS = {
  "hy-en": ["Բառապաշար","Քերականություն","Նախադասություն","Թարգմանություն","Կարդալ","Լսել","Կրկնություն"],
  "en-hy": ["Vocabulary", "Grammar", "Sentences", "Translation", "Reading", "Listening", "Review"],
  "ru-hy": ["Слова", "Грамматика", "Предложения", "Перевод", "Чтение", "Аудирование", "Повтор"],
  "hy-ru": ["Բառապաշար","Քերականություն","Նախադասություն","Թարգմանություն","Կարդալ","Լսել","Կրկնություն"],
} as const;

function meta(
  hy: string,
  en: string,
  ru: string,
  hyEn: string,
  enHy: string,
  ruHy: string,
  hyRu: string,
) {
  return {
    "hy-en": { title: hy, description: hyEn, lessons: [...A1_LESSONS["hy-en"]] },
    "en-hy": { title: en, description: enHy, lessons: [...A1_LESSONS["en-hy"]] },
    "ru-hy": { title: ru, description: ruHy, lessons: [...A1_LESSONS["ru-hy"]] },
    "hy-ru": { title: hy, description: hyRu, lessons: [...A1_LESSONS["hy-ru"]] },
  };
}

export const UNIT_META_A1: Record<
  A1UnitKey,
  Record<string, { title: string; description: string; lessons: string[] }>
> = {
  greetings: meta(
    "Ողջույններ",
    "Greetings & Basics",
    "Приветствия",
    "Առօրյա ողջույններ և to be",
    "Greetings and եմ / ես at the end",
    "Приветствия и եմ / ես в конце",
    "Ողջույններ՝ առանց есть",
  ),
  introduce: meta(
    "Ինքնաներկայացում",
    "Introductions",
    "Знакомство",
    "I am / you are և անուն",
    "Ես ... եմ, իմ անունն է",
    "Ես ... եմ, իմ անունն է",
    "Я студент, Меня зовут՝ առանց есть",
  ),
  family: meta(
    "Ընտանիք",
    "Family & People",
    "Семья",
    "have, my/your և possessive",
    "ունեմ, իմ / քո",
    "ունեմ, իմ / քո",
    "у меня есть և род՝ моя / твой",
  ),
  numbers: meta(
    "Թվեր և ժամանակ",
    "Numbers, Time & Dates",
    "Числа и время",
    "How many և ժամ",
    "թիվ + գոյական, ժամը քանիսն է",
    "число + существительное, ժամը քանիսն է",
    "сколько, один / одна / одно",
  ),
  food: meta(
    "Սնունդ",
    "Food & Drinks",
    "Еда",
    "a/an/the և I want",
    "ուզում եմ, առանց articles",
    "ուզում եմ, без артиклей",
    "хочу, род՝ нужен / нужна",
  ),
  places: meta(
    "Տուն և վայրեր",
    "Home & Places",
    "Дом и места",
    "there is / there are և where",
    "որտեղ է, -ում, կա",
    "որտեղ է, -ում, կա",
    "в / на, есть стул",
  ),
  routine: meta(
    "Առօրյա",
    "Daily Routine",
    "Распорядок",
    "Present Simple, do/does",
    "աշխատում եմ, ամեն օր",
    "աշխատում եմ, ամեն օր",
    "я работаю, в понедельник",
  ),
  shopping: meta(
    "Գնումներ",
    "Shopping & Money",
    "Покупки",
    "How much և can I have",
    "որքան է, կարող եմ",
    "որքան է, կարող եմ",
    "сколько стоит, можно мне",
  ),
  hobbies: meta(
    "Հոբբի",
    "Hobbies & Free Time",
    "Хобби",
    "can / can't",
    "կարող եմ / չեմ կարող",
    "կարող եմ / չեմ կարող",
    "умею / не умею",
  ),
  school: meta(
    "Դպրոց և աշխատանք",
    "School & Work",
    "Школа и работа",
    "at school, in an office",
    "դպրոցում, գրասենյակում",
    "դպրոցում, գրասենյակում",
    "в школе, в офисе",
  ),
  everyday: meta(
    "Առօրյա կյանք",
    "Weather, Clothes & Everyday Life",
    "Погода и одежда",
    "It is cold, adjectives",
    "ցուրտ է, ածական + է",
    "ցուրտ է, прилагательное + է",
    "сегодня холодно, առանց it is",
  ),
  review: meta(
    "A1 կրկնություն",
    "A1 Review",
    "Повтор A1",
    "Հարցեր, ժխտում և հրամայական",
    "Questions, եմ/ես, չեմ",
    "Вопросы, եմ/ես, չեմ",
    "есть / нет, род և в / на",
  ),
};
