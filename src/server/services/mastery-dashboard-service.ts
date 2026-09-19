import type { SkillType } from "@prisma/client";
import { applyRetentionDecay } from "@/lib/learning/mastery-math";
import { nextCefrLevel, unlockRuleFor, WEAK_TOPIC_SCORE } from "@/lib/learning/mastery-config";
import { curriculumSkillsOf } from "@/lib/learning/level-gate";
import type { MasteryDashboard, SkillBreakdown, TopicSummary } from "@/types/mastery";
import { masteryRepository } from "@/server/repositories/mastery-repository";
import { assessmentRepository } from "@/server/repositories/assessment-repository";
import { progressRepository } from "@/server/repositories/progress-repository";
import { lessonRepository } from "@/server/repositories/lesson-repository";
import { levelUnlockService } from "@/server/services/level-unlock-service";

export const masteryDashboardService = {
  async getDashboard(userId: string, courseId: string, startLevel: string): Promise<MasteryDashboard> {
    const [topics, skills, levels, due, path, progress] = await Promise.all([
      masteryRepository.listTopicMasteries(userId, courseId),
      masteryRepository.listSkillMasteries(userId, courseId),
      masteryRepository.listLevelMasteries(userId, courseId),
      masteryRepository.countDueReviews(userId, courseId),
      lessonRepository.listCoursePath(courseId),
      progressRepository.listCompletedLessonIds(userId, courseId),
    ]);
    const accessible = await levelUnlockService.accessibleLevels(userId, courseId, startLevel);
    const currentLevel = levelUnlockService.studyingLevel(startLevel, accessible);
    const levelRow = levels.find((row) => row.levelKey === currentLevel);
    const standard = path.flatMap((unit) => unit.lessons.filter((lesson) => lesson.kind === "STANDARD" && unit.level === currentLevel));
    const completed = new Set(progress.map((item) => item.lessonId));
    const lessonsCompleted = standard.filter((lesson) => completed.has(lesson.id)).length;
    const skillRows = skills.filter((row) => row.levelKey === currentLevel);
    const present = await masteryRepository.listCurriculumSkills(courseId, currentLevel);
    const curriculumSkills = curriculumSkillsOf(present.map((row) => row.skillType));
    const skillMap = Object.fromEntries(skillRows.map((row) => [row.skillType, row.score])) as Partial<Record<SkillType, number>>;
    const rule = unlockRuleFor(currentLevel);
    const skillBreakdown: SkillBreakdown[] = curriculumSkills.map((skill) => ({
      skill,
      score: Math.round(skillMap[skill] ?? 0),
      required: rule.skills[skill],
      inCurriculum: true,
    }));
    const levelTopics = topics.filter((row) => row.topic.level === currentLevel);
    const weakTopics = toSummaries(
      levelTopics.filter((row) => row.correctCount + row.incorrectCount > 0 && applyRetentionDecay(row.score, row.lastPracticedAt) < WEAK_TOPIC_SCORE),
    );
    const recentlyLearned = toSummaries(
      [...levelTopics]
        .filter((row) => row.knowledgeState === "LEARNED" || row.knowledgeState === "MASTERED")
        .sort((left, right) => (right.lastPracticedAt?.getTime() ?? 0) - (left.lastPracticedAt?.getTime() ?? 0))
        .slice(0, 5),
    );
    const unlock = levelUnlockService.unlockView({
      levelKey: currentLevel,
      overall: levelRow?.overallScore ?? 0,
      skills: skillMap,
      curriculumSkills,
      assessmentScore: levelRow?.lastAssessmentScore ?? null,
      criticalTopics: levelTopics
        .filter((row) => row.topic.isCritical)
        .map((row) => ({ key: row.topic.key, score: applyRetentionDecay(row.score, row.lastPracticedAt) })),
      lessonsCompleted,
      lessonsTotal: standard.length,
      reviewDue: due,
    });
    const [assessment, review] = await Promise.all([
      assessmentRepository.findSpecialLesson(courseId, currentLevel, "ASSESSMENT"),
      assessmentRepository.findSpecialLesson(courseId, currentLevel, "REVIEW"),
    ]);
    return {
      currentLevel,
      overall: Math.round(levelRow?.overallScore ?? 0),
      skills: skillBreakdown,
      lessonsCompleted,
      lessonsTotal: standard.length,
      weakTopics,
      recentlyLearned,
      reviewDue: due,
      unlock: {
        nextLevel: nextCefrLevel(currentLevel),
        locked: !unlock.ok,
        overall: Math.round(levelRow?.overallScore ?? 0),
        required: unlock.required,
        gaps: unlock.gaps,
        weakTopics,
      },
      assessmentLessonId: assessment?.id ?? null,
      assessmentAvailable:
        lessonsCompleted >= standard.length &&
        standard.length > 0 &&
        (levelRow?.overallScore ?? 0) >= 80 &&
        due === 0,
      lastAssessmentScore: levelRow?.lastAssessmentScore ?? null,
      lastAssessmentPassed: levelRow?.lastAssessmentPassed ?? null,
      reviewLessonId: review?.id ?? null,
    };
  },
};

function toSummaries(rows: Array<{ score: number; topic: { key: string; title: string; isCritical: boolean } }>): TopicSummary[] {
  return rows
    .map((row) => ({
      key: row.topic.key,
      title: row.topic.title,
      score: Math.round(row.score),
      isCritical: row.topic.isCritical,
    }))
    .slice(0, 6);
}
