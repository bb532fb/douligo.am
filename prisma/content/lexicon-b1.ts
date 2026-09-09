import type { Lexeme } from "./types";

export type B1UnitKey = "work" | "health" | "opinions" | "plans" | "experiences" | "reasons";

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
    entry("think", "կարծում եմ", "I think", "я думаю", "kartsum em", "eye think", "ya dumayu", "Ես կարծում եմ որ սա ճիշտ է։", "I think this is right.", "Я думаю что это правильно."),
    entry("prefer", "նախընտրում եմ", "I prefer", "я предпочитаю", "nakhyntrum em", "eye pri-fur", "ya predpochitayu", "Ես նախընտրում եմ աշխատել տանը։", "I prefer to work at home.", "Я предпочитаю работать дома."),
    entry("interesting", "հետաքրքիր", "interesting", "интересный", "hetakrkir", "in-tuh-res-ting", "interesny", "Այս նախագիծը հետաքրքիր է։", "This project is interesting.", "Этот проект интересный."),
    entry("difficult", "դժվար", "difficult", "трудный", "dzhvar", "dif-i-kult", "trudny", "Այս աշխատանքը դժվար է։", "This job is difficult.", "Эта работа трудная."),
    entry("maybe", "գուցե", "maybe", "может быть", "gutse", "may-bee", "mozhet byt", "Գուցե վաղը կգամ։", "Maybe I will come tomorrow.", "Может быть я приду завтра."),
    entry("because", "որովհետև", "because", "потому что", "vorovhetev", "bi-kawz", "potomu chto", "Ես մնում եմ որովհետև հոգնած եմ։", "I am staying because I am tired.", "Я остаюсь потому что устал."),
    entry("agree", "համաձայն եմ", "I agree", "я согласен", "hamadzayn em", "eye uh-gree", "ya soglasen", "Ես համաձայն եմ քո կարծիքի հետ։", "I agree with your opinion.", "Я согласен с твоим мнением."),
    entry("but", "բայց", "but", "но", "bayts", "but", "no", "Ես հոգնած եմ բայց աշխատում եմ։", "I am tired but I am working.", "Я устал но я работаю."),
  ],
  plans: [
    entry("already", "արդեն", "already", "уже", "arden", "awl-red-ee", "uzhe", "Ես արդեն պատրաստ եմ։", "I am already ready.", "Я уже готов."),
    entry("still", "դեռ", "still", "ещё", "der", "stil", "yeshchyo", "Ես դեռ աշխատում եմ։", "I am still working.", "Я ещё работаю."),
    entry("would-like", "կուզենայի", "I would like", "я хотел бы", "kuzenayi", "eye wood like", "ya khotel by", "Կուզենայի սուրճ խմել։", "I would like to drink coffee.", "Я хотел бы выпить кофе."),
    entry("decide", "որոշել", "to decide", "решить", "voroshel", "too di-side", "reshit", "Ես պետք է որոշեմ այսօր։", "I need to decide today.", "Мне нужно решить сегодня."),
    entry("plan", "ծրագիր", "plan", "план", "tsragir", "plan", "plan", "Իմ ծրագիրը պարզ է։", "My plan is simple.", "Мой план простой."),
    entry("if", "եթե", "if", "если", "yete", "if", "yesli", "Եթե ժամանակ ունենամ կգամ։", "If I have time I will come.", "Если будет время я приду."),
    entry("when", "երբ", "when", "когда", "yerb", "wen", "kogda", "Երբ ժամանակ ունենամ կզանգեմ։", "When I have time I will call.", "Когда будет время я позвоню."),
    entry("enough", "բավական", "enough", "достаточно", "bavakan", "i-nuf", "dostatochno", "Սա բավական է այսօր։", "This is enough for today.", "Этого достаточно на сегодня."),
  ],
  experiences: [
    entry("last-year", "անցյալ տարի", "last year", "в прошлом году", "antsyal tari", "last yeer", "v proshlom godu", "Անցյալ տարի Երևանում էի։", "Last year I was in Yerevan.", "В прошлом году я был в Ереване."),
    entry("remember", "հիշում եմ", "I remember", "я помню", "hishum em", "eye ri-mem-ber", "ya pomnyu", "Ես հիշում եմ քո անունը։", "I remember your name.", "Я помню твоё имя."),
    entry("before", "առաջ", "before", "раньше", "araj", "bi-for", "ranshe", "Ես առաջ այստեղ էի ապրում։", "I lived here before.", "Я раньше здесь жил."),
    entry("after", "հետո", "after", "потом", "heto", "af-ter", "potom", "Հանդիպումից հետո տուն կգնամ։", "After the meeting I will go home.", "После встречи я пойду домой."),
    entry("long-time", "երկար ժամանակ", "for a long time", "долго", "yerkar zhamanak", "for a long time", "dolgo", "Ես երկար ժամանակ սպասեցի։", "I waited for a long time.", "Я долго ждал."),
    entry("have-been", "եղել եմ", "I have been", "я бывал", "yeghel em", "eye hav bin", "ya byval", "Ես այնտեղ եղել եմ։", "I have been there.", "Я там бывал."),
    entry("once", "մի անգամ", "once", "однажды", "mi angam", "wunts", "odnazhdy", "Ես մի անգամ այնտեղ էի։", "I was there once.", "Я однажды там был."),
    entry("never", "երբեք", "never", "никогда", "yerbek", "nev-er", "nikogda", "Ես երբեք չեմ մոռանում։", "I never forget.", "Я никогда не забываю."),
  ],
  reasons: [
    entry("thats-why", "դրա համար", "that's why", "поэтому", "dra hamar", "thats why", "poetomu", "Ես հոգնած եմ դրա համար մնում եմ։", "I am tired that's why I am staying.", "Я устал поэтому я остаюсь."),
    entry("however", "սակայն", "however", "однако", "sakayn", "how-ev-er", "odnako", "Սակայն ես համաձայն եմ։", "However I agree.", "Однако я согласен."),
    entry("for-example", "օրինակ", "for example", "например", "orinak", "for eg-zam-puhl", "naprimer", "Օրինակ այս նախագիծը կարևոր է։", "For example this project is important.", "Например этот проект важный."),
    entry("in-my-opinion", "իմ կարծիքով", "in my opinion", "по-моему", "im kartsikov", "in my uh-pin-yun", "po moyemu", "Իմ կարծիքով սա ճիշտ է։", "In my opinion this is right.", "По-моему это правильно."),
    entry("although", "չնայած", "although", "хотя", "chnayats", "awl-thoh", "khotya", "Չնայած դժվար է ես շարունակում եմ։", "Although it is difficult I continue.", "Хотя это трудно я продолжаю."),
    entry("so", "ուրեմն", "so", "значит", "uremn", "soh", "znachit", "Ուրեմն մենք սկսում ենք։", "So we are starting.", "Значит мы начинаем."),
    entry("also", "նաև", "also", "также", "naev", "awl-soh", "takzhe", "Ես նաև համաձայն եմ։", "I also agree.", "Я также согласен."),
    entry("or", "կամ", "or", "или", "kam", "or", "ili", "Թեյ կամ սուրճ։", "Tea or coffee.", "Чай или кофе."),
  ],
};

export const SENTENCES_B1: Record<B1UnitKey, Array<{ hy: string; en: string; ru: string }>> = {
  work: [
    { hy: "Ես գրասենյակում եմ աշխատում որովհետև աշխատանքս կարևոր է", en: "I work in an office because my job is important", ru: "Я работаю в офисе потому что моя работа важная" },
    { hy: "Ես պետք է բացատրեմ այս նախագիծը գործընկերոջս", en: "I need to explain this project to my colleague", ru: "Мне нужно объяснить этот проект коллеге" },
  ],
  health: [
    { hy: "Ես պետք է գնամ բժշկի որովհետև գլխացավ ունեմ", en: "I need to see a doctor because I have a headache", ru: "Мне нужно к врачу потому что у меня головная боль" },
    { hy: "Ես հոգնած եմ բայց սա մեծ խնդիր չէ", en: "I am tired but this is not a big problem", ru: "Я устал но это не большая проблема" },
  ],
  opinions: [
    { hy: "Ես կարծում եմ որ սա հետաքրքիր է", en: "I think that this is interesting", ru: "Я думаю что это интересно" },
    { hy: "Ես նախընտրում եմ սա որովհետև դժվար չէ", en: "I prefer this because it is not difficult", ru: "Я предпочитаю это потому что это не трудно" },
  ],
  plans: [
    { hy: "Եթե ժամանակ ունենամ կուզենայի գնալ", en: "If I have time I would like to go", ru: "Если будет время я хотел бы поехать" },
    { hy: "Ես արդեն որոշել եմ այս ծրագիրը", en: "I have already decided this plan", ru: "Я уже решил этот план" },
  ],
  experiences: [
    { hy: "Անցյալ տարի ես Երևանում էի և հիշում եմ", en: "Last year I was in Yerevan and I remember", ru: "В прошлом году я был в Ереване и я помню" },
    { hy: "Ես այնտեղ եղել եմ մի անգամ", en: "I have been there once", ru: "Я там бывал однажды" },
  ],
  reasons: [
    { hy: "Իմ կարծիքով սա կարևոր է", en: "In my opinion this is important", ru: "По моему это важно" },
    { hy: "Չնայած դժվար է ես համաձայն եմ", en: "Although it is difficult I agree", ru: "Хотя это трудно я согласен" },
  ],
};
