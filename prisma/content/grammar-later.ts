import type { GrammarDrill } from "./grammar-a1";
import { GRAMMAR_DRILLS_A2 } from "./grammar-a2";
import { hyDrillsA2 } from "./grammar-a2-hy";
import { GRAMMAR_DRILLS_A2_RU } from "./grammar-a2-ru";
import { GRAMMAR_DRILLS_B1 } from "./grammar-b1";
import { hyDrillsB1 } from "./grammar-b1-hy";
import { GRAMMAR_DRILLS_B1_RU } from "./grammar-b1-ru";
import type { CefrLevel } from "./types";

type HyTrack = "en-hy" | "ru-hy";

export function laterDrillsFor(unit: string, slug: string, level: CefrLevel): GrammarDrill[] {
  if (level === "A2") {
    return pick(GRAMMAR_DRILLS_A2, GRAMMAR_DRILLS_A2_RU, hyDrillsA2, unit, slug);
  }
  if (level === "B1") {
    return pick(GRAMMAR_DRILLS_B1, GRAMMAR_DRILLS_B1_RU, hyDrillsB1, unit, slug);
  }
  return [];
}

function pick(
  english: GrammarDrill[],
  russian: GrammarDrill[],
  hy: (unit: string, slug: HyTrack) => GrammarDrill[],
  unit: string,
  slug: string,
): GrammarDrill[] {
  if (slug === "hy-ru") {
    return russian.filter((item) => item.unit === unit);
  }
  if (slug === "en-hy" || slug === "ru-hy") {
    return hy(unit, slug);
  }
  return english.filter((item) => item.unit === unit);
}
