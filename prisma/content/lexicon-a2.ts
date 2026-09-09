import type { Lexeme } from "./types";

export type A2UnitKey = "routine" | "city" | "travel" | "shopping" | "past" | "future";

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
  routine: [
    entry("today", "այսօր", "today", "сегодня", "aysor", "tuh-day", "sevodnya", "Այսօր աշխատում եմ։", "I work today.", "Я сегодня работаю."),
    entry("now", "հիմա", "now", "сейчас", "hima", "now", "seychas", "Հիմա զբաղված եմ։", "I am busy now.", "Я сейчас занят."),
    entry("always", "միշտ", "always", "всегда", "misht", "awl-wayz", "vsegda", "Ես միշտ կարդում եմ։", "I always read.", "Я всегда читаю."),
    entry("sometimes", "երբեմն", "sometimes", "иногда", "yerbemn", "sum-tymz", "inogda", "Երբեմն ուշանում եմ։", "I am sometimes late.", "Я иногда опаздываю."),
    entry("morning-time", "առավոտ", "morning", "утро", "aravot", "mor-ning", "utra", "Առավոտը հանգիստ է։", "The morning is quiet.", "Утро тихое."),
    entry("evening", "երեկո", "evening", "вечер", "ereko", "eev-ning", "vecher", "Երեկոյան տանն եմ։", "I am home in the evening.", "Вечером я дома."),
    entry("eat", "ուտում եմ", "I eat", "я ем", "utum em", "eye eet", "ya yem", "Առավոտյան ես ուտում եմ։", "I eat in the morning.", "Утром я ем."),
    entry("work-verb", "աշխատում եմ", "I work", "я работаю", "ashkhatum em", "eye werk", "ya rabotayu", "Ես այսօր աշխատում եմ։", "I work today.", "Я сегодня работаю."),
  ],
  city: [
    entry("street", "փողոց", "street", "улица", "poghots", "street", "ulitsa", "Այս փողոցը երկար է։", "This street is long.", "Эта улица длинная."),
    entry("city", "քաղաք", "city", "город", "kaghak", "sit-ee", "gorat", "Երևանը գեղեցիկ քաղաք է։", "Yerevan is a beautiful city.", "Ереван — красивый город."),
    entry("hospital", "հիվանդանոց", "hospital", "больница", "hivandanots", "hos-pi-tuhl", "balnitsa", "Հիվանդանոցը քաղաքում է։", "The hospital is in the city.", "Больница в городе."),
    entry("near", "մոտ", "near", "близко", "mot", "neer", "blizka", "Դպրոցը մոտ է։", "The school is near.", "Школа близко."),
    entry("far", "հեռու", "far", "далеко", "heru", "far", "daleko", "Օդանավակայանը հեռու է։", "The airport is far.", "Аэропорт далеко."),
    entry("left", "ձախ", "left", "налево", "dzakh", "left", "nalevo", "Խանութը ձախ է։", "The shop is on the left.", "Магазин налево."),
    entry("right", "աջ", "right", "направо", "aj", "rite", "napravo", "Դպրոցը աջ է։", "The school is on the right.", "Школа направо."),
    entry("park", "այգի", "park", "парк", "aygi", "park", "park", "Այգին քաղաքում է։", "The park is in the city.", "Парк в городе."),
  ],
  travel: [
    entry("bus", "ավտոբուս", "bus", "автобус", "avtobus", "bus", "aftobus", "Ես ավտոբուս եմ նստում։", "I take the bus.", "Я еду на автобусе."),
    entry("ticket", "տոմս", "ticket", "билет", "toms", "tik-it", "bilet", "Ինձ տոմս է պետք։", "I need a ticket.", "Мне нужен билет."),
    entry("hotel", "հյուրանոց", "hotel", "гостиница", "hyuranots", "ho-tel", "gastinitsa", "Հյուրանոցը նոր է։", "The hotel is new.", "Гостиница новая."),
    entry("airport", "օդանավակայան", "airport", "аэропорт", "odanavakayan", "air-port", "aeroport", "Մենք օդանավակայանում ենք։", "We are at the airport.", "Мы в аэропорту."),
    entry("station", "կայարան", "station", "вокзал", "kayaran", "stay-shun", "vokzal", "Կայարանը մոտ է։", "The station is near.", "Вокзал близко."),
    entry("wait", "սպասել", "to wait", "ждать", "spasel", "too wayt", "zhdat", "Մենք կայարանում ենք սպասում։", "We are waiting at the station.", "Мы ждём на вокзале."),
    entry("train", "գնացք", "train", "поезд", "gnatsq", "trayn", "poyezd", "Գնացքը ուշանում է։", "The train is late.", "Поезд опаздывает."),
    entry("map", "քարտեզ", "map", "карта", "kartez", "map", "karta", "Ինձ քարտեզ է պետք։", "I need a map.", "Мне нужна карта."),
  ],
  shopping: [
    entry("buy", "գնել", "to buy", "купить", "gnel", "too by", "kupit", "Ես ուզում եմ հաց գնել։", "I want to buy bread.", "Я хочу купить хлеб."),
    entry("price", "գին", "price", "цена", "gin", "prys", "tsena", "Գինը լավ է։", "The price is good.", "Цена хорошая."),
    entry("cheap", "էժան", "cheap", "дешёвый", "ezhan", "cheep", "deshovyy", "Այս հացը էժան է։", "This bread is cheap.", "Этот хлеб дешёвый."),
    entry("expensive", "թանկ", "expensive", "дорогой", "tank", "ik-spen-siv", "dorogoy", "Այս հյուրանոցը թանկ է։", "This hotel is expensive.", "Эта гостиница дорогая."),
    entry("money", "փող", "money", "деньги", "pogh", "mun-ee", "dengi", "Ինձ փող է պետք։", "I need money.", "Мне нужны деньги."),
    entry("clothes", "հագուստ", "clothes", "одежда", "hagust", "klohz", "odezhda", "Ես հագուստ եմ ուզում գնել։", "I want to buy clothes.", "Я хочу купить одежду."),
    entry("how-much", "որքան", "how much", "сколько стоит", "vorkan", "how much", "skolko stoit", "Որքա՞ն է գինը։", "How much is the price?", "Сколько стоит?"),
    entry("size", "չափս", "size", "размер", "chaps", "syz", "razmer", "Ինձ այս չափսն է պետք։", "I need this size.", "Мне нужен этот размер."),
  ],
  past: [
    entry("yesterday", "երեկ", "yesterday", "вчера", "yereg", "yes-ter-day", "vchera", "Երեկ ես տանն էի։", "Yesterday I was at home.", "Вчера я был дома."),
    entry("last-week", "անցյալ շաբաթ", "last week", "на прошлой неделе", "antsyal shabat", "last week", "na proshloy nedele", "Անցյալ շաբաթ ես գնացի դպրոց։", "Last week I went to school.", "На прошлой неделе я пошёл в школу."),
    entry("was", "ես էի", "I was", "я был", "yes ei", "eye wuz", "ya byl", "Երեկ ես տանն էի։", "Yesterday I was at home.", "Вчера я был дома."),
    entry("went", "գնացի", "I went", "я пошёл", "gnatsi", "eye went", "ya poshol", "Երեկ ես գնացի խանութ։", "Yesterday I went to the shop.", "Вчера я пошёл в магазин."),
    entry("did", "արեցի", "I did", "я сделал", "aretsi", "eye did", "ya sdelal", "Ես դա արեցի։", "I did that.", "Я это сделал."),
    entry("saw", "տեսա", "I saw", "я видел", "tesa", "eye saw", "ya videl", "Երեկ ես ընկերոջս տեսա։", "Yesterday I saw my friend.", "Вчера я видел друга."),
    entry("with", "հետ", "with", "с", "het", "with", "s", "Ես գնացի ընկերոջս հետ։", "I went with my friend.", "Я пошёл с другом."),
    entry("for", "համար", "for", "для", "hamar", "for", "dlya", "Սա քեզ համար է։", "This is for you.", "Это для тебя."),
  ],
  future: [
    entry("tomorrow", "վաղը", "tomorrow", "завтра", "vaghy", "tuh-mor-oh", "zavtra", "Վաղը ես տուն կգնամ։", "Tomorrow I will go home.", "Завтра я пойду домой."),
    entry("soon", "շուտով", "soon", "скоро", "shutov", "soon", "skoro", "Շուտով կգամ։", "I will come soon.", "Я скоро приду."),
    entry("will-go", "կգնամ", "I will go", "я пойду", "kgnam", "eye will go", "ya poydu", "Վաղը ես կգնամ դպրոց։", "Tomorrow I will go to school.", "Завтра я пойду в школу."),
    entry("can", "կարող եմ", "I can", "я могу", "karogh em", "eye kan", "ya mogu", "Ես կարող եմ օգնել։", "I can help.", "Я могу помочь."),
    entry("need", "ինձ պետք է", "I need", "мне нужно", "indz petk e", "eye need", "mne nuzhno", "Ինձ տոմս է պետք։", "I need a ticket.", "Мне нужен билет."),
    entry("next-week", "հաջորդ շաբաթ", "next week", "на следующей неделе", "hachord shabat", "nekst week", "na sleduyushchey nedele", "Հաջորդ շաբաթ կգամ։", "I will come next week.", "Я приеду на следующей неделе."),
    entry("will-be", "կլինեմ", "I will be", "я буду", "klinem", "eye will bee", "ya budu", "Վաղը ես տանը կլինեմ։", "Tomorrow I will be at home.", "Завтра я буду дома."),
    entry("later", "ավելի ուշ", "later", "позже", "aveli ush", "lay-ter", "pozzhe", "Ավելի ուշ կխոսենք։", "We will talk later.", "Поговорим позже."),
  ],
};

export const SENTENCES_A2: Record<A2UnitKey, Array<{ hy: string; en: string; ru: string }>> = {
  routine: [
    { hy: "Ես այսօր աշխատում եմ", en: "I work today", ru: "Я сегодня работаю" },
    { hy: "Առավոտյան ես ուտում եմ", en: "I eat in the morning", ru: "Утром я ем" },
  ],
  city: [
    { hy: "Խանութը մոտ է", en: "The shop is near", ru: "Магазин близко" },
    { hy: "Հիվանդանոցը ձախ է", en: "The hospital is on the left", ru: "Больница налево" },
  ],
  travel: [
    { hy: "Ինձ տոմս է պետք", en: "I need a ticket", ru: "Мне нужен билет" },
    { hy: "Կայարանը հեռու չէ", en: "The station is not far", ru: "Вокзал не далеко" },
  ],
  shopping: [
    { hy: "Ես ուզում եմ հաց գնել", en: "I want to buy bread", ru: "Я хочу купить хлеб" },
    { hy: "Այս հագուստը թանկ է", en: "These clothes are expensive", ru: "Эта одежда дорогая" },
  ],
  past: [
    { hy: "Երեկ ես տանն էի", en: "Yesterday I was at home", ru: "Вчера я был дома" },
    { hy: "Անցյալ շաբաթ ես գնացի դպրոց", en: "Last week I went to school", ru: "На прошлой неделе я пошёл в школу" },
  ],
  future: [
    { hy: "Վաղը ես տուն կգնամ", en: "Tomorrow I will go home", ru: "Завтра я пойду домой" },
    { hy: "Հաջորդ շաբաթ ես կարող եմ գալ", en: "Next week I can come", ru: "На следующей неделе я могу прийти" },
  ],
};
