import { HEARTS_MAX } from "@/lib/constants/app";
import { APP_ERRORS } from "@/lib/constants/copy";
import { loseHeart, refillHeartsIfNeeded } from "@/lib/gamification/hearts";
import { nextStreak } from "@/lib/gamification/streak";
import { dailyGoalBonus, levelFromTotalXp, shouldAwardDailyGoal } from "@/lib/gamification/xp";
import { AppError } from "@/lib/errors/app-error";
import { gamificationRepository } from "@/server/repositories/gamification-repository";
import type { XpSource } from "@prisma/client";

export const gamificationService = {
  async syncHearts(userId: string) {
    const profile = await gamificationRepository.getProfile(userId);
    const refill = refillHeartsIfNeeded(profile.hearts, profile.heartsRefilledAt, new Date());
    if (refill.refilled) {
      await gamificationRepository.updateHearts(userId, refill.hearts, new Date());
    }
    return refill.hearts;
  },

  async requireHearts(userId: string) {
    const hearts = await this.syncHearts(userId);
    if (hearts <= 0) {
      throw new AppError("NO_HEARTS", APP_ERRORS.noHearts, 403);
    }
    return hearts;
  },

  async applyWrongAnswer(userId: string) {
    const hearts = await this.syncHearts(userId);
    const next = loseHeart(hearts);
    await gamificationRepository.updateHearts(userId, next);
    return next;
  },

  async awardXp(input: { userId: string; amount: number; source: XpSource; sourceId: string }) {
    const existing = await gamificationRepository.hasXpEvent(input.userId, input.source, input.sourceId);
    if (existing) {
      return { awarded: 0, duplicate: true };
    }

    await gamificationRepository.createXp(input);
    const total = await this.totalXp(input.userId);
    await gamificationRepository.updateLevel(input.userId, levelFromTotalXp(total));
    return { awarded: input.amount, duplicate: false };
  },

  async totalXp(userId: string) {
    const result = await gamificationRepository.sumXp(userId);
    return result._sum.amount ?? 0;
  },

  async applyStreak(userId: string) {
    const streak = await gamificationRepository.getStreak(userId);
    const update = nextStreak(streak, new Date());
    if (update.changed && update.lastActivityDate) {
      await gamificationRepository.updateStreak(userId, {
        currentStreak: update.currentStreak,
        longestStreak: update.longestStreak,
        lastActivityDate: update.lastActivityDate,
      });
    }
    return update;
  },

  async applyDailyGoal(userId: string, gainedXp: number) {
    const profile = await gamificationRepository.getProfile(userId);
    const goal = await gamificationRepository.upsertDailyGoal(userId, profile.dailyGoalXp, gainedXp);
    const already = await gamificationRepository.hasXpEvent(userId, "DAILY_GOAL", goal.id);
    if (shouldAwardDailyGoal(goal.currentXP, goal.targetXP, Boolean(already))) {
      await this.awardXp({
        userId,
        amount: dailyGoalBonus(),
        source: "DAILY_GOAL",
        sourceId: goal.id,
      });
      return { ...goal, bonusAwarded: true };
    }
    return { ...goal, bonusAwarded: false };
  },
};

export { HEARTS_MAX };
