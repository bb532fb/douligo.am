import { prisma } from "@/lib/db/prisma";

export const attemptRepository = {
  create(input: { userId: string; lessonId: string; questionIds: string[] }) {
    return prisma.lessonAttempt.create({ data: input });
  },

  findById(id: string) {
    return prisma.lessonAttempt.findUnique({
      where: { id },
      include: { answers: true, lesson: { include: { unit: true } } },
    });
  },

  findAnswer(attemptId: string, questionId: string) {
    return prisma.userAnswer.findUnique({
      where: { attemptId_questionId: { attemptId, questionId } },
    });
  },

  createAnswer(input: {
    attemptId: string;
    userId: string;
    questionId: string;
    answer: string;
    isCorrect: boolean;
  }) {
    return prisma.userAnswer.create({ data: input });
  },

  complete(id: string, score: number, xpAwarded: number) {
    return prisma.lessonAttempt.update({
      where: { id },
      data: { completedAt: new Date(), score, xpAwarded },
    });
  },
};
