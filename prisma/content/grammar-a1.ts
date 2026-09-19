import { hyDrillsFor } from "./grammar-a1-hy";
import { GRAMMAR_DRILLS_A1_RU } from "./grammar-a1-ru";
import type { A1UnitKey } from "./lexicon-a1";

export type GrammarDrill = {
  unit: string;
  prompt: string;
  correct: string;
  wrong: string[];
  explanation: string;
};

export const GRAMMAR_DRILLS_A1: GrammarDrill[] = [
  {
    unit: "greetings",
    prompt: "Ես լավ եմ։ Ո՞րն է ճիշտը։",
    correct: "I am fine",
    wrong: ["I fine", "I is fine", "Am I fine"],
    explanation: "Հայերենում «եմ»-ը վերջում է։ Անգլերենում I-ից հետո պարտադիր է am. Ոչ՝ I fine.",
  },
  {
    unit: "greetings",
    prompt: "Դու լավ ես։ Choose am / is / are.",
    correct: "are",
    wrong: ["am", "is", "be"],
    explanation: "You-ից հետո միշտ are. I am, you are, he/she/it is.",
  },
  {
    unit: "greetings",
    prompt: "Are you fine?",
    correct: "Yes I am",
    wrong: ["Yes I are", "Yes I fine", "Yes I is"],
    explanation: "Yes/No հարցին կարճ պատասխան՝ Yes, I am. Ոչ՝ Yes, I fine.",
  },
  {
    unit: "introduce",
    prompt: "Ես ուսանող եմ։",
    correct: "I am a student",
    wrong: ["I student", "I am student", "I is a student"],
    explanation: "Պետք են երկու բան՝ am և հոդ a. Ոչ՝ I student.",
  },
  {
    unit: "introduce",
    prompt: "Նա ուսանող է։ He ___ a student.",
    correct: "is",
    wrong: ["am", "are", "be"],
    explanation: "He / she / it + is. I am, you are, they are.",
  },
  {
    unit: "introduce",
    prompt: "What is your name?",
    correct: "My name is Armen",
    wrong: ["I name Armen", "My name Armen", "I am name Armen"],
    explanation: "My name is + անուն. Հայերեն «իմ անունն է» = My name is, ոչ I name.",
  },
  {
    unit: "introduce",
    prompt: "Where do you live?",
    correct: "I live in Yerevan",
    wrong: ["I live Yerevan", "I am live in Yerevan", "I living in Yerevan"],
    explanation: "Live + in + քաղաք. Ոչ՝ I live Yerevan.",
  },
  {
    unit: "family",
    prompt: "Ես եղբայր ունեմ։",
    correct: "I have a brother",
    wrong: ["I have brother", "I am have a brother", "I has a brother"],
    explanation: "I/you/we/they have. He/she has. Brother-ից առաջ a.",
  },
  {
    unit: "family",
    prompt: "Նա քույր ունի։ She ___ a sister.",
    correct: "has",
    wrong: ["have", "is", "are"],
    explanation: "He/she/it has. I have.",
  },
  {
    unit: "family",
    prompt: "Սա իմ մայրն է։",
    correct: "This is my mother",
    wrong: ["This is I mother", "This my mother", "This is me mother"],
    explanation: "my/your/his/her/our/their + գոյական. Ոչ՝ I mother.",
  },
  {
    unit: "family",
    prompt: "Ես քույր չունեմ։",
    correct: "I do not have a sister",
    wrong: ["I am not have a sister", "I have not a sister", "I not have sister"],
    explanation: "Present Simple ժխտում՝ do not / don't + have. Ոչ՝ I am not have.",
  },
  {
    unit: "numbers",
    prompt: "How many books do you have?",
    correct: "I have two books",
    wrong: ["I have two book", "I am have two books", "I have books two"],
    explanation: "How many + հոգնակի. two books, ոչ two book.",
  },
  {
    unit: "numbers",
    prompt: "What time is it?",
    correct: "It is ten o'clock",
    wrong: ["It ten o'clock", "Is ten o'clock", "The time is ten"],
    explanation: "It is + ժամ. Հայերեն «ժամը տասն է» = It is ten o'clock.",
  },
  {
    unit: "numbers",
    prompt: "When do you work?",
    correct: "I work on Monday",
    wrong: ["I work in Monday", "I work at Monday", "I work Monday"],
    explanation: "օրերի հետ on Monday. in = ամիս/տարի, at = ժամ.",
  },
  {
    unit: "food",
    prompt: "Ես սուրճ եմ ուզում։",
    correct: "I want a coffee",
    wrong: ["I want coffee a", "I want an coffee", "I am want a coffee"],
    explanation: "a + բաղաձայն հնչյուն (a coffee). an + ձայնավոր (an apple).",
  },
  {
    unit: "food",
    prompt: "This is ___ apple.",
    correct: "an",
    wrong: ["a", "the", "one"],
    explanation: "an apple — apple-ը ձայնավորով է սկսվում.",
  },
  {
    unit: "food",
    prompt: "Ես թեյ չեմ ուզում։",
    correct: "I do not want tea",
    wrong: ["I am not want tea", "I want not tea", "I not want tea"],
    explanation: "don't / do not + want. Ոչ՝ I am not want.",
  },
  {
    unit: "places",
    prompt: "The book is ___ the table.",
    correct: "on",
    wrong: ["in", "at", "under"],
    explanation: "on the table = սեղանի վրա. in = ներսում, at = կետ.",
  },
  {
    unit: "places",
    prompt: "There ___ a chair in the room.",
    correct: "is",
    wrong: ["are", "am", "have"],
    explanation: "There is + եզակի. There are + հոգնակի.",
  },
  {
    unit: "places",
    prompt: "There ___ two windows.",
    correct: "are",
    wrong: ["is", "am", "have"],
    explanation: "two windows = հոգնակի → There are.",
  },
  {
    unit: "routine",
    prompt: "He ___ to school every day.",
    correct: "goes",
    wrong: ["go", "going", "is go"],
    explanation: "He/she/it + -s: he goes, she works. I/you/we/they go.",
  },
  {
    unit: "routine",
    prompt: "Նա չի աշխատում։ He ___ work.",
    correct: "does not",
    wrong: ["do not", "is not", "not"],
    explanation: "He/she/it ժխտում՝ does not / doesn't. I/you/we/they don't.",
  },
  {
    unit: "routine",
    prompt: "___ you work in the morning?",
    correct: "Do",
    wrong: ["Does", "Are", "Is"],
    explanation: "Do you…? Does he/she…? Are-ը to be-ի համար է.",
  },
  {
    unit: "routine",
    prompt: "___ she work today?",
    correct: "Does",
    wrong: ["Do", "Is", "Are"],
    explanation: "Does she work? Ոչ՝ Does she works և ոչ՝ Do she work.",
  },
  {
    unit: "shopping",
    prompt: "How much is this?",
    correct: "It is ten",
    wrong: ["They are ten", "I am ten", "This are ten"],
    explanation: "How much = գին. How many = քանակ։ It is + գին.",
  },
  {
    unit: "shopping",
    prompt: "Can I have a coffee?",
    correct: "Yes you can",
    wrong: ["Yes you do", "Yes I have", "Yes you are"],
    explanation: "Can-ի հարցին՝ Yes, you can / No, you can't.",
  },
  {
    unit: "hobbies",
    prompt: "I ___ swim.",
    correct: "can",
    wrong: ["cans", "am", "do"],
    explanation: "can բոլոր դեմքերով նույնն է. I can, she can. Ոչ՝ she cans.",
  },
  {
    unit: "hobbies",
    prompt: "Ես չեմ կարող լողալ։",
    correct: "I cannot swim",
    wrong: ["I can not to swim", "I don't can swim", "I am not swim"],
    explanation: "can't / cannot + բայ առանց to. Ոչ՝ I don't can.",
  },
  {
    unit: "hobbies",
    prompt: "Can you swim?",
    correct: "Yes I can",
    wrong: ["Yes I do", "Yes I swim", "Yes I am"],
    explanation: "Can you…? — Yes, I can. / No, I can't.",
  },
  {
    unit: "school",
    prompt: "I ___ English at school.",
    correct: "study",
    wrong: ["studies", "am study", "studying"],
    explanation: "I study, he studies. Առանց am.",
  },
  {
    unit: "school",
    prompt: "She ___ in an office.",
    correct: "works",
    wrong: ["work", "working", "is work"],
    explanation: "She works. -s միայն he/she/it-ի հետ.",
  },
  {
    unit: "everyday",
    prompt: "It is ___ today.",
    correct: "cold",
    wrong: ["colds", "a cold", "the cold"],
    explanation: "It is + adjective. It is cold. Not: It cold.",
  },
  {
    unit: "everyday",
    prompt: "This book is ___.",
    correct: "easy",
    wrong: ["easily", "an easy", "easier"],
    explanation: "be + adjective: This book is easy / difficult.",
  },
  {
    unit: "everyday",
    prompt: "This coat is ___.",
    correct: "new",
    wrong: ["a new", "news", "the new"],
    explanation: "be + ածական առանց a, եթե գոյականն արդեն կա՝ This coat is new.",
  },
  {
    unit: "review",
    prompt: "Ես ուսանող եմ։",
    correct: "I am a student",
    wrong: ["I student", "I am student", "Am I student"],
    explanation: "Հայերեն «եմ» + անորոշ առարկա → I am a student.",
  },
  {
    unit: "review",
    prompt: "Open the door.",
    correct: "Open the door",
    wrong: ["You open the door please are", "Opening the door", "To open the door"],
    explanation: "Հրամայական՝ բայն սկզբում. Open the door. Close the door.",
  },
  {
    unit: "review",
    prompt: "I live in Yerevan ___ I work here.",
    correct: "and",
    wrong: ["but", "or", "because"],
    explanation: "and = և, but = բայց, or = կամ, because = որովհետև.",
  },
  {
    unit: "review",
    prompt: "Tea ___ coffee?",
    correct: "or",
    wrong: ["and", "but", "because"],
    explanation: "or = կամ. Tea or coffee?",
  },
  {
    unit: "review",
    prompt: "___ are you at home?",
    correct: "Why",
    wrong: ["Who", "What", "Where"],
    explanation: "Why = ինչու. Who = ով, What = ինչ, Where = որտեղ.",
  },
];

export function drillsFor(unit: A1UnitKey, slug = "hy-en"): GrammarDrill[] {
  if (slug === "hy-ru") {
    return GRAMMAR_DRILLS_A1_RU.filter((item) => item.unit === unit);
  }
  if (slug === "en-hy" || slug === "ru-hy") {
    return hyDrillsFor(unit, slug);
  }
  return GRAMMAR_DRILLS_A1.filter((item) => item.unit === unit);
}
