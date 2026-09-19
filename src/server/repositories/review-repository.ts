import type { KnowledgeState } from "@prisma/client";
import type { DbClient } from "@/lib/db/client";
import { prisma } from "@/lib/db/prisma";

export const reviewRepository = {
  listDue(userId: string, courseId: string, take = 20, now = new Date()) {
    return prisma.reviewItem.findMany({
      where: { userId, courseId, nextReviewAt: { lte: now }, questionId: { not: null } },
      include: { question: { include: { options: true, topic: true, lesson: { include: { unit: true } } } } },
      orderBy: { nextReviewAt: "asc" },
      take,
    });
  },

  findByQuestion(userId: string, courseId: string, questionId: string, db: DbClient = prisma) {
    return db.reviewItem.findUnique({
      where: { userId_courseId_questionId: { userId, courseId, questionId } },
    });
  },

  upsert(
    input: {
      userId: string;
      courseId: string;
      questionId: string;
      topicId?: string | null;
      knowledgeState: KnowledgeState;
      intervalIndex: number;
      nextReviewAt: Date;
      lastCorrect: boolean;
    },
    db: DbClient = prisma,
  ) {
    return db.reviewItem.upsert({
      where: {
        userId_courseId_questionId: {
          userId: input.userId,
          courseId: input.courseId,
          questionId: input.questionId,
        },
      },
      create: {
        ...input,
        lastReviewedAt: new Date(),
      },
      update: {
        topicId: input.topicId,
        knowledgeState: input.knowledgeState,
        intervalIndex: input.intervalIndex,
        nextReviewAt: input.nextReviewAt,
        lastCorrect: input.lastCorrect,
        lastReviewedAt: new Date(),
      },
    });
  },
};
