import {
  MASTERY_CORRECT_STEP,
  MASTERY_INCORRECT_STEP,
  MASTERY_LEARNING_MAX,
  MASTERY_MAX,
} from "@/lib/constants/app";

export type MasteryFilter = "all" | "learning" | "mastered";

export function nextMastery(current: number, isCorrect: boolean): number {
  if (isCorrect) {
    return Math.min(MASTERY_MAX, current + MASTERY_CORRECT_STEP);
  }

  return Math.max(0, current - MASTERY_INCORRECT_STEP);
}

export function matchesMasteryFilter(mastery: number, filter: MasteryFilter): boolean {
  if (filter === "learning") {
    return mastery <= MASTERY_LEARNING_MAX;
  }

  if (filter === "mastered") {
    return mastery > MASTERY_LEARNING_MAX;
  }

  return true;
}
