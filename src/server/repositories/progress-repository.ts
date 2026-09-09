import { prisma } from "@/lib/db/prisma";

export const progressRepository = {
  listCompletedLessonIds(userId: string, courseId: string) {
    return prisma.lessonProgress.findMany({
      where: {
        userId,
        completed: true,
        lesson: { unit: { courseId } },
      },
      select: { lessonId: true },
    });
  },

  getLessonProgress(userId: string, lessonId: string) {
    return prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });
  },

  upsertLessonCompletion(input: {
    userId: string;
    lessonId: string;
    score: number;
  }) {
    return prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: input.userId, lessonId: input.lessonId } },
      create: {
        userId: input.userId,
        lessonId: input.lessonId,
        completed: true,
        score: input.score,
        attempts: 1,
        completedAt: new Date(),
      },
      update: {
        completed: true,
        score: input.score,
        attempts: { increment: 1 },
        completedAt: new Date(),
      },
    });
  },

  getCourseProgress(userId: string, courseId: string) {
    return prisma.userProgress.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  },

  setStartLevel(userId: string, courseId: string, startLevel: string) {
    return prisma.userProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, startLevel },
      update: { startLevel },
    });
  },

  updateCourseProgress(input: {
    userId: string;
    courseId: string;
    currentUnitId: string;
    currentLessonId: string;
    totalLessonsCompleted: number;
    totalWordsLearned: number;
  }) {
    return prisma.userProgress.upsert({
      where: { userId_courseId: { userId: input.userId, courseId: input.courseId } },
      create: input,
      update: {
        currentUnitId: input.currentUnitId,
        currentLessonId: input.currentLessonId,
        totalLessonsCompleted: input.totalLessonsCompleted,
        totalWordsLearned: input.totalWordsLearned,
      },
    });
  },
};
