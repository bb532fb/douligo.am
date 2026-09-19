import { CEFR_TRACK, cefrIndex, nextCefrLevel, unlockRuleFor } from "@/lib/learning/mastery-config";
import { applyRetentionDecay } from "@/lib/learning/mastery-math";
import { canUnlockNextLevel, curriculumSkillsOf, type UnlockInput } from "@/lib/learning/level-gate";
import type { DbClient } from "@/lib/db/client";
import { prisma } from "@/lib/db/prisma";
import { lessonRepository } from "@/server/repositories/lesson-repository";
import { masteryRepository } from "@/server/repositories/mastery-repository";
import { progressRepository } from "@/server/repositories/progress-repository";

export const levelUnlockService = {
  async ensurePlacement(userId: string, courseId: string, startLevel: string) {
    const rows = await masteryRepository.listLevelMasteries(userId, courseId);
    if (rows.length === 0) {
      await this.seedPlacement(userId, courseId, startLevel);
    }
  },

  async accessibleLevels(userId: string, courseId: string, startLevel: string) {
    await this.ensurePlacement(userId, courseId, startLevel);
    const rows = await masteryRepository.listLevelMasteries(userId, courseId);
    const unlocked = new Set(rows.filter((row) => row.isUnlocked).map((row) => row.levelKey));
    unlocked.add(startLevel);
    for (const level of CEFR_TRACK) {
      if (cefrIndex(level) < cefrIndex(startLevel)) {
        unlocked.delete(level);
      }
    }
    return unlocked;
  },

  studyingLevel(startLevel: string, accessible: Set<string>) {
    let current = startLevel;
    for (const level of CEFR_TRACK) {
      if (cefrIndex(level) < cefrIndex(startLevel) || !accessible.has(level)) {
        continue;
      }
      current = level;
    }
    return current;
  },

  async tryUnlockNext(userId: string, courseId: string, levelKey: string, db: DbClient = prisma) {
    const nextLevel = nextCefrLevel(levelKey);
    if (!nextLevel) {
      return { unlocked: false, nextLevel: null };
    }
    const existing = await db.levelMastery.findUnique({
      where: { userId_courseId_levelKey: { userId, courseId, levelKey: nextLevel } },
    });
    if (existing?.isUnlocked) {
      return { unlocked: true, nextLevel };
    }

    const input = await buildUnlockInput(userId, courseId, levelKey, db);
    const decision = canUnlockNextLevel(input);
    if (!decision.ok) {
      return { unlocked: false, nextLevel, gaps: decision.gaps };
    }

    await masteryRepository.upsertLevelMastery(
      { userId, courseId, levelKey: nextLevel, isUnlocked: true, unlockedAt: new Date() },
      db,
    );
    return { unlocked: true, nextLevel };
  },

  async seedPlacement(userId: string, courseId: string, startLevel: string) {
    await masteryRepository.upsertLevelMastery({
      userId,
      courseId,
      levelKey: startLevel,
      isUnlocked: true,
      unlockedAt: new Date(),
    });
  },

  async resetPlacement(userId: string, courseId: string, startLevel: string) {
    const rows = await masteryRepository.listLevelMasteries(userId, courseId);
    await Promise.all(
      rows
        .filter((row) => row.levelKey !== startLevel && row.isUnlocked)
        .map((row) =>
          masteryRepository.upsertLevelMastery({
            userId,
            courseId,
            levelKey: row.levelKey,
            isUnlocked: false,
            unlockedAt: null,
          }),
        ),
    );
    await this.seedPlacement(userId, courseId, startLevel);
  },

  unlockView(input: UnlockInput) {
    const rule = unlockRuleFor(input.levelKey);
    return {
      ...canUnlockNextLevel(input),
      required: rule.overall,
      nextLevel: nextCefrLevel(input.levelKey),
    };
  },
};

async function buildUnlockInput(
  userId: string,
  courseId: string,
  levelKey: string,
  db: DbClient,
): Promise<UnlockInput> {
  const [skills, topics, levelRow, curriculum, due, path, completed] = await Promise.all([
    masteryRepository.listSkillMasteries(userId, courseId, db),
    masteryRepository.listTopicMasteries(userId, courseId, db),
    db.levelMastery.findUnique({
      where: { userId_courseId_levelKey: { userId, courseId, levelKey } },
    }),
    masteryRepository.listCurriculumSkills(courseId, levelKey),
    masteryRepository.countDueReviews(userId, courseId),
    lessonRepository.listCoursePath(courseId),
    progressRepository.listCompletedLessonIds(userId, courseId),
  ]);
  const standard = path.flatMap((unit) =>
    unit.lessons.filter((lesson) => lesson.kind === "STANDARD" && unit.level === levelKey),
  );
  const done = new Set(completed.map((item) => item.lessonId));
  return {
    levelKey,
    overall: levelRow?.overallScore ?? 0,
    skills: Object.fromEntries(
      skills.filter((row) => row.levelKey === levelKey).map((row) => [row.skillType, row.score]),
    ),
    curriculumSkills: curriculumSkillsOf(curriculum.map((row) => row.skillType)),
    assessmentScore: levelRow?.lastAssessmentScore ?? null,
    criticalTopics: topics
      .filter((row) => row.topic.level === levelKey && row.topic.isCritical)
      .map((row) => ({ key: row.topic.key, score: applyRetentionDecay(row.score, row.lastPracticedAt) })),
    lessonsCompleted: standard.filter((lesson) => done.has(lesson.id)).length,
    lessonsTotal: standard.length,
    reviewDue: due,
  };
}
