import { APP_ERRORS } from "@/lib/constants/copy";
import { AppError } from "@/lib/errors/app-error";
import { ADMIN_USER_PAGE_SIZE, type AdminUserQuery } from "@/lib/validations/admin";
import { adminRepository } from "@/server/repositories/admin-repository";
import { gamificationService } from "@/server/services/gamification-service";
import { settingsService } from "@/server/services/settings-service";
import type { AdminActivityItem, AdminOverviewStats, AdminUserDetail, AdminUserList } from "@/types/admin";
import type { UserStatus } from "@prisma/client";

function toXpMap(rows: Array<{ userId: string; _sum: { amount: number | null } }>) {
  return new Map(rows.map((row) => [row.userId, row._sum.amount ?? 0]));
}

function toCountMap(rows: Array<{ userId: string; _count: { _all: number } }>) {
  return new Map(rows.map((row) => [row.userId, row._count._all]));
}

export const adminService = {
  async getOverview(): Promise<AdminOverviewStats> {
    const today = adminRepository.today();
    const [totalUsers, activeToday, newThisWeek, suspended, lessonsToday] = await Promise.all([
      adminRepository.countUsers(),
      adminRepository.countActiveSince(today),
      adminRepository.countNewUsers(adminRepository.weekStart()),
      adminRepository.countSuspended(),
      adminRepository.countCompletedLessons(today),
    ]);
    return { totalUsers, activeToday, newThisWeek, suspended, lessonsToday };
  },

  async listUsers(query: AdminUserQuery): Promise<AdminUserList> {
    const skip = (query.page - 1) * ADMIN_USER_PAGE_SIZE;
    const [total, rows] = await Promise.all([
      adminRepository.countUsersMatching(query),
      adminRepository.listUsers(query, skip, ADMIN_USER_PAGE_SIZE),
    ]);
    const ids = rows.map((row) => row.id);
    const [xpRows, lessonRows] = await Promise.all([
      adminRepository.sumXpByUser(ids),
      adminRepository.countCompletedLessonsByUser(ids),
    ]);
    const xpByUser = toXpMap(xpRows);
    const lessonsByUser = toCountMap(lessonRows);
    return {
      total,
      page: query.page,
      pageSize: ADMIN_USER_PAGE_SIZE,
      items: rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        status: row.status,
        createdAt: row.createdAt,
        hearts: row.profile?.hearts ?? 0,
        level: row.profile?.level ?? 1,
        currentStreak: row.streak?.currentStreak ?? 0,
        lastActivityDate: row.streak?.lastActivityDate ?? null,
        totalXp: xpByUser.get(row.id) ?? 0,
        lessonsCompleted: lessonsByUser.get(row.id) ?? 0,
      })),
    };
  },

  async getUser(userId: string): Promise<AdminUserDetail> {
    const user = await adminRepository.findUser(userId);
    if (!user) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }
    const [totalXp, lessonRows, answers, correct, words, recentLessons, recentAnswers] = await Promise.all([
      gamificationService.totalXp(userId),
      adminRepository.countCompletedLessonsByUser([userId]),
      adminRepository.countAnswers(userId),
      adminRepository.countCorrectAnswers(userId),
      adminRepository.countWords(userId),
      adminRepository.recentCompletedLessons(userId, 8),
      adminRepository.recentAnswers(userId, 8),
    ]);
    const totalAnswers = answers._count._all;
    return {
      id: user.id,
      name: user.profile?.displayName ?? user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      hearts: user.profile?.hearts ?? 0,
      level: user.profile?.level ?? 1,
      dailyGoalXp: user.profile?.dailyGoalXp ?? 50,
      currentStreak: user.streak?.currentStreak ?? 0,
      longestStreak: user.streak?.longestStreak ?? 0,
      lastActivityDate: user.streak?.lastActivityDate ?? null,
      totalXp,
      lessonsCompleted: lessonRows[0]?._count._all ?? 0,
      wordsLearned: words,
      accuracy: totalAnswers === 0 ? 0 : Math.round((correct / totalAnswers) * 100),
      courses: user.enrollments.map((item) => ({
        id: item.course.id,
        title: item.course.title,
        isActive: item.isActive,
      })),
      recentLessons: recentLessons.flatMap((item) =>
        item.completedAt
          ? [{ id: item.id, title: item.lesson.title, score: item.score, completedAt: item.completedAt }]
          : [],
      ),
      recentAnswers: recentAnswers.map((item) => ({
        id: item.id,
        prompt: item.question.prompt,
        isCorrect: item.isCorrect,
        createdAt: item.createdAt,
      })),
    };
  },

  async listActivity(limit = 24): Promise<AdminActivityItem[]> {
    const [signups, lessons] = await Promise.all([
      adminRepository.recentSignups(limit),
      adminRepository.recentLessonCompletions(limit),
    ]);
    const signupItems: AdminActivityItem[] = signups.map((user) => ({
      id: `signup-${user.id}`,
      kind: "signup",
      at: user.createdAt,
      userId: user.id,
      userName: user.name,
      title: user.name,
    }));
    const lessonItems: AdminActivityItem[] = lessons.flatMap((row) =>
      row.completedAt
        ? [
            {
              id: `lesson-${row.id}`,
              kind: "lesson" as const,
              at: row.completedAt,
              userId: row.user.id,
              userName: row.user.name,
              title: row.lesson.title,
            },
          ]
        : [],
    );
    return [...signupItems, ...lessonItems]
      .sort((left, right) => right.at.getTime() - left.at.getTime())
      .slice(0, limit);
  },

  async changeStatus(actorId: string, userId: string, status: UserStatus) {
    if (actorId === userId) {
      throw new AppError("FORBIDDEN", APP_ERRORS.forbidden, 403);
    }
    const user = await adminRepository.findUser(userId);
    if (!user) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }
    return adminRepository.updateStatus(userId, status);
  },

  async changeHearts(userId: string, intent: "add" | "remove" | "refill") {
    const user = await adminRepository.findUser(userId);
    if (!user) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }
    if (intent === "refill") {
      const max = await settingsService.getHeartsMax();
      return gamificationService.setHearts(userId, max);
    }
    return gamificationService.adjustHearts(userId, intent === "add" ? 1 : -1);
  },

  getHeartsMax() {
    return settingsService.getHeartsMax();
  },

  setHeartsMax(heartsMax: number) {
    return settingsService.setHeartsMax(heartsMax);
  },
};
