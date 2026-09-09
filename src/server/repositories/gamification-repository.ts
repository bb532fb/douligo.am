import type { XpSource } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { startOfUtcDay } from "@/lib/utils/date";

export const gamificationRepository = {
  getProfile(userId: string) {
    return prisma.profile.findUniqueOrThrow({ where: { userId } });
  },

  updateHearts(userId: string, hearts: number, refilledAt?: Date) {
    return prisma.profile.update({
      where: { userId },
      data: {
        hearts,
        ...(refilledAt ? { heartsRefilledAt: refilledAt } : {}),
      },
    });
  },

  updateLevel(userId: string, level: number) {
    return prisma.profile.update({
      where: { userId },
      data: { level },
    });
  },

  getStreak(userId: string) {
    return prisma.userStreak.findUniqueOrThrow({ where: { userId } });
  },

  updateStreak(userId: string, data: { currentStreak: number; longestStreak: number; lastActivityDate: Date }) {
    return prisma.userStreak.update({ where: { userId }, data });
  },

  sumXp(userId: string) {
    return prisma.userXP.aggregate({
      where: { userId },
      _sum: { amount: true },
    });
  },

  hasXpEvent(userId: string, source: XpSource, sourceId: string) {
    return prisma.userXP.findUnique({
      where: { userId_source_sourceId: { userId, source, sourceId } },
    });
  },

  createXp(input: { userId: string; amount: number; source: XpSource; sourceId: string }) {
    return prisma.userXP.create({ data: input });
  },

  getDailyGoal(userId: string, date = startOfUtcDay()) {
    return prisma.dailyGoal.findUnique({
      where: { userId_date: { userId, date } },
    });
  },

  upsertDailyGoal(userId: string, targetXP: number, addXp: number, date = startOfUtcDay()) {
    return prisma.dailyGoal.upsert({
      where: { userId_date: { userId, date } },
      create: { userId, date, targetXP, currentXP: addXp },
      update: { currentXP: { increment: addXp } },
    });
  },
};
