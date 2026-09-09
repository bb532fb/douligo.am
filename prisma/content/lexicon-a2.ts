import type { Lexeme } from "./types";

export type A2UnitKey = "food" | "routine" | "city" | "travel";

function entry(
  key: string,
  hy: string,
  en: string,
  ru: string,
  hyPron: string,
  enPron: string,
  ruPron: string,
  exampleHy: string,
  exampleEn: string,
  exampleRu: string,
): Lexeme {
  return { key, hy, en, ru, hyPron, enPron, ruPron, exampleHy, exampleEn, exampleRu };
}

export const LEXICON_A2: Record<A2UnitKey, Lexeme[]> = {
  food: [
    entry("water", "ջուր", "water", "вода", "jur", "waw-ter", "vada", "Ես ջուր եմ ուզում։", "I want water.", "Я хочу воду."),
    entry("bread", "հաց", "bread", "хлеб", "hats", "bred", "khleb", "Խնդրում եմ հաց։", "Please pass the bread.", "Передай хлеб, пожалуйста."),
    entry("apple", "խնձոր", "apple", "яблоко", "khndzor", "ap-uhl", "yablaka", "Այս խնձորը քաղցր է։", "This apple is sweet.", "Это яблоко сладкое."),
    entry("coffee", "սուրճ", "coffee", "кофе", "surch", "kof-ee", "kofe", "Ես սուրճ եմ խմում։", "I drink coffee.", "Я пью кофе."),
    entry("breakfast", "նախաճաշ", "breakfast", "завтрак", "nakhachash", "brek-fuhst", "zaftrak", "Նախաճաշը պատրաստ է։", "Breakfast is ready.", "Завтрак готов."),
    entry("restaurant", "ռեստորան", "restaurant", "ресторан", "restoran", "res-tuh-ront", "restaran", "Մենք ռեստորանում ենք։", "We are at a restaurant.", "Мы в ресторане."),
  ],
  routine: [
    entry("today", "այսօր", "today", "сегодня", "aysor", "tuh-day", "sevodnya", "Այսօր աշխատում եմ։", "I work today.", "Я сегодня работаю."),
    entry("now", "հիմա", "now", "сейчас", "hima", "now", "seychas", "Հիմա զբաղված եմ։", "I am busy now.", "Я сейчас занят."),
    entry("always", "միշտ", "always", "всегда", "misht", "awl-wayz", "vsegda", "Ես միշտ կարդում եմ։", "I always read.", "Я всегда читаю."),
    entry("sometimes", "երբեմն", "sometimes", "иногда", "yerbemn", "sum-tymz", "inogda", "Երբեմն ուշանում եմ։", "I am sometimes late.", "Я иногда опаздываю."),
    entry("morning-time", "առավոտ", "morning", "утро", "aravot", "mor-ning", "utra", "Առավոտը հանգիստ է։", "The morning is quiet.", "Утро тихое."),
    entry("evening", "երեկո", "evening", "вечер", "ereko", "eev-ning", "vecher", "Երեկոյան տանն եմ։", "I am home in the evening.", "Вечером я дома."),
  ],
  city: [
    entry("home", "տուն", "home", "дом", "tun", "hohm", "dom", "Ես տանն եմ։", "I am at home.", "Я дома."),
    entry("school", "դպրոց", "school", "школа", "dprots", "skool", "shkola", "Երեխան դպրոց է գնում։", "The child goes to school.", "Ребёнок идёт в школу."),
    entry("shop", "խանութ", "shop", "магазин", "khanut", "shop", "magazin", "Խանութը մոտ է։", "The shop is near.", "Магазин близко."),
    entry("street", "փողոց", "street", "улица", "poghots", "street", "ulitsa", "Այս փողոցը երկար է։", "This street is long.", "Эта улица длинная."),
    entry("city", "քաղաք", "city", "город", "kaghak", "sit-ee", "gorat", "Երևանը գեղեցիկ քաղաք է։", "Yerevan is a beautiful city.", "Ереван — красивый город."),
    entry("hospital", "հիվանդանոց", "hospital", "больница", "hivandanots", "hos-pi-tuhl", "balnitsa", "Հիվանդանոցը քաղաքում է։", "The hospital is in the city.", "Больница в городе."),
  ],
  travel: [
    entry("bus", "ավտոբուս", "bus", "автобус", "avtobus", "bus", "aftobus", "Ես ավտոբուս եմ նստում։", "I take the bus.", "Я еду на автобусе."),
    entry("ticket", "տոմս", "ticket", "билет", "toms", "tik-it", "bilet", "Ինձ տոմս է պետք։", "I need a ticket.", "Мне нужен билет."),
    entry("hotel", "հյուրանոց", "hotel", "гостиница", "hyuranots", "ho-tel", "gastinitsa", "Հյուրանոցը նոր է։", "The hotel is new.", "Гостиница новая."),
    entry("airport", "օդանավակայան", "airport", "аэропорт", "odanavakayan", "air-port", "aeroport", "Մենք օդանավակայանում ենք։", "We are at the airport.", "Мы в аэропорту."),
    entry("near", "մոտ", "near", "близко", "mot", "neer", "blizka", "Դպրոցը մոտ է։", "The school is near.", "Школа близко."),
    entry("far", "հեռու", "far", "далеко", "heru", "far", "daleko", "Օդանավակայանը հեռու է։", "The airport is far.", "Аэропорт далеко."),
  ],
};

export const SENTENCES_A2: Record<A2UnitKey, Array<{ hy: string; en: string; ru: string }>> = {
  food: [
    { hy: "Ես ջուր եմ ուզում", en: "I want water", ru: "Я хочу воду" },
    { hy: "Այս սուրճը լավ է", en: "This coffee is good", ru: "Этот кофе хороший" },
  ],
  routine: [
    { hy: "Ես այսօր աշխատում եմ", en: "I work today", ru: "Я сегодня работаю" },
    { hy: "Հիմա երեկո է", en: "It is evening now", ru: "Сейчас вечер" },
  ],
  city: [
    { hy: "Ես տանն եմ", en: "I am at home", ru: "Я дома" },
    { hy: "Խանութը քաղաքում է", en: "The shop is in the city", ru: "Магазин в городе" },
  ],
  travel: [
    { hy: "Ինձ տոմս է պետք", en: "I need a ticket", ru: "Мне нужен билет" },
    { hy: "Հյուրանոցը մոտ է", en: "The hotel is near", ru: "Гостиница близко" },
  ],
};
