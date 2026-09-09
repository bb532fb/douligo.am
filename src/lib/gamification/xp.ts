import {
  XP_CORRECT_ANSWER,
  XP_DAILY_GOAL,
  XP_LESSON_COMPLETE,
  XP_PER_LEVEL,
} from "@/lib/constants/app";

export function calculateLessonXp(correctCount: number, alreadyCompleted: boolean): number {
  const answerXp = correctCount * XP_CORRECT_ANSWER;
  const completionXp = alreadyCompleted ? 0 : XP_LESSON_COMPLETE;
  return answerXp + completionXp;
}

export function shouldAwardDailyGoal(currentXp: number, targetXp: number, alreadyAwarded: boolean): boolean {
  return !alreadyAwarded && currentXp >= targetXp;
}

export function dailyGoalBonus(): number {
  return XP_DAILY_GOAL;
}

export function levelFromTotalXp(totalXp: number): number {
  return Math.floor(Math.max(totalXp, 0) / XP_PER_LEVEL) + 1;
}
