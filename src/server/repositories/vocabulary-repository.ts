import type { KnowledgeState } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export const vocabularyRepository = {
  listByCourse(userId: string, courseId: string) {
    return prisma.userVocabulary.findMany({
      where: { userId, vocabularyWord: { courseId } },
      include: { vocabularyWord: true },
      orderBy: { lastReviewedAt: "desc" },
    });
  },

  listByWordIds(userId: string, vocabularyWordIds: string[]) {
    if (vocabularyWordIds.length === 0) {
      return Promise.resolve([]);
    }
    return prisma.userVocabulary.findMany({
      where: { userId, vocabularyWordId: { in: vocabularyWordIds } },
    });
  },

  upsertReview(input: {
    userId: string;
    vocabularyWordId: string;
    isCorrect: boolean;
    mastery: number;
    knowledgeState?: KnowledgeState;
    intervalDays?: number;
    repetitions?: number;
    nextReviewAt?: Date;
  }) {
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
        nextReviewAt: input.nextReviewAt ?? new Date(Date.now() + 86_400_000),
        knowledgeState: input.knowledgeState ?? "LEARNING",
        intervalDays: input.intervalDays ?? 1,
        repetitions: input.repetitions ?? 1,
      },
      update: {
        mastery: input.mastery,
        correctAnswers: { increment: input.isCorrect ? 1 : 0 },
        incorrectAnswers: { increment: input.isCorrect ? 0 : 1 },
        lastReviewedAt: new Date(),
        nextReviewAt: input.nextReviewAt ?? new Date(Date.now() + 86_400_000),
        knowledgeState: input.knowledgeState,
        intervalDays: input.intervalDays,
        repetitions: input.repetitions,
      },
    });
  },

  countLearned(userId: string, courseId: string) {
    return prisma.userVocabulary.count({
      where: { userId, vocabularyWord: { courseId } },
    });
  },
};
