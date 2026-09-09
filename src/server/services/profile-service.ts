import { prisma } from "@/lib/db/prisma";
import { gamificationService } from "@/server/services/gamification-service";

export const profileService = {
  async getOverview(userId: string, courseId: string | null) {
    const [user, totalXp, hearts] = await Promise.all([
      prisma.user.findUniqueOrThrow({
        where: { id: userId },
        include: {
          profile: true,
          streak: true,
          achievements: { include: { achievement: true } },
        },
      }),
      gamificationService.totalXp(userId),
      gamificationService.syncHearts(userId),
    ]);

    const answers = await prisma.userAnswer.aggregate({
      where: { userId },
      _count: { _all: true },
    });
    const correct = await prisma.userAnswer.count({
      where: { userId, isCorrect: true },
    });
    const lessonsCompleted = await prisma.lessonProgress.count({
      where: { userId, completed: true },
    });
    const wordsLearned = courseId
      ? await prisma.userVocabulary.count({
          where: { userId, vocabularyWord: { courseId } },
        })
      : 0;

    return {
      name: user.profile?.displayName ?? user.name,
      email: user.email,
      avatar: user.avatar,
      level: user.profile?.level ?? 1,
      hearts,
      dailyGoalXp: user.profile?.dailyGoalXp ?? 50,
      totalXp,
      currentStreak: user.streak?.currentStreak ?? 0,
      longestStreak: user.streak?.longestStreak ?? 0,
      lessonsCompleted,
      wordsLearned,
      accuracy: answers._count._all === 0 ? 0 : Math.round((correct / answers._count._all) * 100),
      achievements: user.achievements.map((item) => item.achievement),
    };
  },

  async updateSettings(userId: string, input: { displayName?: string; dailyGoalXp: number }) {
    await prisma.profile.update({
      where: { userId },
      data: {
        dailyGoalXp: input.dailyGoalXp,
        ...(input.displayName ? { displayName: input.displayName } : {}),
      },
    });
  },
};
