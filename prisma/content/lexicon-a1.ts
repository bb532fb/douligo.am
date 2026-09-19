import { LEXICON_A1_EXTRAS, LEXICON_A1_MORE } from "./lexicon-a1-more";
import type { Lexeme } from "./types";

export { SENTENCES_A1 } from "./sentences-a1";

export type A1UnitKey =
  | "greetings"
  | "introduce"
  | "family"
  | "numbers"
  | "food"
  | "places"
  | "routine"
  | "shopping"
  | "hobbies"
  | "school"
  | "everyday"
  | "review";

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

export const LEXICON_A1_CORE = {
  greetings: [
    entry("hello", "բարև", "hello", "привет", "barev", "heh-loh", "privet", "Բարև, ինչպե՞ս ես։", "Hello, how are you?", "Привет, как дела?"),
    entry("goodbye", "ցտեսություն", "goodbye", "до свидания", "tstesutyun", "good-bye", "do svidaniya", "Ցտեսություն, կհանդիպենք վաղը։", "Goodbye, see you tomorrow.", "До свидания, увидимся завтра."),
    entry("thanks", "շնորհակալություն", "thank you", "спасибо", "shnorhakalutyun", "thank you", "spasibo", "Շնորհակալություն օգնության համար։", "Thank you for your help.", "Спасибо за помощь."),
    entry("please", "խնդրում եմ", "please", "пожалуйста", "khndrum em", "pleez", "pazhalusta", "Խնդրում եմ, նստիր։", "Please sit down.", "Пожалуйста, садись."),
    entry("yes", "այո", "yes", "да", "ayo", "yes", "da", "Այո, ես համաձայն եմ։", "Yes, I agree.", "Да, я согласен."),
    entry("no", "ոչ", "no", "нет", "voch", "noh", "nyet", "Ոչ, շնորհակալ եմ։", "No, thank you.", "Нет, спасибо."),
    entry("morning", "բարի լույս", "good morning", "доброе утро", "bari luys", "good morning", "dobroye utro", "Բարի լույս, Անի։", "Good morning, Ani.", "Доброе утро, Ани."),
    entry("how-are-you", "ինչպե՞ս ես", "how are you", "как дела", "inchpes es", "how are you", "kak dela", "Ինչպե՞ս ես այսօր։", "How are you today?", "Как дела сегодня?"),
    entry("sorry", "ներողություն", "sorry", "извините", "neroghutyun", "sor-ee", "izvinite", "Ներողություն։", "Sorry.", "Извините."),
    entry("excuse-me", "ներեցեք", "excuse me", "простите", "neretsek", "ex-kyoos mee", "prostite", "Ներեցեք։", "Excuse me.", "Простите."),
    entry("good-night", "բարի գիշեր", "good night", "спокойной ночи", "bari gisher", "good night", "spokoynoy nochi", "Բարի գիշեր։", "Good night.", "Спокойной ночи."),
    entry("see-you", "կտեսնվենք", "see you", "увидимся", "ktesnv enk", "see you", "uvidimsya", "Կտեսնվենք։", "See you.", "Увидимся."),
    entry("fine", "լավ եմ", "I am fine", "я в порядке", "lav em", "eye am fine", "ya v poryadke", "Ես լավ եմ։", "I am fine.", "Я в порядке."),
    entry("and", "և", "and", "и", "yev", "and", "i", "Բարև և շնորհակալություն։", "Hello and thank you.", "Привет и спасибо."),
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
    entry("you", "դու", "you", "ты", "du", "yoo", "ty", "Դու ուսանող ես։", "You are a student.", "Ты студент."),
    entry("he", "նա", "he", "он", "na", "hee", "on", "Նա իմ ընկերն է։", "He is my friend.", "Он мой друг."),
    entry("she", "նա", "she", "она", "na", "shee", "ona", "Նա ուսանող է։", "She is a student.", "Она студентка."),
    entry("we", "մենք", "we", "мы", "menk", "wee", "my", "Մենք ուսանող ենք։", "We are students.", "Мы студенты."),
    entry("they", "նրանք", "they", "они", "nrank", "thay", "oni", "Նրանք ընկերներ են։", "They are friends.", "Они друзья."),
    entry("what-name", "ի՞նչ է քո անունը", "what is your name", "как тебя зовут", "inch e ko anuny", "what is your name", "kak tebya zovut", "Ի՞նչ է քո անունը։", "What is your name?", "Как тебя зовут?"),
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
    entry("my", "իմ", "my", "мой", "im", "my", "moy", "Սա իմ եղբայրն է։", "This is my brother.", "Это мой брат."),
    entry("your", "քո", "your", "твой", "ko", "yor", "tvoy", "Սա քո մայրն է։", "This is your mother.", "Это твоя мама."),
    entry("wife", "կին", "wife", "жена", "kin", "wyf", "zhena", "Նրա կինը տանն է։", "His wife is at home.", "Его жена дома."),
    entry("husband", "ամուսին", "husband", "муж", "amusin", "huz-band", "muzh", "Նրա ամուսինը այստեղ է։", "Her husband is here.", "Её муж здесь."),
    entry("son", "որդի", "son", "сын", "vordi", "sun", "syn", "Ես ունեմ որդի։", "I have a son.", "У меня есть сын."),
    entry("daughter", "դուստր", "daughter", "дочь", "dustr", "daw-ter", "doch", "Ես ունեմ դուստր։", "I have a daughter.", "У меня есть дочь."),
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
    entry("six", "վեց", "six", "шесть", "vets", "siks", "shest", "Վեց խնձոր։", "Six apples.", "Шесть яблок."),
    entry("seven", "յոթ", "seven", "семь", "yot", "sev-en", "sem", "Յոթ օր։", "Seven days.", "Семь дней."),
    entry("eight", "ութ", "eight", "восемь", "ut", "ayt", "vosem", "Ութ գիրք։", "Eight books.", "Восемь книг."),
    entry("nine", "ինը", "nine", "девять", "iny", "nyn", "devyat", "Ինը րոպե։", "Nine minutes.", "Девять минут."),
    entry("eleven", "տասնմեկ", "eleven", "одиннадцать", "tasnmek", "i-lev-en", "odinnadtsat", "տասնմեկ երեխա։", "Eleven children.", "Одиннадцать детей."),
    entry("twelve", "տասներկու", "twelve", "двенадцать", "tasnerku", "twelv", "dvenadtsat", "Տասներկու ամիս։", "Twelve months.", "Двенадцать месяцев."),
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
    entry("milk", "կաթ", "milk", "молоко", "kat", "milk", "malako", "Ես կաթ եմ ուզում։", "I want milk.", "Я хочу молоко."),
    entry("fruit", "միրգ", "fruit", "фрукт", "mirg", "froot", "frukt", "Այս մրգը լավ է։", "This fruit is good.", "Этот фрукт хороший."),
    entry("lunch", "ճաշ", "lunch", "обед", "chash", "lunch", "obyed", "Ճաշը պատրաստ է։", "Lunch is ready.", "Обед готов."),
    entry("dinner", "ընթրիք", "dinner", "ужин", "yntrik", "din-er", "uzhin", "Ընթրիքը լավ է։", "Dinner is good.", "Ужин хороший."),
    entry("like", "սիրում եմ", "I like", "я люблю", "sirum em", "eye like", "ya lyublyu", "Ես սիրում եմ այս հացը։", "I like this bread.", "Я люблю этот хлеб."),
    entry("article-a", "մի", "a", "один", "mi", "uh", "odin", "Ես մի սուրճ եմ ուզում։", "I want a coffee.", "Я хочу один кофе."),
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
    entry("cafe", "սրճարան", "cafe", "кафе", "srcharan", "ka-fay", "kafe", "Սրճարանը այստեղ է։", "The cafe is here.", "Кафе здесь."),
    entry("red", "կարմիր", "red", "красный", "karmir", "red", "krasny", "Այս տունը կարմիր է։", "This house is red.", "Этот дом красный."),
    entry("blue", "կապույտ", "blue", "синий", "kapuyt", "bloo", "siniy", "Այս գիրքը կապույտ է։", "This book is blue.", "Эта книга синяя."),
    entry("green", "կանաչ", "green", "зелёный", "kanach", "green", "zelyony", "Այգին կանաչ է։", "The park is green.", "Парк зелёный."),
    entry("not", "չէ", "not", "не", "che", "not", "ne", "Սրճարանը այստեղ չէ։", "The cafe is not here.", "Кафе не здесь."),
    entry("what-time", "ժամը քանիսն է", "what time is it", "который час", "zhamy kanisn e", "what time is it", "kotory chas", "Ժամը քանիսն է։", "What time is it?", "Который час?"),
  ],
};

export const LEXICON_A1: Record<A1UnitKey, Lexeme[]> = {
  greetings: [...LEXICON_A1_CORE.greetings, ...(LEXICON_A1_EXTRAS.greetings ?? [])],
  introduce: [...LEXICON_A1_CORE.introduce, ...(LEXICON_A1_EXTRAS.introduce ?? [])],
  family: [...LEXICON_A1_CORE.family, ...(LEXICON_A1_EXTRAS.family ?? [])],
  numbers: [...LEXICON_A1_CORE.numbers, ...(LEXICON_A1_EXTRAS.numbers ?? [])],
  food: [...LEXICON_A1_CORE.food, ...(LEXICON_A1_EXTRAS.food ?? [])],
  places: [...LEXICON_A1_CORE.places, ...(LEXICON_A1_EXTRAS.places ?? [])],
  ...LEXICON_A1_MORE,
};
