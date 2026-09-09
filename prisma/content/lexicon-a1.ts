import type { Lexeme } from "./types";

export type A1UnitKey = "greetings" | "introduce" | "family" | "numbers" | "food" | "places";

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

export const LEXICON_A1: Record<A1UnitKey, Lexeme[]> = {
  greetings: [
    entry("hello", "բարև", "hello", "привет", "barev", "heh-loh", "privet", "Բարև, ինչպե՞ս ես։", "Hello, how are you?", "Привет, как дела?"),
    entry("goodbye", "ցտեսություն", "goodbye", "до свидания", "tstesutyun", "good-bye", "do svidaniya", "Ցտեսություն, կհանդիպենք վաղը։", "Goodbye, see you tomorrow.", "До свидания, увидимся завтра."),
    entry("thanks", "շնորհակալություն", "thank you", "спасибо", "shnorhakalutyun", "thank you", "spasibo", "Շնորհակալություն օգնության համար։", "Thank you for your help.", "Спасибо за помощь."),
    entry("please", "խնդրում եմ", "please", "пожалуйста", "khndrum em", "pleez", "pazhalusta", "Խնդրում եմ, նստիր։", "Please sit down.", "Пожалуйста, садись."),
    entry("yes", "այո", "yes", "да", "ayo", "yes", "da", "Այո, ես համաձայն եմ։", "Yes, I agree.", "Да, я согласен."),
    entry("no", "ոչ", "no", "нет", "voch", "noh", "nyet", "Ոչ, շնորհակալ եմ։", "No, thank you.", "Нет, спасибо."),
    entry("morning", "բարի լույս", "good morning", "доброе утро", "bari luys", "good morning", "dobroye utro", "Բարի լույս, Անի։", "Good morning, Ani.", "Доброе утро, Ани."),
    entry("how-are-you", "ինչպե՞ս ես", "how are you", "как дела", "inchpes es", "how are you", "kak dela", "Ինչպե՞ս ես այսօր։", "How are you today?", "Как дела сегодня?"),
  ],
  introduce: [
    entry("i", "ես", "I", "я", "yes", "eye", "ya", "Ես ուսանող եմ։", "I am a student.", "Я студент."),
    entry("my-name", "իմ անունն է", "my name is", "меня зовут", "im anunn e", "my name is", "menya zovut", "Իմ անունն է Արմեն։", "My name is Armen.", "Меня зовут Армен."),
    entry("student", "ուսանող", "student", "студент", "usanogh", "stoo-dent", "student", "Ես ուսանող եմ։", "I am a student.", "Я студент."),
    entry("armenia", "Հայաստան", "Armenia", "Армения", "Hayastan", "ar-mee-nee-uh", "Armeniya", "Ես Հայաստանից եմ։", "I am from Armenia.", "Я из Армении."),
    entry("from", "ից եմ", "I am from", "я из", "its em", "I am from", "ya iz", "Ես Երևանից եմ։", "I am from Yerevan.", "Я из Еревана."),
    entry("nice-meet", "հաճելի է ծանոթանալ", "nice to meet you", "приятно познакомиться", "hajeli e tsanotanal", "nice to meet you", "priyatno poznakomitsya", "Հաճելի է ծանոթանալ։", "Nice to meet you.", "Приятно познакомиться."),
    entry("live", "ապրում եմ", "I live", "я живу", "aprum em", "eye liv", "ya zhivu", "Ես ապրում եմ Երևանում։", "I live in Yerevan.", "Я живу в Ереване."),
    entry("friend", "ընկեր", "friend", "друг", "ynker", "frend", "drug", "Նա իմ ընկերն է։", "He is my friend.", "Он мой друг."),
  ],
  family: [
    entry("family", "ընտանիք", "family", "семья", "yntanik", "fam-uh-lee", "semya", "Իմ ընտանիքը մեծ է։", "My family is big.", "Моя семья большая."),
    entry("mother", "մայր", "mother", "мама", "mayr", "muh-ther", "mama", "Իմ մայրը բարի է։", "My mother is kind.", "Моя мама добрая."),
    entry("father", "հայր", "father", "папа", "hayr", "fah-ther", "papa", "Իմ հայրը տանն է։", "My father is at home.", "Мой папа дома."),
    entry("brother", "եղբայր", "brother", "брат", "yeghbayr", "bruh-ther", "brat", "Ես ունեմ եղբայր։", "I have a brother.", "У меня есть брат."),
    entry("sister", "քույր", "sister", "сестра", "kuyr", "sis-ter", "sestra", "Իմ քույրը այստեղ է։", "My sister is here.", "Моя сестра здесь."),
    entry("child", "երեխա", "child", "ребёнок", "erekha", "chyld", "rebyonok", "Երեխան տանն է։", "The child is at home.", "Ребёнок дома."),
    entry("parents", "ծնողներ", "parents", "родители", "tsnoghner", "pair-uhnts", "roditeli", "Իմ ծնողները բարի են։", "My parents are kind.", "Мои родители добрые."),
    entry("have", "ունեմ", "I have", "у меня есть", "unem", "eye hav", "u menya yest", "Ես ունեմ քույր։", "I have a sister.", "У меня есть сестра."),
  ],
  numbers: [
    entry("one", "մեկ", "one", "один", "mek", "wun", "odin", "Ես ունեմ մեկ եղբայր։", "I have one brother.", "У меня один брат."),
    entry("two", "երկու", "two", "два", "yerku", "too", "dva", "Երկու բաժակ սուրճ։", "Two cups of coffee.", "Две чашки кофе."),
    entry("three", "երեք", "three", "три", "yerek", "three", "tri", "Երեք օր։", "Three days.", "Три дня."),
    entry("four", "չորս", "four", "четыре", "chors", "for", "chetyre", "Չորս գիրք։", "Four books.", "Четыре книги."),
    entry("five", "հինգ", "five", "пять", "hing", "five", "pyat", "Հինգ գիրք։", "Five books.", "Пять книг."),
    entry("ten", "տասը", "ten", "десять", "tasy", "ten", "desyat", "Տասը րոպե։", "Ten minutes.", "Десять минут."),
    entry("twenty", "քսան", "twenty", "двадцать", "ksan", "twen-tee", "dvadtsat", "Քսան օր։", "Twenty days.", "Двадцать дней."),
    entry("how-many", "քանի", "how many", "сколько", "kani", "how men-ee", "skolko", "Քանի եղբայր ունես։", "How many brothers do you have?", "Сколько у тебя братьев?"),
  ],
  food: [
    entry("water", "ջուր", "water", "вода", "jur", "waw-ter", "vada", "Ես ջուր եմ ուզում։", "I want water.", "Я хочу воду."),
    entry("bread", "հաց", "bread", "хлеб", "hats", "bred", "khleb", "Խնդրում եմ հաց։", "Please pass the bread.", "Передай хлеб, пожалуйста."),
    entry("apple", "խնձոր", "apple", "яблоко", "khndzor", "ap-uhl", "yablaka", "Այս խնձորը լավ է։", "This apple is good.", "Это яблоко хорошее."),
    entry("coffee", "սուրճ", "coffee", "кофе", "surch", "kof-ee", "kofe", "Ես սուրճ եմ ուզում։", "I want coffee.", "Я хочу кофе."),
    entry("tea", "թեյ", "tea", "чай", "tey", "tee", "chay", "Ես թեյ եմ ուզում։", "I want tea.", "Я хочу чай."),
    entry("want", "ուզում եմ", "I want", "я хочу", "uzum em", "eye wont", "ya khochu", "Ես ջուր եմ ուզում։", "I want water.", "Я хочу воду."),
    entry("breakfast", "նախաճաշ", "breakfast", "завтрак", "nakhachash", "brek-fuhst", "zaftrak", "Նախաճաշը պատրաստ է։", "Breakfast is ready.", "Завтрак готов."),
    entry("food", "ուտելիք", "food", "еда", "utelik", "food", "yeda", "Ուտելիքը լավ է։", "The food is good.", "Еда хорошая."),
  ],
  places: [
    entry("home", "տուն", "home", "дом", "tun", "hohm", "dom", "Ես տանն եմ։", "I am at home.", "Я дома."),
    entry("school", "դպրոց", "school", "школа", "dprots", "skool", "shkola", "Երեխան դպրոց է գնում։", "The child goes to school.", "Ребёнок идёт в школу."),
    entry("where", "որտեղ", "where", "где", "vortegh", "wair", "gde", "Որտե՞ղ է տունը։", "Where is the home?", "Где дом?"),
    entry("here", "այստեղ", "here", "здесь", "aystegh", "heer", "zdes", "Դպրոցը այստեղ է։", "The school is here.", "Школа здесь."),
    entry("there", "այնտեղ", "there", "там", "ayntegh", "thair", "tam", "Տունը այնտեղ է։", "The home is there.", "Дом там."),
    entry("go", "գնում եմ", "I go", "я иду", "gnum em", "eye go", "ya idu", "Ես տուն եմ գնում։", "I go home.", "Я иду домой."),
    entry("this", "սա", "this", "это", "sa", "this", "eto", "Սա իմ տունն է։", "This is my home.", "Это мой дом."),
    entry("shop", "խանութ", "shop", "магазин", "khanut", "shop", "magazin", "Խանութը այստեղ է։", "The shop is here.", "Магазин здесь."),
  ],
};

export const SENTENCES_A1: Record<A1UnitKey, Array<{ hy: string; en: string; ru: string }>> = {
  greetings: [
    { hy: "Բարև ինչպես ես", en: "Hello how are you", ru: "Привет как дела" },
    { hy: "Շնորհակալություն օգնության համար", en: "Thank you for your help", ru: "Спасибо за помощь" },
  ],
  introduce: [
    { hy: "Ես ուսանող եմ", en: "I am a student", ru: "Я студент" },
    { hy: "Ես ապրում եմ Երևանում", en: "I live in Yerevan", ru: "Я живу в Ереване" },
  ],
  family: [
    { hy: "Իմ ընտանիքը մեծ է", en: "My family is big", ru: "Моя семья большая" },
    { hy: "Ես ունեմ եղբայր", en: "I have a brother", ru: "У меня есть брат" },
  ],
  numbers: [
    { hy: "Ես ունեմ երկու քույր", en: "I have two sisters", ru: "У меня две сестры" },
    { hy: "Ես ունեմ հինգ գիրք", en: "I have five books", ru: "У меня пять книг" },
  ],
  food: [
    { hy: "Ես ջուր եմ ուզում", en: "I want water", ru: "Я хочу воду" },
    { hy: "Այս հացը լավ է", en: "This bread is good", ru: "Этот хлеб хороший" },
  ],
  places: [
    { hy: "Ես տուն եմ գնում", en: "I go home", ru: "Я иду домой" },
    { hy: "Դպրոցը այստեղ է", en: "The school is here", ru: "Школа здесь" },
  ],
};
