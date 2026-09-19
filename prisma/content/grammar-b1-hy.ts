import type { GrammarDrill } from "./grammar-a1";

type HyTrack = "en-hy" | "ru-hy";

type Localized = {
  unit: string;
  prompt: Record<HyTrack, string>;
  correct: string;
  wrong: string[];
  explanation: Record<HyTrack, string>;
};

const DRILLS: Localized[] = [
  {
    unit: "work",
    prompt: { "en-hy": "I work in an office?", "ru-hy": "Я работаю в офисе?" },
    correct: "Ես գրասենյակում եմ աշխատում",
    wrong: ["Ես գրասենյակ եմ աշխատում", "Ես գրասենյակի վրա եմ աշխատում", "I work in an office"],
    explanation: {
      "en-hy": "գրասենյակում = in the office.",
      "ru-hy": "գրասենյակում = в офисе.",
    },
  },
  {
    unit: "work",
    prompt: { "en-hy": "I am responsible for this project?", "ru-hy": "Я отвечаю за этот проект?" },
    correct: "Ես պատասխանատու եմ այս նախագծի համար",
    wrong: ["Ես պատասխանատու եմ այս նախագիծ", "Ես պատասխանատու այս համար", "I am responsible"],
    explanation: {
      "en-hy": "պատասխանատու եմ + համար.",
      "ru-hy": "պատասխանատու եմ ... համար.",
    },
  },
  {
    unit: "work",
    prompt: { "en-hy": "The project is finished?", "ru-hy": "Проект закончен?" },
    correct: "Նախագիծը ավարտված է",
    wrong: ["Նախագիծը ավարտված", "Նախագիծը ավարտել եմ է", "The project is finished"],
    explanation: {
      "en-hy": "ավարտված է. Keep է.",
      "ru-hy": "ավարտված է.",
    },
  },
  {
    unit: "health",
    prompt: { "en-hy": "I have a headache?", "ru-hy": "У меня головная боль?" },
    correct: "Ես գլխացավ ունեմ",
    wrong: ["Ես գլխացավ եմ", "Ես ունեմ գլխացավ եմ", "I have a headache"],
    explanation: {
      "en-hy": "ունեմ, not եմ, for pain.",
      "ru-hy": "ունեմ, не եմ.",
    },
  },
  {
    unit: "health",
    prompt: { "en-hy": "I feel worse?", "ru-hy": "Я чувствую себя хуже?" },
    correct: "Ես ավելի վատ եմ զգում",
    wrong: ["Ես ավելի վատ զգում", "Ես վատավելի եմ", "I feel worse"],
    explanation: {
      "en-hy": "ավելի վատ եմ զգում.",
      "ru-hy": "ավելի վատ եմ զգում.",
    },
  },
  {
    unit: "health",
    prompt: { "en-hy": "I need to rest?", "ru-hy": "Мне нужно отдохнуть?" },
    correct: "Ես պետք է հանգստանամ",
    wrong: ["Ես պետք է հանգստանալ եմ", "Ինձ հանգստանամ է պետք եմ", "I need to rest"],
    explanation: {
      "en-hy": "պետք է + subjunctive հանգստանամ.",
      "ru-hy": "պետք է հանգստանամ.",
    },
  },
  {
    unit: "opinions",
    prompt: { "en-hy": "I think that this is right?", "ru-hy": "Я думаю что это правильно?" },
    correct: "Ես կարծում եմ որ սա ճիշտ է",
    wrong: ["Ես կարծում եմ սա ճիշտ", "Ես think որ սա", "I think that"],
    explanation: {
      "en-hy": "կարծում եմ որ + է.",
      "ru-hy": "կարծում եմ որ.",
    },
  },
  {
    unit: "opinions",
    prompt: { "en-hy": "I stay because I am tired?", "ru-hy": "Я остаюсь потому что устал?" },
    correct: "որովհետև",
    wrong: ["բայց", "դրա համար միայն", "չնայած"],
    explanation: {
      "en-hy": "որովհետև = because. դրա համար = that's why.",
      "ru-hy": "որովհետև = потому что. դրա համար = поэтому.",
    },
  },
  {
    unit: "opinions",
    prompt: { "en-hy": "I agree with your opinion?", "ru-hy": "Я согласен с твоим мнением?" },
    correct: "Ես համաձայն եմ քո կարծիքի հետ",
    wrong: ["Ես համաձայն եմ քո կարծիք", "Ես համաձայն քո հետ եմ կարծիք", "I agree"],
    explanation: {
      "en-hy": "համաձայն եմ + հետ.",
      "ru-hy": "համաձայն եմ ... հետ.",
    },
  },
  {
    unit: "plans",
    prompt: { "en-hy": "If I have time I will come?", "ru-hy": "Если будет время я приду?" },
    correct: "Եթե ժամանակ ունենամ կգամ",
    wrong: ["Եթե ժամանակ ունեմ կգամ եմ", "Եթե կունենամ գամ", "If I have time"],
    explanation: {
      "en-hy": "եթե + ունենամ, կգամ.",
      "ru-hy": "եթե ... կգամ.",
    },
  },
  {
    unit: "plans",
    prompt: { "en-hy": "I would like to drink coffee?", "ru-hy": "Я хотел бы выпить кофе?" },
    correct: "Կուզենայի սուրճ խմել",
    wrong: ["Կուզենայի սուրճ եմ խմել", "Ես կուզեմ like սուրճ", "I would like"],
    explanation: {
      "en-hy": "կուզենայի + infinitive.",
      "ru-hy": "կուզենայի + խմել.",
    },
  },
  {
    unit: "plans",
    prompt: { "en-hy": "As soon as I have time I will call?", "ru-hy": "Как только будет время я позвоню?" },
    correct: "Հենց որ ժամանակ ունենամ կզանգեմ",
    wrong: ["Հենց որ ժամանակ ունեմ զանգում եմ", "Երբ կունենամ զանգեմ", "As soon as"],
    explanation: {
      "en-hy": "հենց որ + ունենամ, կզանգեմ.",
      "ru-hy": "հենց որ ... կզանգեմ.",
    },
  },
  {
    unit: "experiences",
    prompt: { "en-hy": "I have been there?", "ru-hy": "Я там бывал?" },
    correct: "Ես այնտեղ եղել եմ",
    wrong: ["Ես այնտեղ էի երեկ միայն", "Ես այնտեղ եղել", "I have been there"],
    explanation: {
      "en-hy": "եղել եմ = experience. էի = that time.",
      "ru-hy": "եղել եմ = опыт. էի = тогда.",
    },
  },
  {
    unit: "experiences",
    prompt: { "en-hy": "Have you ever been there?", "ru-hy": "Ты когда-либо там бывал?" },
    correct: "Դու երբևէ այնտեղ եղել ես",
    wrong: ["Դու երբեք այնտեղ եղել ես հարց", "Դու եղել ես ever", "Have you ever"],
    explanation: {
      "en-hy": "երբևէ = ever. երբեք = never.",
      "ru-hy": "երբևէ = когда-либо. երբեք = никогда.",
    },
  },
  {
    unit: "experiences",
    prompt: { "en-hy": "I have not decided yet?", "ru-hy": "Я ещё не решил?" },
    correct: "Ես դեռ չեմ որոշել",
    wrong: ["Ես արդեն չեմ որոշել", "Ես դեռ որոշել չ", "I have not decided"],
    explanation: {
      "en-hy": "դեռ չեմ = not yet. արդեն = already.",
      "ru-hy": "դեռ չեմ = ещё не. արդեն = уже.",
    },
  },
  {
    unit: "reasons",
    prompt: { "en-hy": "Although it is difficult I agree?", "ru-hy": "Хотя это трудно я согласен?" },
    correct: "Չնայած դժվար է ես համաձայն եմ",
    wrong: ["Որովհետև դժվար է ես համաձայն եմ", "Չնայած դժվար ես համաձայն", "Although"],
    explanation: {
      "en-hy": "չնայած = although. որովհետև = because.",
      "ru-hy": "չնայած = хотя. որովհետև = потому что.",
    },
  },
  {
    unit: "reasons",
    prompt: { "en-hy": "In my opinion this is right?", "ru-hy": "По-моему это правильно?" },
    correct: "Իմ կարծիքով սա ճիշտ է",
    wrong: ["Իմ կարծիք սա ճիշտ", "Ես opinion սա ճիշտ է", "In my opinion"],
    explanation: {
      "en-hy": "իմ կարծիքով + է.",
      "ru-hy": "իմ կարծիքով.",
    },
  },
  {
    unit: "reasons",
    prompt: { "en-hy": "I am tired that's why I am staying?", "ru-hy": "Я устал поэтому я остаюсь?" },
    correct: "դրա համար",
    wrong: ["որովհետև", "չնայած", "օրինակ"],
    explanation: {
      "en-hy": "դրա համար = that's why.",
      "ru-hy": "դրա համար = поэтому.",
    },
  },
];

export function hyDrillsB1(unit: string, slug: HyTrack): GrammarDrill[] {
  return DRILLS.filter((item) => item.unit === unit).map((item) => ({
    unit: item.unit,
    prompt: item.prompt[slug],
    correct: item.correct,
    wrong: item.wrong,
    explanation: item.explanation[slug],
  }));
}
