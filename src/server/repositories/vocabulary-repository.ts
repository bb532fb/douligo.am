import { prisma } from "@/lib/db/prisma";

export const vocabularyRepository = {
  listByCourse(userId: string, courseId: string) {
    return prisma.userVocabulary.findMany({
      where: { userId, vocabularyWord: { courseId } },
      include: { vocabularyWord: true },
      orderBy: { lastReviewedAt: "desc" },
    });
  },

  upsertReview(input: { userId: string; vocabularyWordId: string; isCorrect: boolean; mastery: number }) {
    return prisma.userVocabulary.upsert({
      where: {
        userId_vocabularyWordId: {
          userId: input.userId,
          vocabularyWordId: input.vocabularyWordId,
        },
      },
      create: {
        userId: input.userId,
        vocabularyWordId: input.vocabularyWordId,
        mastery: input.mastery,
        correctAnswers: input.isCorrect ? 1 : 0,
        incorrectAnswers: input.isCorrect ? 0 : 1,
        lastReviewedAt: new Date(),
        nextReviewAt: new Date(Date.now() + 86_400_000),
      },
      update: {
        mastery: input.mastery,
        correctAnswers: { increment: input.isCorrect ? 1 : 0 },
        incorrectAnswers: { increment: input.isCorrect ? 0 : 1 },
        lastReviewedAt: new Date(),
        nextReviewAt: new Date(Date.now() + 86_400_000),
      },
    });
  },

  countLearned(userId: string, courseId: string) {
    return prisma.userVocabulary.count({
      where: { userId, vocabularyWord: { courseId } },
    });
  },
};
