import type { TopicKind } from "@prisma/client";
import type { UnitKey } from "./lexicon";
import type { CefrLevel } from "./types";

export type TopicSeed = {
  key: string;
  kind: TopicKind;
  level: CefrLevel | "B2" | "C1";
  title: string;
  isCritical: boolean;
};

export const TOPIC_CATALOG: TopicSeed[] = [
  { key: "greetings", kind: "VOCABULARY", level: "A1", title: "Greetings", isCritical: false },
  { key: "introduce", kind: "VOCABULARY", level: "A1", title: "Introductions", isCritical: false },
  { key: "family", kind: "VOCABULARY", level: "A1", title: "Family", isCritical: false },
  { key: "numbers", kind: "VOCABULARY", level: "A1", title: "Numbers", isCritical: false },
  { key: "food", kind: "VOCABULARY", level: "A1", title: "Food", isCritical: false },
  { key: "places", kind: "VOCABULARY", level: "A1", title: "Places", isCritical: false },
  { key: "to-be", kind: "GRAMMAR", level: "A1", title: "To be", isCritical: true },
  { key: "pronouns", kind: "GRAMMAR", level: "A1", title: "Pronouns", isCritical: true },
  { key: "present-simple", kind: "GRAMMAR", level: "A1", title: "Present Simple", isCritical: true },
  { key: "basic-questions", kind: "GRAMMAR", level: "A1", title: "Basic questions", isCritical: true },
  { key: "articles", kind: "GRAMMAR", level: "A1", title: "Articles", isCritical: true },
  { key: "negation", kind: "GRAMMAR", level: "A1", title: "Negation", isCritical: false },
  { key: "colors", kind: "VOCABULARY", level: "A1", title: "Colors", isCritical: false },
  { key: "routine", kind: "VOCABULARY", level: "A1", title: "Daily routine", isCritical: false },
  { key: "shopping", kind: "VOCABULARY", level: "A1", title: "Shopping", isCritical: false },
  { key: "hobbies", kind: "VOCABULARY", level: "A1", title: "Hobbies", isCritical: false },
  { key: "school", kind: "VOCABULARY", level: "A1", title: "School and work", isCritical: false },
  { key: "everyday", kind: "VOCABULARY", level: "A1", title: "Everyday life", isCritical: false },
  { key: "review", kind: "VOCABULARY", level: "A1", title: "A1 review", isCritical: false },
  { key: "possessives", kind: "GRAMMAR", level: "A1", title: "Possessives", isCritical: true },
  { key: "prepositions", kind: "GRAMMAR", level: "A1", title: "Prepositions", isCritical: true },
  { key: "city", kind: "VOCABULARY", level: "A2", title: "City", isCritical: false },
  { key: "travel", kind: "VOCABULARY", level: "A2", title: "Travel", isCritical: true },
  { key: "invites", kind: "VOCABULARY", level: "A2", title: "Invitations", isCritical: false },
  { key: "past-simple", kind: "GRAMMAR", level: "A2", title: "Past Simple", isCritical: true },
  { key: "future", kind: "GRAMMAR", level: "A2", title: "Future", isCritical: true },
  { key: "comparatives", kind: "GRAMMAR", level: "A2", title: "Comparatives", isCritical: false },
  { key: "modals", kind: "GRAMMAR", level: "A2", title: "Modal verbs", isCritical: false },
  { key: "work", kind: "VOCABULARY", level: "B1", title: "Work", isCritical: false },
  { key: "health", kind: "VOCABULARY", level: "B1", title: "Health", isCritical: false },
  { key: "opinions", kind: "VOCABULARY", level: "B1", title: "Opinions", isCritical: false },
  { key: "plans", kind: "VOCABULARY", level: "B1", title: "Plans", isCritical: false },
  { key: "experiences", kind: "VOCABULARY", level: "B1", title: "Experiences", isCritical: false },
  { key: "reasons", kind: "VOCABULARY", level: "B1", title: "Reasons", isCritical: false },
  { key: "present-perfect", kind: "GRAMMAR", level: "B1", title: "Present Perfect", isCritical: true },
  { key: "conditionals", kind: "GRAMMAR", level: "B1", title: "Conditionals", isCritical: true },
  { key: "passive", kind: "GRAMMAR", level: "B1", title: "Passive Voice", isCritical: false },
  { key: "phrasal-verbs", kind: "GRAMMAR", level: "B1", title: "Phrasal verbs", isCritical: false },
  { key: "idioms", kind: "VOCABULARY", level: "B2", title: "Idioms", isCritical: true },
  { key: "academic-vocab", kind: "VOCABULARY", level: "B2", title: "Academic vocabulary", isCritical: false },
  { key: "advanced-grammar", kind: "GRAMMAR", level: "B2", title: "Advanced grammar", isCritical: true },
  { key: "advanced-vocab", kind: "VOCABULARY", level: "C1", title: "Advanced vocabulary", isCritical: true },
  { key: "nuanced-grammar", kind: "GRAMMAR", level: "C1", title: "Nuanced grammar", isCritical: true },
];

export const UNIT_TOPICS: Record<UnitKey, string[]> = {
  greetings: ["greetings", "to-be", "pronouns", "basic-questions"],
  introduce: ["introduce", "to-be", "pronouns", "basic-questions"],
  family: ["family", "possessives", "present-simple", "negation"],
  numbers: ["numbers", "basic-questions"],
  food: ["food", "articles", "present-simple", "negation"],
  places: ["places", "prepositions", "basic-questions", "colors"],
  routine: ["routine", "present-simple", "negation"],
  shopping: ["shopping", "articles", "basic-questions"],
  hobbies: ["hobbies", "modals", "present-simple"],
  school: ["school", "present-simple", "articles"],
  everyday: ["everyday", "to-be", "colors"],
  review: ["review", "to-be", "present-simple", "basic-questions"],
  city: ["city", "prepositions"],
  travel: ["travel"],
  past: ["past-simple"],
  future: ["future", "modals"],
  compare: ["comparatives"],
  invites: ["invites", "future"],
  work: ["work", "passive"],
  health: ["health"],
  opinions: ["opinions"],
  plans: ["plans", "conditionals"],
  experiences: ["experiences", "present-perfect"],
  reasons: ["reasons", "conditionals"],
};

export function grammarTopicFor(unitKey: UnitKey): string {
  return UNIT_TOPICS[unitKey].find((key) => TOPIC_CATALOG.some((topic) => topic.key === key && topic.kind === "GRAMMAR"))
    ?? UNIT_TOPICS[unitKey][0]
    ?? unitKey;
}

export function vocabTopicFor(unitKey: UnitKey): string {
  return UNIT_TOPICS[unitKey].find((key) => TOPIC_CATALOG.some((topic) => topic.key === key && topic.kind === "VOCABULARY"))
    ?? UNIT_TOPICS[unitKey][0]
    ?? unitKey;
}
