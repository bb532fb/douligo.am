import type { Lexeme } from "./types";

export type B1UnitKey = "work" | "health" | "opinions" | "plans";

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

export const LEXICON_B1: Record<B1UnitKey, Lexeme[]> = {
  work: [
    entry("job", "աշխատանք", "job", "работа", "ashkhatank", "job", "rabota", "Իմ աշխատանքը կարևոր է։", "My job is important.", "Моя работа важная."),
    entry("office", "գրասենյակ", "office", "офис", "grasenak", "of-is", "ofis", "Ես գրասենյակում եմ աշխատում։", "I work in an office.", "Я работаю в офисе."),
    entry("colleague", "գործընկեր", "colleague", "коллега", "gortsnker", "kol-eeg", "kollega", "Իմ գործընկերն օգնում է ինձ։", "My colleague helps me.", "Мой коллега помогает мне."),
    entry("meeting", "հանդիպում", "meeting", "встреча", "handipum", "mee-ting", "vstrecha", "Այսօր կարևոր հանդիպում ունենք։", "We have an important meeting today.", "Сегодня у нас важная встреча."),
    entry("experience", "փորձ", "experience", "опыт", "pordz", "ik-speer-ee-uhns", "opyt", "Ես ունեմ աշխատանքային փորձ։", "I have work experience.", "У меня есть опыт работы."),
    entry("important", "կարևոր", "important", "важный", "karevor", "im-por-tuhnt", "vazhny", "Այս հանդիպումը կարևոր է։", "This meeting is important.", "Эта встреча важная."),
    entry("explain", "բացատրել", "to explain", "объяснить", "batsatrel", "too ik-spleyn", "obyasnit", "Խնդրում եմ բացատրել այս նախագիծը։", "Please explain this project.", "Пожалуйста, объясни этот проект."),
    entry("project", "նախագիծ", "project", "проект", "nakhagits", "prah-jekt", "proyekt", "Մենք նոր նախագիծ ունենք։", "We have a new project.", "У нас новый проект."),
  ],
  health: [
    entry("doctor", "բժիշկ", "doctor", "врач", "bzhishk", "dok-ter", "vrach", "Ես պետք է գնամ բժշկի։", "I need to see a doctor.", "Мне нужно к врачу."),
    entry("medicine", "դեղ", "medicine", "лекарство", "degh", "med-uh-sin", "lekarstvo", "Այս դեղն օգնում է։", "This medicine helps.", "Это лекарство помогает."),
    entry("appointment", "այց", "appointment", "приём", "ayts", "uh-point-muhnt", "priyom", "Ես վաղը այց ունեմ բժշկի մոտ։", "I have a doctor appointment tomorrow.", "Завтра у меня приём у врача."),
    entry("headache", "գլխացավ", "headache", "головная боль", "glkhatsav", "hed-ayk", "golovnaya bol", "Ես գլխացավ ունեմ։", "I have a headache.", "У меня головная боль."),
    entry("healthy", "առողջ", "healthy", "здоровый", "aroghj", "hel-thee", "zdorovy", "Ես ուզում եմ առողջ լինել։", "I want to be healthy.", "Я хочу быть здоровым."),
    entry("tired", "հոգնած", "tired", "усталый", "hognats", "ty-erd", "ustaly", "Ես շատ հոգնած եմ այսօր։", "I am very tired today.", "Я сегодня очень усталый."),
    entry("feel", "զգում եմ", "I feel", "я чувствую", "zgum em", "eye feel", "ya chuvstvuyu", "Ես լավ եմ զգում։", "I feel well.", "Я хорошо себя чувствую."),
    entry("problem", "խնդիր", "problem", "проблема", "khndir", "prah-bluhm", "problema", "Սա մեծ խնդիր չէ։", "This is not a big problem.", "Это не большая проблема."),
  ],
  opinions: [
    entry("think", "կարծում եմ", "I think", "я думаю", "kartsum em", "eye think", "ya dumayu", "Ես կարծում եմ, որ սա ճիշտ է։", "I think this is right.", "Я думаю, что это правильно."),
    entry("prefer", "նախընտրում եմ", "I prefer", "я предпочитаю", "nakhyntrum em", "eye pri-fur", "ya predpochitayu", "Ես նախընտրում եմ աշխատել տանը։", "I prefer to work at home.", "Я предпочитаю работать дома."),
    entry("interesting", "հետաքրքիր", "interesting", "интересный", "hetakrkir", "in-tuh-res-ting", "interesny", "Այս նախագիծը հետաքրքիր է։", "This project is interesting.", "Этот проект интересный."),
    entry("difficult", "դժվար", "difficult", "трудный", "dzhvar", "dif-i-kult", "trudny", "Այս աշխատանքը դժվար է։", "This job is difficult.", "Эта работа трудная."),
    entry("maybe", "գուցե", "maybe", "может быть", "gutse", "may-bee", "mozhet byt", "Գուցե վաղը կգամ։", "Maybe I will come tomorrow.", "Может быть, я приду завтра."),
    entry("because", "որովհետև", "because", "потому что", "vorovhetev", "bi-kawz", "potomu chto", "Ես մնում եմ, որովհետև հոգնած եմ։", "I am staying because I am tired.", "Я остаюсь, потому что устал."),
    entry("agree", "համաձայն եմ", "I agree", "я согласен", "hamadzayn em", "eye uh-gree", "ya soglasen", "Ես համաձայն եմ քո կարծիքի հետ։", "I agree with your opinion.", "Я согласен с твоим мнением."),
    entry("enough", "բավական", "enough", "достаточно", "bavakan", "i-nuf", "dostatochno", "Սա բավական է այսօր։", "This is enough for today.", "Этого достаточно на сегодня."),
  ],
  plans: [
    entry("already", "արդեն", "already", "уже", "arden", "awl-red-ee", "uzhe", "Ես արդեն պատրաստ եմ։", "I am already ready.", "Я уже готов."),
    entry("still", "դեռ", "still", "ещё", "der", "stil", "yeshchyo", "Ես դեռ աշխատում եմ։", "I am still working.", "Я ещё работаю."),
    entry("next-week", "հաջորդ շաբաթ", "next week", "на следующей неделе", "hachord shabat", "nekst week", "na sleduyushchey nedele", "Հաջորդ շաբաթ կգամ։", "I will come next week.", "Я приеду на следующей неделе."),
    entry("last-year", "անցյալ տարի", "last year", "в прошлом году", "antsyal tari", "last yeer", "v proshlom godu", "Անցյալ տարի Երևանում էի։", "Last year I was in Yerevan.", "В прошлом году я был в Ереване."),
    entry("would-like", "կուզենայի", "I would like", "я хотел бы", "kuzenayi", "eye wood like", "ya khotel by", "Կուզենայի սուրճ խմել։", "I would like to drink coffee.", "Я хотел бы выпить кофе."),
    entry("decide", "որոշել", "to decide", "решить", "voroshel", "too di-side", "reshit", "Ես պետք է որոշեմ այսօր։", "I need to decide today.", "Мне нужно решить сегодня."),
    entry("remember", "հիշում եմ", "I remember", "я помню", "hishum em", "eye ri-mem-ber", "ya pomnyu", "Ես հիշում եմ քո անունը։", "I remember your name.", "Я помню твоё имя."),
    entry("plan", "ծրագիր", "plan", "план", "tsragir", "plan", "plan", "Իմ ծրագիրը պարզ է։", "My plan is simple.", "Мой план простой."),
  ],
};

export const SENTENCES_B1: Record<B1UnitKey, Array<{ hy: string; en: string; ru: string }>> = {
  work: [
    { hy: "Ես գրասենյակում եմ աշխատում", en: "I work in an office", ru: "Я работаю в офисе" },
    { hy: "Իմ գործընկերն օգնում է ինձ", en: "My colleague helps me", ru: "Мой коллега помогает мне" },
  ],
  health: [
    { hy: "Ես պետք է գնամ բժշկի", en: "I need to see a doctor", ru: "Мне нужно к врачу" },
    { hy: "Ես հոգնած եմ և գլխացավ ունեմ", en: "I am tired and I have a headache", ru: "Я устал и у меня головная боль" },
  ],
  opinions: [
    { hy: "Ես կարծում եմ որ սա հետաքրքիր է", en: "I think this is interesting", ru: "Я думаю что это интересно" },
    { hy: "Ես նախընտրում եմ սա որովհետև դժվար չէ", en: "I prefer this because it is not difficult", ru: "Я предпочитаю это потому что это не трудно" },
  ],
  plans: [
    { hy: "Ես արդեն որոշել եմ", en: "I have already decided", ru: "Я уже решил" },
    { hy: "Հաջորդ շաբաթ կուզենայի գնալ", en: "Next week I would like to go", ru: "На следующей неделе я хотел бы поехать" },
  ],
};
