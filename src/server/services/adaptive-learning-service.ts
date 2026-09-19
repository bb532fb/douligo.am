import type { ExerciseDifficulty, SkillType } from "@prisma/client";
import { getAdaptiveDifficulty, orderByAdaptive, rankExercises } from "@/lib/learning/adaptive";
import { WEAK_TOPIC_SCORE } from "@/lib/learning/mastery-config";
import { prisma } from "@/lib/db/prisma";
import { masteryRepository } from "@/server/repositories/mastery-repository";
import { reviewRepository } from "@/server/repositories/review-repository";

export type AdaptiveQuestion = {
  id: string;
  difficulty: ExerciseDifficulty;
  skillType: SkillType;
  topic: { key: string } | null;
};

export const adaptiveLearningService = {
  async orderLessonQuestions<T extends AdaptiveQuestion>(
    userId: string,
    courseId: string,
    questions: T[],
    levelKey: string,
  ) {
    const context = await buildContext(userId, courseId, questions, levelKey);
    return orderByAdaptive(toCandidates(questions), context).map((item) => {
      const found = questions.find((question) => question.id === item.id);
      return found ?? questions[0]!;
    });
  },

  async pickPracticeQuestions(userId: string, courseId: string, levelKey: string, take = 12) {
    const [pool, due] = await Promise.all([
      masteryRepository.listLevelQuestions(courseId, levelKey),
      reviewRepository.listDue(userId, courseId, take),
    ]);
    const dueQuestions = due.flatMap((item) => (item.question ? [item.question] : []));
    const merged = uniqueQuestions([...dueQuestions, ...pool]);
    const context = await buildContext(userId, courseId, merged, levelKey);
    const ranked = rankExercises(toCandidates(merged), context);
    return ranked
      .slice(0, take)
      .map((item) => merged.find((question) => question.id === item.id))
      .filter((question): question is (typeof merged)[number] => Boolean(question));
  },

  async targetDifficulty(userId: string, levelKey: string): Promise<ExerciseDifficulty> {
    const recent = await prisma.userAnswer.findMany({
      where: { userId, levelKey },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { isCorrect: true, question: { select: { difficulty: true } } },
    });
    return getAdaptiveDifficulty(
      recent
        .reverse()
        .map((row) => ({ difficulty: row.question.difficulty, isCorrect: row.isCorrect })),
    );
  },
};

async function buildContext(userId: string, courseId: string, questions: AdaptiveQuestion[], levelKey: string) {
  const [topics, due] = await Promise.all([
    masteryRepository.listTopicMasteries(userId, courseId),
    reviewRepository.listDue(userId, courseId, 50),
  ]);
  const dueIds = new Set(due.map((item) => item.questionId));
  const recentWrong = await prisma.userAnswer.findMany({
    where: { userId, isCorrect: false },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { questionId: true, topicId: true },
  });
  const recentIds = recentWrong.map((item) => item.questionId);
  const targetDifficulty = await adaptiveLearningService.targetDifficulty(userId, levelKey);
  const topicStats = Object.fromEntries(
    topics.map((row) => [
      row.topic.key,
      {
        key: row.topic.key,
        score: row.score,
        recentWrong: recentWrong.some((item) => item.topicId === row.topicId),
        retentionLow: Boolean(row.nextReviewAt && row.nextReviewAt <= new Date() && row.score < 80),
        reviewDue: Boolean(row.nextReviewAt && row.nextReviewAt <= new Date()),
        isNew: row.correctCount + row.incorrectCount === 0,
        recentIds,
      },
    ]),
  );
  for (const question of questions) {
    const key = question.topic?.key;
    if (key && !topicStats[key]) {
      topicStats[key] = {
        key,
        score: 0,
        recentWrong: false,
        retentionLow: false,
        reviewDue: dueIds.has(question.id),
        isNew: true,
        recentIds,
      };
    }
  }
  return { topics: topicStats, targetDifficulty };
}

function toCandidates(questions: AdaptiveQuestion[]) {
  return questions.map((question) => ({
    id: question.id,
    topicKey: question.topic?.key ?? "unknown",
    difficulty: question.difficulty,
    skillType: question.skillType,
    scoreHint: question.topic ? 0 : WEAK_TOPIC_SCORE,
  }));
}

function uniqueQuestions<T extends AdaptiveQuestion>(questions: T[]) {
  const seen = new Set<string>();
  return questions.filter((question) => {
    if (seen.has(question.id)) {
      return false;
    }
    seen.add(question.id);
    return true;
  });
}
