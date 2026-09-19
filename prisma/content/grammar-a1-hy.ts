import type { A1UnitKey } from "./lexicon-a1";
import type { GrammarDrill } from "./grammar-a1";

type HyTrack = "en-hy" | "ru-hy";

type LocalizedDrill = {
  unit: A1UnitKey;
  prompt: Record<HyTrack, string>;
  correct: string;
  wrong: string[];
  explanation: Record<HyTrack, string>;
};

const DRILLS: LocalizedDrill[] = [
  {
    "unit": "greetings",
    "prompt": {
      "en-hy": "I am fine?",
      "ru-hy": "Я в порядке?"
    },
    "correct": "Ես լավ եմ",
    "wrong": [
      "Ես լավ",
      "Դու լավ ես",
      "I am fine"
    ],
    "explanation": {
      "en-hy": "English needs am. Armenian puts եմ at the end: Ես լավ եմ.",
      "ru-hy": "В русском часто нет есть. По-армянски եմ в конце: Ես լավ եմ."
    }
  },
  {
    "unit": "greetings",
    "prompt": {
      "en-hy": "Are you fine?",
      "ru-hy": "Ты в порядке?"
    },
    "correct": "Դու լավ ես",
    "wrong": [
      "ես Դու լավ ես",
      "Ես լավ եմ",
      "Are you fine"
    ],
    "explanation": {
      "en-hy": "You are → դու ... ես. Not եմ.",
      "ru-hy": "ты = դու ... ես. Не եմ."
    }
  },
  {
    "unit": "greetings",
    "prompt": {
      "en-hy": "What is this?",
      "ru-hy": "Что это?"
    },
    "correct": "Ինչ է սա",
    "wrong": [
      "Ինչ սա",
      "Ես լավ եմ",
      "What is this"
    ],
    "explanation": {
      "en-hy": "What is this? = Ինչ է սա։",
      "ru-hy": "Что это? = Ինչ է սա։"
    }
  },
  {
    "unit": "introduce",
    "prompt": {
      "en-hy": "I am a student?",
      "ru-hy": "Я студент?"
    },
    "correct": "Ես ուսանող եմ",
    "wrong": [
      "Ես ուսանող",
      "Իմ անունն է Արմեն",
      "I am a student"
    ],
    "explanation": {
      "en-hy": "Do not drop եմ. Not Ես ուսանող.",
      "ru-hy": "Нельзя опускать եմ. Не Ես ուսանող."
    }
  },
  {
    "unit": "introduce",
    "prompt": {
      "en-hy": "My name is Armen?",
      "ru-hy": "Меня зовут Армен?"
    },
    "correct": "Իմ անունն է Արմեն",
    "wrong": [
      "Իմ անունն Արմեն",
      "Ես ուսանող եմ",
      "My name is Armen"
    ],
    "explanation": {
      "en-hy": "իմ անունն է + name.",
      "ru-hy": "իմ անունն է + имя."
    }
  },
  {
    "unit": "introduce",
    "prompt": {
      "en-hy": "I live in Yerevan?",
      "ru-hy": "Я живу в Ереване?"
    },
    "correct": "Ես ապրում եմ Երևանում",
    "wrong": [
      "Ես ապրում Երևանում",
      "Ես ուսանող եմ",
      "I live in Yerevan"
    ],
    "explanation": {
      "en-hy": "ապրում եմ + Երևանում.",
      "ru-hy": "ապրում եմ + Երևանում."
    }
  },
  {
    "unit": "introduce",
    "prompt": {
      "en-hy": "Are you a student?",
      "ru-hy": "Ты студент?"
    },
    "correct": "Դու ուսանող ես",
    "wrong": [
      "ես Դու ուսանող ես",
      "Ես ուսանող եմ",
      "Are you a student"
    ],
    "explanation": {
      "en-hy": "դու ... ես, not եմ.",
      "ru-hy": "դու ... ես, не եմ."
    }
  },
  {
    "unit": "family",
    "prompt": {
      "en-hy": "I have a sister?",
      "ru-hy": "У меня есть сестра?"
    },
    "correct": "Ես ունեմ քույր",
    "wrong": [
      "Ես ուն քույր",
      "Սա քո մայրն է",
      "I have a sister"
    ],
    "explanation": {
      "en-hy": "ունեմ, not I have copied as ես ունի.",
      "ru-hy": "ունեմ, не у меня word-for-word."
    }
  },
  {
    "unit": "family",
    "prompt": {
      "en-hy": "This is your mother?",
      "ru-hy": "Это твоя мама?"
    },
    "correct": "Սա քո մայրն է",
    "wrong": [
      "Սա քո մայրն",
      "Ես ունեմ քույր",
      "This is your mother"
    ],
    "explanation": {
      "en-hy": "քո + noun. This is = սա ... է.",
      "ru-hy": "քո + существительное."
    }
  },
  {
    "unit": "family",
    "prompt": {
      "en-hy": "He has a brother?",
      "ru-hy": "У него есть брат?"
    },
    "correct": "Նա եղբայր ունի",
    "wrong": [
      "ես Նա եղբայր ունի",
      "Ես ունեմ քույր",
      "He has a brother"
    ],
    "explanation": {
      "en-hy": "նա ունի, not ունեմ.",
      "ru-hy": "նա ունի, не ունեմ."
    }
  },
  {
    "unit": "family",
    "prompt": {
      "en-hy": "I do not have a sister?",
      "ru-hy": "У меня нет сестры?"
    },
    "correct": "Ես քույր չունեմ",
    "wrong": [
      "Ես քույր չուն",
      "Ես ունեմ քույր",
      "I do not have a sister"
    ],
    "explanation": {
      "en-hy": "չունեմ. Not եմ չունեմ.",
      "ru-hy": "չունեմ. Не եմ չունեմ."
    }
  },
  {
    "unit": "numbers",
    "prompt": {
      "en-hy": "I have two books?",
      "ru-hy": "У меня две книги?"
    },
    "correct": "Ես ունեմ երկու գիրք",
    "wrong": [
      "Ես ուն երկու գիրք",
      "Ժամը քանիսն է",
      "I have two books"
    ],
    "explanation": {
      "en-hy": "երկու գիրք. Number + noun.",
      "ru-hy": "երկու գիրք."
    }
  },
  {
    "unit": "numbers",
    "prompt": {
      "en-hy": "What time is it?",
      "ru-hy": "Который час?"
    },
    "correct": "Ժամը քանիսն է",
    "wrong": [
      "Ժամը քանիսն",
      "Ես ունեմ երկու գիրք",
      "What time is it"
    ],
    "explanation": {
      "en-hy": "Ժամը քանիսն է։",
      "ru-hy": "Ժամը քանիսն է։"
    }
  },
  {
    "unit": "numbers",
    "prompt": {
      "en-hy": "I work on Monday?",
      "ru-hy": "Я работаю в понедельник?"
    },
    "correct": "Ես աշխատում եմ երկուշաբթի",
    "wrong": [
      "Ես աշխատում երկուշաբթի",
      "Ես ունեմ երկու գիրք",
      "I work on Monday"
    ],
    "explanation": {
      "en-hy": "երկուշաբթի աշխատում եմ.",
      "ru-hy": "երկուշաբթի աշխատում եմ."
    }
  },
  {
    "unit": "food",
    "prompt": {
      "en-hy": "I want a coffee?",
      "ru-hy": "Я хочу один кофе?"
    },
    "correct": "Ես մի սուրճ եմ ուզում",
    "wrong": [
      "Ես մի սուրճ ուզում",
      "Սա մի խնձոր է",
      "I want a coffee"
    ],
    "explanation": {
      "en-hy": "Armenian has no a/an. Ես սուրճ եմ ուզում.",
      "ru-hy": "В армянском нет a/an."
    }
  },
  {
    "unit": "food",
    "prompt": {
      "en-hy": "This is an apple?",
      "ru-hy": "Это яблоко?"
    },
    "correct": "Սա մի խնձոր է",
    "wrong": [
      "Սա մի խնձոր",
      "Ես մի սուրճ եմ ուզում",
      "This is an apple"
    ],
    "explanation": {
      "en-hy": "Սա մի խնձոր է. մի is not English an.",
      "ru-hy": "Սա մի խնձոր է."
    }
  },
  {
    "unit": "food",
    "prompt": {
      "en-hy": "I do not want tea?",
      "ru-hy": "Я не хочу чай?"
    },
    "correct": "Ես թեյ չեմ ուզում",
    "wrong": [
      "Ես թեյ չ ուզում",
      "Ես մի սուրճ եմ ուզում",
      "I do not want tea"
    ],
    "explanation": {
      "en-hy": "չեմ ուզում. եմ stays in չեմ.",
      "ru-hy": "չեմ ուզում."
    }
  },
  {
    "unit": "places",
    "prompt": {
      "en-hy": "The book is on the table?",
      "ru-hy": "Книга на столе?"
    },
    "correct": "Գիրքը սեղանի վրա է",
    "wrong": [
      "Գիրքը սեղանի վրա",
      "Սենյակում աթոռ կա",
      "The book is on the table"
    ],
    "explanation": {
      "en-hy": "սեղանի վրա. վրա = on.",
      "ru-hy": "սեղանի վրա = on."
    }
  },
  {
    "unit": "places",
    "prompt": {
      "en-hy": "There is a chair in the room?",
      "ru-hy": "В комнате есть стул?"
    },
    "correct": "Սենյակում աթոռ կա",
    "wrong": [
      "ես Սենյակում աթոռ կա",
      "Գիրքը սեղանի վրա է",
      "There is a chair in the room"
    ],
    "explanation": {
      "en-hy": "կա = there is.",
      "ru-hy": "կա = there is / есть."
    }
  },
  {
    "unit": "places",
    "prompt": {
      "en-hy": "There are two windows?",
      "ru-hy": "Есть два окна?"
    },
    "correct": "Երկու պատուհան կա",
    "wrong": [
      "ես Երկու պատուհան կա",
      "Գիրքը սեղանի վրա է",
      "There are two windows"
    ],
    "explanation": {
      "en-hy": "erku patuhan ka.",
      "ru-hy": "erku patuhan ka."
    }
  },
  {
    "unit": "routine",
    "prompt": {
      "en-hy": "I go to school every day?",
      "ru-hy": "Я каждый день хожу в школу?"
    },
    "correct": "Ես ամեն օր գնում եմ դպրոց",
    "wrong": [
      "Ես ամեն օր գնում դպրոց",
      "Նա ամեն օր աշխատում է",
      "I go to school every day"
    ],
    "explanation": {
      "en-hy": "ամեն օր գնում եմ. եմ at the end.",
      "ru-hy": "ամեն օր գնում եմ."
    }
  },
  {
    "unit": "routine",
    "prompt": {
      "en-hy": "He works every day?",
      "ru-hy": "Он работает каждый день?"
    },
    "correct": "Նա ամեն օր աշխատում է",
    "wrong": [
      "Նա ամեն օր աշխատում",
      "Ես ամեն օր գնում եմ դպրոց",
      "He works every day"
    ],
    "explanation": {
      "en-hy": "նա ... է, not եմ.",
      "ru-hy": "նա ... է, не եմ."
    }
  },
  {
    "unit": "routine",
    "prompt": {
      "en-hy": "I do not work in the evening?",
      "ru-hy": "Я вечером не работаю?"
    },
    "correct": "Ես երեկոյան չեմ աշխատում",
    "wrong": [
      "Ես երեկոյան չ աշխատում",
      "Ես ամեն օր գնում եմ դպրոց",
      "I do not work in the evening"
    ],
    "explanation": {
      "en-hy": "չեմ աշխատում.",
      "ru-hy": "չեմ աշխատում."
    }
  },
  {
    "unit": "shopping",
    "prompt": {
      "en-hy": "How much is this?",
      "ru-hy": "Сколько это стоит?"
    },
    "correct": "Որքան է գինը",
    "wrong": [
      "Որքան գինը",
      "Կարող եմ սուրճ ունենալ",
      "How much is this"
    ],
    "explanation": {
      "en-hy": "Որքան է գինը։",
      "ru-hy": "Որքան է գինը։"
    }
  },
  {
    "unit": "shopping",
    "prompt": {
      "en-hy": "Can I have a coffee?",
      "ru-hy": "Можно мне кофе?"
    },
    "correct": "Կարող եմ սուրճ ունենալ",
    "wrong": [
      "Կարող սուրճ ունենալ",
      "Որքան է գինը",
      "Can I have a coffee"
    ],
    "explanation": {
      "en-hy": "Կարող եմ ... ունենալ.",
      "ru-hy": "Կարող եմ ... ունենալ."
    }
  },
  {
    "unit": "hobbies",
    "prompt": {
      "en-hy": "I can swim?",
      "ru-hy": "Я умею плавать?"
    },
    "correct": "Ես կարող եմ լողալ",
    "wrong": [
      "Ես կարող լողալ",
      "Ես չեմ կարող լողալ",
      "I can swim"
    ],
    "explanation": {
      "en-hy": "կարող եմ + infinitive լողալ.",
      "ru-hy": "կարող եմ + լողալ."
    }
  },
  {
    "unit": "hobbies",
    "prompt": {
      "en-hy": "I cannot swim?",
      "ru-hy": "Я не умею плавать?"
    },
    "correct": "Ես չեմ կարող լողալ",
    "wrong": [
      "Ես չ կարող լողալ",
      "Ես կարող եմ լողալ",
      "I cannot swim"
    ],
    "explanation": {
      "en-hy": "չեմ կարող. Not կարող չեմ լողալ եմ.",
      "ru-hy": "չեմ կարող."
    }
  },
  {
    "unit": "hobbies",
    "prompt": {
      "en-hy": "Can you swim?",
      "ru-hy": "Ты умеешь плавать?"
    },
    "correct": "Կարող ես լողալ",
    "wrong": [
      "ես Կարող ես լողալ",
      "Ես կարող եմ լողալ",
      "Can you swim"
    ],
    "explanation": {
      "en-hy": "կարող ես, not կարող եմ.",
      "ru-hy": "կարող ես, не կարող եմ."
    }
  },
  {
    "unit": "school",
    "prompt": {
      "en-hy": "I study English?",
      "ru-hy": "Я учу английский?"
    },
    "correct": "Ես անգլերեն եմ սովորում",
    "wrong": [
      "Ես անգլերեն սովորում",
      "Նա գրասենյակում է աշխատում",
      "I study English"
    ],
    "explanation": {
      "en-hy": "անգլերեն եմ սովորում.",
      "ru-hy": "անգլերեն եմ սովորում."
    }
  },
  {
    "unit": "school",
    "prompt": {
      "en-hy": "She works in an office?",
      "ru-hy": "Она работает в офисе?"
    },
    "correct": "Նա գրասենյակում է աշխատում",
    "wrong": [
      "Նա գրասենյակում աշխատում",
      "Ես անգլերեն եմ սովորում",
      "She works in an office"
    ],
    "explanation": {
      "en-hy": "նա ... է աշխատում.",
      "ru-hy": "նա ... է աշխատում."
    }
  },
  {
    "unit": "everyday",
    "prompt": {
      "en-hy": "It is cold today?",
      "ru-hy": "Сегодня холодно?"
    },
    "correct": "Այսօր ցուրտ է",
    "wrong": [
      "Այսօր ցուրտ",
      "Ես ուրախ եմ",
      "It is cold today"
    ],
    "explanation": {
      "en-hy": "Այսօր ցուրտ է. է at the end.",
      "ru-hy": "Այսօր ցուրտ է."
    }
  },
  {
    "unit": "everyday",
    "prompt": {
      "en-hy": "I am happy?",
      "ru-hy": "Я счастлив?"
    },
    "correct": "Ես ուրախ եմ",
    "wrong": [
      "Ես ուրախ",
      "Այսօր ցուրտ է",
      "I am happy"
    ],
    "explanation": {
      "en-hy": "Ես ուրախ եմ. Keep եմ.",
      "ru-hy": "Ես ուրախ եմ. Нельзя без եմ."
    }
  },
  {
    "unit": "everyday",
    "prompt": {
      "en-hy": "This house is big?",
      "ru-hy": "Этот дом большой?"
    },
    "correct": "Այս տունը մեծ է",
    "wrong": [
      "Այս տունը մեծ",
      "Այսօր ցուրտ է",
      "This house is big"
    ],
    "explanation": {
      "en-hy": "Այս տունը մեծ է.",
      "ru-hy": "Այս տունը մեծ է."
    }
  },
  {
    "unit": "review",
    "prompt": {
      "en-hy": "I am a student?",
      "ru-hy": "Я студент?"
    },
    "correct": "Ես ուսանող եմ",
    "wrong": [
      "Ես ուսանող",
      "Բացիր դուռը",
      "I am a student"
    ],
    "explanation": {
      "en-hy": "Keep եմ. Not Ես ուսանող.",
      "ru-hy": "Нужно եմ. Не Ես ուսանող."
    }
  },
  {
    "unit": "review",
    "prompt": {
      "en-hy": "Open the door?",
      "ru-hy": "Открой дверь?"
    },
    "correct": "Բացիր դուռը",
    "wrong": [
      "ես Բացիր դուռը",
      "Ես ուսանող եմ",
      "Open the door"
    ],
    "explanation": {
      "en-hy": "Հրամայական՝ Բացիր դուռը։",
      "ru-hy": "Императив: Բացիր դուռը։"
    }
  },
  {
    "unit": "review",
    "prompt": {
      "en-hy": "I am at home because I am tired?",
      "ru-hy": "Я дома потому что устал?"
    },
    "correct": "Ես տանն եմ որովհետև հոգնած եմ",
    "wrong": [
      "Ես տանն որովհետև հոգնած եմ",
      "Ես ուսանող եմ",
      "I am at home because I am tired"
    ],
    "explanation": {
      "en-hy": "որովհետև joins two clauses.",
      "ru-hy": "որովհետև соединяет две части."
    }
  },
  {
    "unit": "review",
    "prompt": {
      "en-hy": "I do not understand?",
      "ru-hy": "Я не понимаю?"
    },
    "correct": "Ես չեմ հասկանում",
    "wrong": [
      "Ես չ հասկանում",
      "Ես ուսանող եմ",
      "I do not understand"
    ],
    "explanation": {
      "en-hy": "չեմ հասկանում.",
      "ru-hy": "չեմ հասկանում."
    }
  }
];

export function hyDrillsFor(unit: A1UnitKey, slug: HyTrack): GrammarDrill[] {
  return DRILLS.filter((item) => item.unit === unit).map((item) => ({
    unit: item.unit,
    prompt: item.prompt[slug],
    correct: item.correct,
    wrong: item.wrong,
    explanation: item.explanation[slug],
  }));
}
