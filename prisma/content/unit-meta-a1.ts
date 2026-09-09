import type { A1UnitKey } from "./lexicon-a1";

export const UNIT_META_A1: Record<
  A1UnitKey,
  Record<string, { title: string; description: string; lessons: [string, string] }>
> = {
  greetings: {
    "hy-en": { title: "Ողջույններ", description: "Առօրյա ողջույններ և քաղաքավարություն", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "Greetings", description: "Everyday greetings and courtesy", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Приветствия", description: "Повседневные приветствия", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Ողջույններ", description: "Առօրյա ողջույններ ռուսերեն", lessons: ["Ճանաչում", "Գործածում"] },
  },
  introduce: {
    "hy-en": { title: "Ինքնաներկայացում", description: "Անուն, ծագում, որտեղ ես ապրում", lessons: ["Հիմնական արտահայտություններ", "Նախադասություններ"] },
    "en-hy": { title: "Introducing yourself", description: "Name, origin, and where you live", lessons: ["Core phrases", "Sentences"] },
    "ru-hy": { title: "Знакомство", description: "Имя, происхождение, где ты живёшь", lessons: ["Фразы", "Предложения"] },
    "hy-ru": { title: "Ինքնաներկայացում", description: "Անուն, ծագում, որտեղ ես ապրում", lessons: ["Հիմնական արտահայտություններ", "Նախադասություններ"] },
  },
  family: {
    "hy-en": { title: "Ընտանիք", description: "Ընտանիքի անդամներ և ունեմ", lessons: ["Բառեր", "Նկարագրություն"] },
    "en-hy": { title: "Family", description: "Family members and I have", lessons: ["Words", "Description"] },
    "ru-hy": { title: "Семья", description: "Члены семьи и у меня есть", lessons: ["Слова", "Описание"] },
    "hy-ru": { title: "Ընտանիք", description: "Ընտանիքի անդամներ և ունեմ", lessons: ["Բառեր", "Նկարագրություն"] },
  },
  numbers: {
    "hy-en": { title: "Թվեր", description: "1-ից 20 և քանի", lessons: ["Թվեր", "Գործնական"] },
    "en-hy": { title: "Numbers", description: "Numbers 1 to 20 and how many", lessons: ["Numbers", "Practice"] },
    "ru-hy": { title: "Числа", description: "Числа от 1 до 20 и сколько", lessons: ["Числа", "Практика"] },
    "hy-ru": { title: "Թվեր", description: "1-ից 20 և քանի", lessons: ["Թվեր", "Գործնական"] },
  },
  food: {
    "hy-en": { title: "Սնունդ", description: "Ուտելիք, խմիչք և ուզում եմ", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "Food", description: "Food, drink, and I want", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Еда", description: "Еда, напитки и я хочу", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Սնունդ", description: "Ուտելիք, խմիչք և ուզում եմ", lessons: ["Ճանաչում", "Գործածում"] },
  },
  places: {
    "hy-en": { title: "Վայրեր", description: "Տուն, դպրոց, որտեղ և գնում եմ", lessons: ["Ճանաչում", "Գործածում"] },
    "en-hy": { title: "Places", description: "Home, school, where, and I go", lessons: ["Recognize", "Use"] },
    "ru-hy": { title: "Места", description: "Дом, школа, где и я иду", lessons: ["Узнавание", "Применение"] },
    "hy-ru": { title: "Վայրեր", description: "Տուն, դպրոց, որտեղ և գնում եմ", lessons: ["Ճանաչում", "Գործածում"] },
  },
};
