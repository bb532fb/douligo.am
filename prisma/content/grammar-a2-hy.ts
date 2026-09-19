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
    unit: "city",
    prompt: { "en-hy": "The school is in the city?", "ru-hy": "Школа в городе?" },
    correct: "Դպրոցը քաղաքում է",
    wrong: ["Դպրոցը քաղաք է", "Դպրոցը քաղաքի վրա է", "The school is in the city"],
    explanation: {
      "en-hy": "-ում = in. քաղաքում, not քաղաք.",
      "ru-hy": "-ում = в. քաղաքում, не քաղաք.",
    },
  },
  {
    unit: "city",
    prompt: { "en-hy": "The bank is next to the park?", "ru-hy": "Банк рядом с парком?" },
    correct: "Բանկը այգու կողքին է",
    wrong: ["Բանկը այգի կողքին է", "Բանկը այգում կողքին", "The bank is next to"],
    explanation: {
      "en-hy": "կողքին needs այգու (genitive).",
      "ru-hy": "կողքին + այգու (род. п.).",
    },
  },
  {
    unit: "city",
    prompt: { "en-hy": "The shop is on the left?", "ru-hy": "Магазин налево?" },
    correct: "Խանութը ձախ է",
    wrong: ["Խանութը ձախում է", "Խանութը on left է", "The shop is on the left"],
    explanation: {
      "en-hy": "ձախ է. No on.",
      "ru-hy": "ձախ է. Без налево copy.",
    },
  },
  {
    unit: "travel",
    prompt: { "en-hy": "I need a ticket?", "ru-hy": "Мне нужен билет?" },
    correct: "Ինձ տոմս է պետք",
    wrong: ["Ես տոմս ունեմ պետք", "Ես need տոմս", "I need a ticket"],
    explanation: {
      "en-hy": "ինձ + noun + է պետք. Not ես ունեմ.",
      "ru-hy": "ինձ ... է պետք, не у меня есть.",
    },
  },
  {
    unit: "travel",
    prompt: { "en-hy": "I take the bus?", "ru-hy": "Я еду на автобусе?" },
    correct: "Ես ավտոբուս եմ նստում",
    wrong: ["Ես ավտոբուս նստում", "Ես take ավտոբուս", "I take the bus"],
    explanation: {
      "en-hy": "նստում եմ. Keep եմ.",
      "ru-hy": "նստում եմ. Нельзя без եմ.",
    },
  },
  {
    unit: "travel",
    prompt: { "en-hy": "I need a map?", "ru-hy": "Мне нужна карта?" },
    correct: "Ինձ քարտեզ է պետք",
    wrong: ["Ինձ քարտեզ պետք", "Ես քարտեզ եմ պետք", "I need a map"],
    explanation: {
      "en-hy": "է պետք stays.",
      "ru-hy": "է պետք обязательно.",
    },
  },
  {
    unit: "past",
    prompt: { "en-hy": "Yesterday I was at home?", "ru-hy": "Вчера я был дома?" },
    correct: "Երեկ ես տանն էի",
    wrong: ["Երեկ ես տանն եմ", "Երեկ ես տանն էր", "Yesterday I was at home"],
    explanation: {
      "en-hy": "ես → էի. Not եմ (present).",
      "ru-hy": "ես → էի. Не եմ.",
    },
  },
  {
    unit: "past",
    prompt: { "en-hy": "I did not go to school?", "ru-hy": "Я не пошёл в школу?" },
    correct: "Ես դպրոց չգնացի",
    wrong: ["Ես դպրոց չեմ գնացի", "Ես դպրոց չ գնացի", "I did not go"],
    explanation: {
      "en-hy": "չ + verb. չգնացի, not չեմ գնացի.",
      "ru-hy": "չգնացի. Не չեմ գնացի.",
    },
  },
  {
    unit: "past",
    prompt: { "en-hy": "I went to the shop?", "ru-hy": "Я пошёл в магазин?" },
    correct: "Ես գնացի խանութ",
    wrong: ["Ես գնում եմ խանութ երեկ", "Ես գնալ խանութ", "I went to the shop"],
    explanation: {
      "en-hy": "գնացի = past. գնում եմ = now.",
      "ru-hy": "գնացի = прошлое. գնում եմ = сейчас.",
    },
  },
  {
    unit: "future",
    prompt: { "en-hy": "Tomorrow I will go home?", "ru-hy": "Завтра я пойду домой?" },
    correct: "Վաղը ես տուն կգնամ",
    wrong: ["Վաղը ես տուն գնամ", "Վաղը ես տուն գնում եմ", "Tomorrow I will go"],
    explanation: {
      "en-hy": "կ + verb: կգնամ. Do not drop կ.",
      "ru-hy": "կգնամ. կ обязательна.",
    },
  },
  {
    unit: "future",
    prompt: { "en-hy": "I am going to go home?", "ru-hy": "Я собираюсь пойти домой?" },
    correct: "Ես պատրաստվում եմ տուն գնալ",
    wrong: ["Ես պատրաստվում տուն գնալ", "Ես կգնամ պատրաստվում", "I am going to"],
    explanation: {
      "en-hy": "պատրաստվում եմ + infinitive.",
      "ru-hy": "պատրաստվում եմ + դեռևս.",
    },
  },
  {
    unit: "future",
    prompt: { "en-hy": "I will not be late?", "ru-hy": "Я не буду поздно?" },
    correct: "Ես ուշ չեմ լինի",
    wrong: ["Ես ուշ չ լինի", "Ես չկգնամ ուշ", "I will not be late"],
    explanation: {
      "en-hy": "չեմ լինի. եմ stays inside չեմ.",
      "ru-hy": "չեմ լինի.",
    },
  },
  {
    unit: "compare",
    prompt: { "en-hy": "This bread is cheaper than that?", "ru-hy": "Этот хлеб дешевле чем тот?" },
    correct: "Այս հացը ավելի էժան է քան այդը",
    wrong: ["Այս հացը էժան է քան ավելի", "Այս հացը more էժան", "This bread is cheaper"],
    explanation: {
      "en-hy": "ավելի + adj + քան.",
      "ru-hy": "ավելի ... քան.",
    },
  },
  {
    unit: "compare",
    prompt: { "en-hy": "This hotel is more expensive?", "ru-hy": "Эта гостиница более дорогая?" },
    correct: "Այս հյուրանոցը ավելի թանկ է",
    wrong: ["Այս հյուրանոցը թանկավելի է", "Այս հյուրանոցը more թանկ", "This hotel is more"],
    explanation: {
      "en-hy": "ավելի թանկ է. No -er on Armenian.",
      "ru-hy": "ավելի թանկ է.",
    },
  },
  {
    unit: "compare",
    prompt: { "en-hy": "This hotel is too expensive?", "ru-hy": "Эта гостиница слишком дорогая?" },
    correct: "Այս հյուրանոցը շատ թանկ է",
    wrong: ["Այս հյուրանոցը too թանկ է", "Այս հյուրանոցը ավելի շատ թանկ քան too", "too expensive"],
    explanation: {
      "en-hy": "շատ = very/too here. No too.",
      "ru-hy": "շատ թանկ. Не слишком copy.",
    },
  },
  {
    unit: "invites",
    prompt: { "en-hy": "Would you like tea?", "ru-hy": "Хотел бы ты чай?" },
    correct: "Կուզես թեյ",
    wrong: ["Սիրում ես թեյ հիմա", "Կուզեմ թեյ դու", "Would you like tea"],
    explanation: {
      "en-hy": "կուզես = offer. սիրում ես = habit.",
      "ru-hy": "կուզես = предложение. սիրում ես = привычка.",
    },
  },
  {
    unit: "invites",
    prompt: { "en-hy": "Let us go to the park?", "ru-hy": "Давай пойдём в парк?" },
    correct: "Եկ գնանք այգի",
    wrong: ["Եկ գնում ենք այգի", "Let's այգի", "Let us go"],
    explanation: {
      "en-hy": "եկ + գնանք (subjunctive).",
      "ru-hy": "եկ գնանք. Не գնում ենք.",
    },
  },
  {
    unit: "invites",
    prompt: { "en-hy": "Are you free tomorrow?", "ru-hy": "Ты свободен завтра?" },
    correct: "Ազատ ես վաղը",
    wrong: ["Ազատ եմ վաղը դու", "Դու ազատ", "Are you free"],
    explanation: {
      "en-hy": "դու → ես: ազատ ես.",
      "ru-hy": "ազատ ես, не ազատ եմ.",
    },
  },
];

export function hyDrillsA2(unit: string, slug: HyTrack): GrammarDrill[] {
  return DRILLS.filter((item) => item.unit === unit).map((item) => ({
    unit: item.unit,
    prompt: item.prompt[slug],
    correct: item.correct,
    wrong: item.wrong,
    explanation: item.explanation[slug],
  }));
}
