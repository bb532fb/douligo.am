import type { ExerciseDifficulty, SkillType } from "@prisma/client";
import { nextKnowledgeState } from "@/lib/learning/knowledge-state";
import { applyRetentionDecay, calculateLevelMastery, calculateSkillMastery, calculateTopicMastery, emptyTopicMastery } from "@/lib/learning/mastery-math";
import { curriculumSkillsOf } from "@/lib/learning/level-gate";
import type { DbClient } from "@/lib/db/client";
import { prisma } from "@/lib/db/prisma";
import { masteryRepository } from "@/server/repositories/mastery-repository";
import { reviewService } from "@/server/services/review-service";
import { levelUnlockService } from "@/server/services/level-unlock-service";

export type AttemptContext = {
  userId: string;
  courseId: string;
  questionId: string;
  topicId: string | null;
  skillType: SkillType;
  difficulty: ExerciseDifficulty;
  levelKey: string;
  unitId: string;
  isCorrect: boolean;
  timeSpentMs?: number | null;
  attemptNumber: number;
  isReview: boolean;
};

export const masteryService = {
  async recordAttempt(context: AttemptContext, db: DbClient = prisma) {
    const schedule = context.topicId
      ? await writeTopicMastery(context, db)
      : await reviewService.applyReview(
          {
            userId: context.userId,
            courseId: context.courseId,
            questionId: context.questionId,
            topicId: context.topicId,
            isCorrect: context.isCorrect,
            knowledgeState: "LEARNING",
          },
          db,
        ).then((item) => ({ knowledgeState: "LEARNING" as const, ...item }));
    await refreshAggregates(context, db);
    return schedule;
  },

  async refreshLevel(userId: string, courseId: string, levelKey: string, db: DbClient = prisma) {
    await refreshAggregates(
      {
        userId,
        courseId,
        questionId: "",
        topicId: null,
        skillType: "VOCABULARY",
        difficulty: "MEDIUM",
        levelKey,
        unitId: "",
        isCorrect: true,
        attemptNumber: 1,
        isReview: false,
      },
      db,
      false,
    );
  },
};

async function writeTopicMastery(context: AttemptContext, db: DbClient) {
  const topicId = context.topicId;
  if (!topicId) {
    return { knowledgeState: "LEARNING" as const, nextReviewAt: new Date(), intervalIndex: 0 };
  }
  const current = await masteryRepository.findTopicMastery(context.userId, context.courseId, topicId, db);
  const next = calculateTopicMastery(current ?? emptyTopicMastery(), {
    isCorrect: context.isCorrect,
    difficulty: context.difficulty,
    timeSpentMs: context.timeSpentMs,
    attemptNumber: context.attemptNumber,
    isReview: context.isReview,
  });
  const review = await reviewService.applyReview(
    {
      userId: context.userId,
      courseId: context.courseId,
      questionId: context.questionId,
      topicId,
      isCorrect: context.isCorrect,
      knowledgeState: current?.knowledgeState ?? "NEW",
    },
    db,
  );
  const knowledgeState = nextKnowledgeState({
    state: current?.knowledgeState ?? "NEW",
    score: next.score,
    consecutiveCorrect: next.consecutiveCorrect,
    consecutiveWrong: next.consecutiveWrong,
    successfulReviews: next.correctCount,
    distinctReviewDays: Math.min(next.correctCount, 3),
  });
  await masteryRepository.upsertTopicMastery(
    {
      userId: context.userId,
      courseId: context.courseId,
      topicId,
      score: next.score,
      evidenceScore: next.evidenceScore,
      knowledgeState,
      correctCount: next.correctCount,
      incorrectCount: next.incorrectCount,
      consecutiveCorrect: next.consecutiveCorrect,
      consecutiveWrong: next.consecutiveWrong,
      lastResultCorrect: context.isCorrect,
      lastPracticedAt: new Date(),
      nextReviewAt: review.nextReviewAt,
      intervalIndex: review.intervalIndex,
    },
    db,
  );
  return { knowledgeState, nextReviewAt: review.nextReviewAt, intervalIndex: review.intervalIndex };
}

async function refreshAggregates(context: AttemptContext, db: DbClient, applyEvent = true) {
  const [topics, skills, curriculum] = await Promise.all([
    masteryRepository.listTopicMasteries(context.userId, context.courseId, db),
    masteryRepository.listSkillMasteries(context.userId, context.courseId, db),
    masteryRepository.listCurriculumSkills(context.courseId, context.levelKey),
  ]);
  const present = curriculumSkillsOf(curriculum.map((row) => row.skillType));
  const skillScores: Partial<Record<SkillType, number>> = {};
  for (const skill of present) {
    const row = skills.find((item) => item.levelKey === context.levelKey && item.skillType === skill);
    const topicScores = topics
      .filter((item) => item.topic.level === context.levelKey && topicMatchesSkill(item.topic.kind, skill))
      .map((item) => applyRetentionDecay(item.score, item.lastPracticedAt));
    const recent = applyEvent && skill === context.skillType
      ? blendRecent(row?.score ?? null, context.isCorrect)
      : (row?.score ?? null);
    const score = calculateSkillMastery(topicScores, recent);
    skillScores[skill] = score;
    await masteryRepository.upsertSkillMastery(
      {
        userId: context.userId,
        courseId: context.courseId,
        levelKey: context.levelKey,
        skillType: skill,
        score,
        sampleCount: (row?.sampleCount ?? 0) + (applyEvent && skill === context.skillType ? 1 : 0),
      },
      db,
    );
  }
  const overall = calculateLevelMastery(skillScores, present);
  const existing = await db.levelMastery.findUnique({
    where: {
      userId_courseId_levelKey: {
        userId: context.userId,
        courseId: context.courseId,
        levelKey: context.levelKey,
      },
    },
  });
  await masteryRepository.upsertLevelMastery(
    {
      userId: context.userId,
      courseId: context.courseId,
      levelKey: context.levelKey,
      overallScore: overall,
      isUnlocked: existing?.isUnlocked ?? false,
      unlockedAt: existing?.unlockedAt ?? null,
      lastAssessmentScore: existing?.lastAssessmentScore ?? null,
      lastAssessmentPassed: existing?.lastAssessmentPassed ?? null,
      lessonsCompleted: existing?.lessonsCompleted ?? 0,
      lessonsTotal: existing?.lessonsTotal ?? 0,
    },
    db,
  );
  await levelUnlockService.tryUnlockNext(context.userId, context.courseId, context.levelKey, db);
}

function topicMatchesSkill(kind: "VOCABULARY" | "GRAMMAR", skill: SkillType): boolean {
  return (skill === "VOCABULARY" && kind === "VOCABULARY") || (skill === "GRAMMAR" && kind === "GRAMMAR");
}

function blendRecent(current: number | null, isCorrect: boolean): number {
  const observed = isCorrect ? 100 : 20;
  if (current == null) {
    return observed;
  }
  return current * 0.7 + observed * 0.3;
}
