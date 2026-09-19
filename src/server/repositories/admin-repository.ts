import type { UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { startOfUtcDay, startOfUtcWeek } from "@/lib/utils/date";
import type { AdminUserQuery } from "@/lib/validations/admin";

function userSearchWhere(query: AdminUserQuery) {
  return {
    ...(query.status === "ALL" ? {} : { status: query.status }),
    ...(query.q
      ? {
          OR: [
            { name: { contains: query.q, mode: "insensitive" as const } },
            { email: { contains: query.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

export const adminRepository = {
  countUsers() {
    return prisma.user.count();
  },

  countSuspended() {
    return prisma.user.count({ where: { status: "SUSPENDED" } });
  },

  countNewUsers(since: Date) {
    return prisma.user.count({ where: { createdAt: { gte: since } } });
  },

  countActiveSince(since: Date) {
    return prisma.user.count({
      where: {
        OR: [
          { streak: { lastActivityDate: { gte: since } } },
          { answers: { some: { createdAt: { gte: since } } } },
        ],
      },
    });
  },

  countCompletedLessons(since: Date) {
    return prisma.lessonProgress.count({
      where: { completed: true, completedAt: { gte: since } },
    });
  },

  countUsersMatching(query: AdminUserQuery) {
    return prisma.user.count({ where: userSearchWhere(query) });
  },

  listUsers(query: AdminUserQuery, skip: number, take: number) {
    return prisma.user.findMany({
      where: userSearchWhere(query),
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        profile: { select: { hearts: true, level: true } },
        streak: { select: { currentStreak: true, lastActivityDate: true } },
      },
    });
  },

  sumXpByUser(userIds: string[]) {
    if (userIds.length === 0) {
      return Promise.resolve([]);
    }
    return prisma.userXP.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds } },
      _sum: { amount: true },
    });
  },

  countCompletedLessonsByUser(userIds: string[]) {
    if (userIds.length === 0) {
      return Promise.resolve([]);
    }
    return prisma.lessonProgress.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds }, completed: true },
      _count: { _all: true },
    });
  },

  findUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        streak: true,
        enrollments: {
          include: { course: { select: { id: true, title: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  recentCompletedLessons(userId: string, take: number) {
    return prisma.lessonProgress.findMany({
      where: { userId, completed: true, completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
      take,
      select: {
        id: true,
        score: true,
        completedAt: true,
        lesson: { select: { title: true } },
      },
    });
  },

  recentAnswers(userId: string, take: number) {
    return prisma.userAnswer.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true,
        isCorrect: true,
        createdAt: true,
        question: { select: { prompt: true } },
      },
    });
  },

  countAnswers(userId: string) {
    return prisma.userAnswer.aggregate({
      where: { userId },
      _count: { _all: true },
    });
  },

  countCorrectAnswers(userId: string) {
    return prisma.userAnswer.count({ where: { userId, isCorrect: true } });
  },

  countWords(userId: string) {
    return prisma.userVocabulary.count({ where: { userId } });
  },

  recentSignups(take: number) {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take,
      select: { id: true, name: true, createdAt: true },
    });
  },

  recentLessonCompletions(take: number) {
    return prisma.lessonProgress.findMany({
      where: { completed: true, completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
      take,
      select: {
        id: true,
        completedAt: true,
        user: { select: { id: true, name: true } },
        lesson: { select: { title: true } },
      },
    });
  },

  updateStatus(userId: string, status: UserStatus) {
    return prisma.user.update({
      where: { id: userId },
      data: { status },
      select: { id: true, status: true },
    });
  },

  today() {
    return startOfUtcDay();
  },

  weekStart() {
    return startOfUtcWeek();
  },
};
