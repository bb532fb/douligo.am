import type { KnowledgeState, Prisma, SkillType } from "@prisma/client";
import type { DbClient } from "@/lib/db/client";
import { prisma } from "@/lib/db/prisma";

export type TopicMasteryWrite = {
  userId: string;
  courseId: string;
  topicId: string;
  score: number;
  evidenceScore: number;
  knowledgeState: KnowledgeState;
  correctCount: number;
  incorrectCount: number;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  lastResultCorrect: boolean;
  lastPracticedAt: Date;
  nextReviewAt: Date;
  intervalIndex: number;
};

export const masteryRepository = {
  listTopicMasteries(userId: string, courseId: string, db: DbClient = prisma) {
    return db.topicMastery.findMany({
      where: { userId, courseId },
      include: { topic: true },
    });
  },

  listSkillMasteries(userId: string, courseId: string, db: DbClient = prisma) {
    return db.skillMastery.findMany({ where: { userId, courseId } });
  },

  listLevelMasteries(userId: string, courseId: string, db: DbClient = prisma) {
    return db.levelMastery.findMany({ where: { userId, courseId } });
  },

  findTopicMastery(userId: string, courseId: string, topicId: string, db: DbClient = prisma) {
    return db.topicMastery.findUnique({
      where: { userId_courseId_topicId: { userId, courseId, topicId } },
    });
  },

  upsertTopicMastery(input: TopicMasteryWrite, db: DbClient = prisma) {
    const data = topicWriteData(input);
    return db.topicMastery.upsert({
      where: {
        userId_courseId_topicId: {
          userId: input.userId,
          courseId: input.courseId,
          topicId: input.topicId,
        },
      },
      create: data,
      update: data,
    });
  },

  upsertSkillMastery(
    input: {
      userId: string;
      courseId: string;
      levelKey: string;
      skillType: SkillType;
      score: number;
      sampleCount: number;
    },
    db: DbClient = prisma,
  ) {
    return db.skillMastery.upsert({
      where: {
        userId_courseId_levelKey_skillType: {
          userId: input.userId,
          courseId: input.courseId,
          levelKey: input.levelKey,
          skillType: input.skillType,
        },
      },
      create: input,
      update: { score: input.score, sampleCount: input.sampleCount },
    });
  },

  upsertLevelMastery(
    input: Prisma.LevelMasteryUncheckedCreateInput,
    db: DbClient = prisma,
  ) {
    const { userId, courseId, levelKey, ...update } = input;
    return db.levelMastery.upsert({
      where: { userId_courseId_levelKey: { userId, courseId, levelKey } },
      create: input,
      update,
    });
  },

  countDueReviews(userId: string, courseId: string, now = new Date()) {
    return prisma.reviewItem.count({
      where: { userId, courseId, nextReviewAt: { lte: now } },
    });
  },

  listCurriculumSkills(courseId: string, levelKey: string) {
    return prisma.question.findMany({
      where: { lesson: { unit: { courseId, level: levelKey }, kind: "STANDARD" } },
      select: { skillType: true },
      distinct: ["skillType"],
    });
  },

  listLevelQuestions(courseId: string, levelKey: string) {
    return prisma.question.findMany({
      where: { lesson: { unit: { courseId, level: levelKey }, kind: "STANDARD" } },
      include: { options: true, topic: true, lesson: { include: { unit: true } } },
      orderBy: [{ lesson: { order: "asc" } }, { order: "asc" }],
    });
  },
};

function topicWriteData(input: TopicMasteryWrite) {
  return {
    userId: input.userId,
    courseId: input.courseId,
    topicId: input.topicId,
    score: input.score,
    evidenceScore: input.evidenceScore,
    knowledgeState: input.knowledgeState,
    correctCount: input.correctCount,
    incorrectCount: input.incorrectCount,
    consecutiveCorrect: input.consecutiveCorrect,
    consecutiveWrong: input.consecutiveWrong,
    lastResultCorrect: input.lastResultCorrect,
    lastPracticedAt: input.lastPracticedAt,
    nextReviewAt: input.nextReviewAt,
    intervalIndex: input.intervalIndex,
  };
}
