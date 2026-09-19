import { HEARTS_MAX } from "@/lib/constants/app";
import { isSameUtcDay } from "@/lib/utils/date";

export function loseHeart(current: number): number {
  return Math.max(0, current - 1);
}

export function refillHeartsIfNeeded(
  hearts: number,
  refilledAt: Date,
  now: Date,
  max = HEARTS_MAX,
): { hearts: number; refilled: boolean } {
  if (hearts >= max || isSameUtcDay(refilledAt, now)) {
    return { hearts, refilled: false };
  }

  return { hearts: max, refilled: true };
}

export function canStartLesson(hearts: number): boolean {
  return hearts > 0;
}

export function clampHearts(value: number, max = HEARTS_MAX): number {
  return Math.min(max, Math.max(0, Math.round(value)));
}

export function addHearts(current: number, delta: number, max = HEARTS_MAX): number {
  return clampHearts(current + delta, max);
}
