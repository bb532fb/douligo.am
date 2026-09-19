import { REVIEW_INTERVALS_MS } from "@/lib/learning/mastery-config";

export function calculateNextReviewDate(
  intervalIndex: number,
  isCorrect: boolean,
  now = Date.now(),
): { intervalIndex: number; nextReviewAt: Date } {
  const nextIndex = isCorrect
    ? Math.min(REVIEW_INTERVALS_MS.length - 1, intervalIndex + 1)
    : Math.max(0, intervalIndex - 2);
  const offset = REVIEW_INTERVALS_MS[nextIndex] ?? REVIEW_INTERVALS_MS[0];
  return {
    intervalIndex: nextIndex,
    nextReviewAt: new Date(now + offset),
  };
}

export function firstReviewAfterMistake(now = Date.now()): { intervalIndex: number; nextReviewAt: Date } {
  return {
    intervalIndex: 0,
    nextReviewAt: new Date(now + REVIEW_INTERVALS_MS[0]),
  };
}

export function firstReviewAfterSuccess(now = Date.now()): { intervalIndex: number; nextReviewAt: Date } {
  return {
    intervalIndex: 1,
    nextReviewAt: new Date(now + REVIEW_INTERVALS_MS[1]),
  };
}
