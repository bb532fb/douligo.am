import { daysBetweenUtc } from "@/lib/utils/date";

export type StreakState = {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
};

export type StreakUpdate = StreakState & {
  changed: boolean;
};

export function nextStreak(state: StreakState, activityDate: Date): StreakUpdate {
  if (!state.lastActivityDate) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, state.longestStreak),
      lastActivityDate: activityDate,
      changed: true,
    };
  }

  const gap = daysBetweenUtc(state.lastActivityDate, activityDate);

  if (gap === 0) {
    return { ...state, changed: false };
  }

  const currentStreak = gap === 1 ? state.currentStreak + 1 : 1;

  return {
    currentStreak,
    longestStreak: Math.max(state.longestStreak, currentStreak),
    lastActivityDate: activityDate,
    changed: true,
  };
}
