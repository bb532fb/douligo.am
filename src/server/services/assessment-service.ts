import type { SkillType } from "@prisma/client";
import { ASSESSMENT_QUESTION_COUNT, unlockRuleFor } from "@/lib/learning/mastery-config";
import { AppError } from "@/lib/errors/app-error";
import { APP_ERRORS } from "@/lib/constants/copy";
import { prisma } from "@/lib/db/prisma";
import { assessmentRepository } from "@/server/repositories/assessment-repository";
import { masteryRepository } from "@/server/repositories/mastery-repository";
import { masteryService } from "@/server/services/mastery-service";

export const assessmentService = {
  async pickQuestions(courseId: string, levelKey: string, count = ASSESSMENT_QUESTION_COUNT) {
    const pool = await masteryRepository.listLevelQuestions(courseId, levelKey);
    if (pool.length === 0) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }
    return stratifiedSample(pool, count);
  },

  async recordCompletion(input: {
    userId: string;
    courseId: string;
    levelKey: string;
    lessonId: string;
    attemptId: string;
    questionIds: string[];
    score: number;
  }) {
    const passed = input.score >= unlockRuleFor(input.levelKey).assessment;
    await prisma.$transaction(async (tx) => {
      await assessmentRepository.create({ ...input, passed }, tx);
      const existing = await tx.levelMastery.findUnique({
        where: {
          userId_courseId_levelKey: {
            userId: input.userId,
            courseId: input.courseId,
            levelKey: input.levelKey,
          },
        },
      });
      await masteryRepository.upsertLevelMastery(
        {
          userId: input.userId,
          courseId: input.courseId,
          levelKey: input.levelKey,
          overallScore: existing?.overallScore ?? 0,
          lastAssessmentScore: input.score,
          lastAssessmentPassed: passed,
          isUnlocked: existing?.isUnlocked ?? false,
          unlockedAt: existing?.unlockedAt ?? null,
          lessonsCompleted: existing?.lessonsCompleted ?? 0,
          lessonsTotal: existing?.lessonsTotal ?? 0,
        },
        tx,
      );
      await masteryService.refreshLevel(input.userId, input.courseId, input.levelKey, tx);
    });
    return { passed, score: input.score };
  },
};

function stratifiedSample<T extends { id: string; skillType: SkillType }>(pool: T[], count: number): T[] {
  const groups = new Map<SkillType, T[]>();
  for (const question of shuffle(pool)) {
    const list = groups.get(question.skillType) ?? [];
    list.push(question);
    groups.set(question.skillType, list);
  }
  const picked: T[] = [];
  const skills = [...groups.keys()];
  while (picked.length < Math.min(count, pool.length)) {
    for (const skill of skills) {
      const next = groups.get(skill)?.shift();
      if (next && !picked.some((item) => item.id === next.id)) {
        picked.push(next);
      }
      if (picked.length >= count) {
        break;
      }
    }
  }
  return shuffle(picked);
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = result[index];
    const other = result[swap];
    if (current && other) {
      result[index] = other;
      result[swap] = current;
    }
  }
  return result;
}
