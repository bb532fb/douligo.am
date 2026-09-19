import type { KnowledgeState } from "@prisma/client";
import {
  calculateNextReviewDate,
  firstReviewAfterMistake,
  firstReviewAfterSuccess,
} from "@/lib/learning/review-schedule";
import type { DbClient } from "@/lib/db/client";
import { reviewRepository } from "@/server/repositories/review-repository";

export const reviewService = {
  getReviewQueue(userId: string, courseId: string, take = 20) {
    return reviewRepository.listDue(userId, courseId, take);
  },

  async applyReview(
    input: {
      userId: string;
      courseId: string;
      questionId: string;
      topicId?: string | null;
      isCorrect: boolean;
      knowledgeState: KnowledgeState;
    },
    db: DbClient,
  ) {
    const existing = await reviewRepository.findByQuestion(input.userId, input.courseId, input.questionId, db);
    const schedule = nextSchedule(existing?.intervalIndex ?? 0, existing == null, input.isCorrect);
    await reviewRepository.upsert(
      {
        userId: input.userId,
        courseId: input.courseId,
        questionId: input.questionId,
        topicId: input.topicId,
        knowledgeState: input.knowledgeState,
        intervalIndex: schedule.intervalIndex,
        nextReviewAt: schedule.nextReviewAt,
        lastCorrect: input.isCorrect,
      },
      db,
    );
    return schedule;
  },
};

function nextSchedule(intervalIndex: number, isFirst: boolean, isCorrect: boolean) {
  if (isFirst) {
    return isCorrect ? firstReviewAfterSuccess() : firstReviewAfterMistake();
  }
  return calculateNextReviewDate(intervalIndex, isCorrect);
}
