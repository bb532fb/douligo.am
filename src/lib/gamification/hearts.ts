import { HEARTS_MAX } from "@/lib/constants/app";
import { isSameUtcDay } from "@/lib/utils/date";

export function loseHeart(current: number): number {
  return Math.max(0, current - 1);
}

export function refillHeartsIfNeeded(
  hearts: number,
  refilledAt: Date,
  now: Date,
): { hearts: number; refilled: boolean } {
  if (hearts >= HEARTS_MAX || isSameUtcDay(refilledAt, now)) {
    return { hearts, refilled: false };
  }

  return { hearts: HEARTS_MAX, refilled: true };
}

export function canStartLesson(hearts: number): boolean {
  return hearts > 0;
}
