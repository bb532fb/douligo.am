import type { Lexeme } from "./types";

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

export const LEXICON_A2_COMPARE: Lexeme[] = [
  entry("cheap", "էժան", "cheap", "дешёвый", "ezhan", "cheep", "deshovyy", "Այս հացը էժան է։", "This bread is cheap.", "Этот хлеб дешёвый."),
  entry("expensive", "թանկ", "expensive", "дорогой", "tank", "ik-spen-siv", "dorogoy", "Այս հյուրանոցը թանկ է։", "This hotel is expensive.", "Эта гостиница дорогая."),
  entry("cheaper", "ավելի էժան", "cheaper", "дешевле", "aveli ezhan", "chee-per", "deshevle", "Այս հացը ավելի էժան է։", "This bread is cheaper.", "Этот хлеб дешевле."),
  entry("bigger", "ավելի մեծ", "bigger", "больше", "aveli mets", "big-er", "bolshe", "Այս չափսն ավելի մեծ է։", "This size is bigger.", "Этот размер больше."),
  entry("more", "ավելի", "more", "более", "aveli", "mor", "boleye", "Այս հյուրանոցը ավելի թանկ է։", "This hotel is more expensive.", "Эта гостиница более дорогая."),
  entry("less", "ավելի քիչ", "less", "меньше", "aveli kich", "les", "menshe", "Սա ավելի քիչ է։", "This is less.", "Этого меньше."),
  entry("than", "քան", "than", "чем", "kan", "than", "chem", "Այս հացը ավելի էժան է քան այդը։", "This bread is cheaper than that.", "Этот хлеб дешевле чем тот."),
  entry("smaller", "ավելի փոքր", "smaller", "меньше", "aveli pokr", "smaw-ler", "menshe", "Այս սենյակը ավելի փոքր է։", "This room is smaller.", "Эта комната меньше."),
  entry("the-best", "ամենալավը", "the best", "самый лучший", "amenalavy", "thuh best", "samy luchshiy", "Սա ամենալավը հյուրանոցն է։", "This is the best hotel.", "Это самая лучшая гостиница."),
  entry("too-adj", "շատ", "too", "слишком", "shat", "too", "slishkom", "Այս հյուրանոցը շատ թանկ է։", "This hotel is too expensive.", "Эта гостиница слишком дорогая."),
];

export const LEXICON_A2_INVITES: Lexeme[] = [
  entry("would-you-like", "կուզես", "would you like", "хотели бы ты", "kuzes", "wood yoo like", "khoteli by ty", "Կուզես թեյ։", "Would you like tea?", "Хотел бы ты чай?"),
  entry("lets", "եկ գնանք", "let us", "давай", "ek gnanq", "let us", "davay", "Եկ գնանք այգի։", "Let us go to the park.", "Давай пойдём в парк."),
  entry("are-you-free", "ազատ ես", "are you free", "ты свободен", "azat es", "ar yoo free", "ty svoboden", "Ազատ ես վաղը։", "Are you free tomorrow?", "Ты свободен завтра?"),
  entry("come-with", "արի ինձ հետ", "come with me", "пойдём со мной", "ari indz het", "kum with mee", "poydyom so mnoy", "Արի ինձ հետ։", "Come with me.", "Пойдём со мной."),
  entry("party", "երեկույթ", "party", "вечеринка", "erekuyt", "par-tee", "vecherinka", "Ես գնում եմ երեկույթի։", "I am going to a party.", "Я иду на вечеринку."),
  entry("invite", "հրավիրել", "to invite", "пригласить", "hravirel", "too in-vyt", "priglasit", "Ես ուզում եմ հրավիրել քեզ։", "I want to invite you.", "Я хочу пригласить тебя."),
  entry("see-you-then", "ուրեմն տեսնվենք", "see you then", "тогда увидимся", "uremn tesnvenq", "see yoo then", "togda uvidimsya", "Ուրեմն տեսնվենք։", "See you then.", "Тогда увидимся."),
  entry("sounds-good", "լավ է հնչում", "that sounds good", "звучит хорошо", "lav e hnchum", "that soundz good", "zvuchit khorosho", "Այդ լավ է հնչում։", "That sounds good.", "Это звучит хорошо."),
  entry("i-am-free", "ազատ եմ", "I am free", "я свободен", "azat em", "eye am free", "ya svoboden", "Ես վաղը ազատ եմ։", "I am free tomorrow.", "Я завтра свободен."),
  entry("sorry-busy", "զբաղված եմ", "I am busy", "я занят", "zbaghvats em", "eye am biz-ee", "ya zanyat", "Ես այсօր զբաղված եմ։", "I am busy today.", "Я сегодня занят."),
  entry("maybe-later", "գուցե ավելի ուշ", "maybe later", "может позже", "gutse aveli ush", "may-bee lay-ter", "mozhet pozzhe", "Գուցե ավելի ուշ։", "Maybe later.", "Может позже."),
  entry("what-time-meet", "ժամը քանիсն", "what time", "в какое время", "zhamy kanisn", "wot tym", "v kakoye vremya", "Ժամը քանիсն է հանդիպվումը։", "What time is the meeting?", "В какое время встреча?"),
];
