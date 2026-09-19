import { APP_ERRORS } from "@/lib/constants/copy";
import { calculateLessonXp } from "@/lib/gamification/xp";
import { AppError } from "@/lib/errors/app-error";
import { firstIncompleteLesson, firstIndexForLevel, isLessonUnlocked, unitsFromStartLevel } from "@/lib/learning/unlock";
import { revealCorrectAnswer, toPublicQuestion } from "@/lib/learning/to-public-question";
import { validateAnswer } from "@/lib/learning/validate-answer";
import type { AnswerPayload, PathUnit } from "@/types/learning";
import { rememberCatalog } from "@/lib/cache/remember";
import { prisma } from "@/lib/db/prisma";
import { attemptRepository } from "@/server/repositories/attempt-repository";
import { lessonRepository } from "@/server/repositories/lesson-repository";
import { progressRepository } from "@/server/repositories/progress-repository";
import { vocabularyRepository } from "@/server/repositories/vocabulary-repository";
import { gamificationService } from "@/server/services/gamification-service";
import { assertUnlocked, resolveAttemptId, resumeIndexOf } from "@/server/services/lesson-start";
import { questionsForLesson } from "@/server/services/lesson-session";
import { assessmentService } from "@/server/services/assessment-service";
import { levelUnlockService } from "@/server/services/level-unlock-service";
import { recordLessonAnswer, updateLessonVocabulary } from "@/server/services/lesson-progress";

export const lessonService = {
  async getLearningPath(userId: string, courseId: string): Promise<PathUnit[]> {
    const [units, completed, progress] = await Promise.all([
      lessonRepository.listCoursePath(courseId),
      progressRepository.listCompletedLessonIds(userId, courseId),
      progressRepository.getCourseProgress(userId, courseId),
    ]);
    const startLevel = progress?.startLevel ?? "A1";
    const accessible = await levelUnlockService.accessibleLevels(userId, courseId, startLevel);
    const completedIds = new Set(completed.map((item) => item.lessonId));
    const visible = unitsFromStartLevel(units, startLevel);
    const ordered = visible.flatMap((unit) =>
      unit.lessons
        .filter((lesson) => lesson.kind === "STANDARD")
        .map((lesson) => ({ id: lesson.id, level: unit.level, kind: lesson.kind })),
    );
    const startIndex = firstIndexForLevel(ordered, startLevel);
    const studying = levelUnlockService.studyingLevel(startLevel, accessible);
    const currentId = firstIncompleteLesson(ordered, completedIds, startIndex, studying, accessible);

    return visible.map((unit) => ({
      id: unit.id,
      title: unit.title,
      description: unit.description,
      order: unit.order,
      level: unit.level,
      lessons: unit.lessons
        .filter((lesson) => lesson.kind === "STANDARD")
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          estimatedMinutes: lesson.estimatedMinutes,
          xpReward: lesson.xpReward,
          status: pathStatus(lesson.id, completedIds, currentId, ordered, startIndex, accessible),
        })),
    }));
  },

  async startLesson(userId: string, lessonId: string) {
    const lesson = await lessonRepository.findForPlay(lessonId);
    if (!lesson) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }

    const courseId = lesson.unit.courseId;
    const [ordered, completed, progress, open] = await Promise.all([
      lessonRepository.listUnlockOrder(courseId),
      progressRepository.listCompletedLessonIds(userId, courseId),
      progressRepository.getCourseProgress(userId, courseId),
      attemptRepository.findOpen(userId, lessonId),
      gamificationService.requireHearts(userId),
    ]);
    const startLevel = progress?.startLevel ?? "A1";
    const accessible = await levelUnlockService.accessibleLevels(userId, courseId, startLevel);
    await assertUnlocked(lessonId, ordered, completed, startLevel, accessible);

    const langs = {
      sourceLanguage: lesson.unit.course.sourceLanguage,
      targetLanguage: lesson.unit.course.targetLanguage,
    };
    const selected = await questionsForLesson(
      userId,
      {
        kind: lesson.kind,
        unit: { courseId: lesson.unit.courseId, level: lesson.unit.level },
        questions: lesson.questions as Parameters<typeof questionsForLesson>[1]["questions"],
      },
      open?.questionIds,
    );
    if (selected.length === 0) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }
    const questions = selected.map((question) => toPublicQuestion(question, langs));
    const attemptId = await resolveAttemptId(open?.id, userId, lessonId, selected);

    return {
      attemptId,
      resumeIndex: resumeIndexOf(questions, open?.answers ?? []),
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        xpReward: lesson.xpReward,
      },
      questions,
    };
  },

  async submitAnswer(
    userId: string,
    attemptId: string,
    questionId: string,
    answer: AnswerPayload,
    timeSpentMs?: number,
  ) {
    const [attempt, existing, question] = await Promise.all([
      attemptRepository.findForSubmit(attemptId),
      attemptRepository.findAnswer(attemptId, questionId),
      lessonRepository.findQuestion(questionId),
    ]);
    if (!attempt || attempt.userId !== userId || attempt.completedAt) {
      throw new AppError("INVALID_ATTEMPT", APP_ERRORS.invalidAttempt, 403);
    }
    if (!question) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }
    if (!attempt.questionIds.includes(questionId)) {
      throw new AppError("INVALID_ATTEMPT", APP_ERRORS.invalidAttempt, 403);
    }
    if (existing) {
      throw new AppError("ALREADY_ANSWERED", APP_ERRORS.alreadyAnswered, 409);
    }

    const result = validateAnswer(question, answer);
    const hearts = result.isCorrect
      ? await gamificationService.syncHearts(userId)
      : await gamificationService.applyWrongAnswer(userId);
    await prisma.$transaction((tx) =>
      recordLessonAnswer({
        tx,
        userId,
        attemptId,
        question,
        storedAnswer: result.storedAnswer,
        isCorrect: result.isCorrect,
        timeSpentMs,
        isReview: attempt.lesson?.kind === "REVIEW",
      }),
    );

    return {
      isCorrect: result.isCorrect,
      explanation: question.explanation,
      correctAnswer: revealCorrectAnswer(question),
      hearts,
    };
  },

  async completeLesson(userId: string, attemptId: string) {
    const attempt = await attemptRepository.findById(attemptId);
    if (!attempt || attempt.userId !== userId) {
      throw new AppError("INVALID_ATTEMPT", APP_ERRORS.invalidAttempt, 403);
    }
    if (attempt.completedAt) {
      return {
        score: attempt.score ?? 0,
        xpAwarded: attempt.xpAwarded,
        streakChanged: false,
        wordsLearned: 0,
      };
    }

    if (attempt.answers.length !== attempt.questionIds.length) {
      throw new AppError("INVALID_ATTEMPT", APP_ERRORS.invalidAttempt, 400);
    }

    const lesson = await lessonRepository.findById(attempt.lessonId);
    if (!lesson) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }

    const correctCount = attempt.answers.filter((item) => item.isCorrect).length;
    const score = Math.round((correctCount / attempt.questionIds.length) * 100);
    const previous = await progressRepository.getLessonProgress(userId, lesson.id);
    const xp = calculateLessonXp(correctCount, Boolean(previous?.completed));

    const answerAward = await gamificationService.awardXp({
      userId,
      amount: xp,
      source: "LESSON_COMPLETE",
      sourceId: attempt.id,
    });

    await attemptRepository.complete(attempt.id, score, answerAward.awarded);
    if (lesson.kind === "STANDARD") {
      await progressRepository.upsertLessonCompletion({ userId, lessonId: lesson.id, score });
      await levelUnlockService.tryUnlockNext(userId, lesson.unit.courseId, lesson.unit.level);
    }
    if (lesson.kind === "ASSESSMENT") {
      await assessmentService.recordCompletion({
        userId,
        courseId: lesson.unit.courseId,
        levelKey: lesson.unit.level,
        lessonId: lesson.id,
        attemptId: attempt.id,
        questionIds: attempt.questionIds,
        score,
      });
    }

    const wordsLearned = await updateLessonVocabulary(userId, lesson, attempt.answers);
    await refreshCourseProgress(userId, lesson.unit.courseId);
    const streak = await gamificationService.applyStreak(userId);
    await gamificationService.applyDailyGoal(userId, answerAward.awarded);
    await unlockAchievements(userId, lesson.unit.courseId);

    return {
      score,
      xpAwarded: answerAward.awarded,
      streakChanged: streak.changed,
      currentStreak: streak.currentStreak,
      wordsLearned,
    };
  },
};

async function refreshCourseProgress(userId: string, courseId: string) {
  const ordered = await lessonRepository.listCourseLessons(courseId);
  const [completed, progress] = await Promise.all([
    progressRepository.listCompletedLessonIds(userId, courseId),
    progressRepository.getCourseProgress(userId, courseId),
  ]);
  const startLevel = progress?.startLevel ?? "A1";
  const accessible = await levelUnlockService.accessibleLevels(userId, courseId, startLevel);
  const completedIds = new Set(completed.map((item) => item.lessonId));
  const gated = ordered
    .filter((item) => item.kind === "STANDARD")
    .map((item) => ({ id: item.id, level: item.unit.level, kind: item.kind }));
  const startIndex = firstIndexForLevel(gated, startLevel);
  const studying = levelUnlockService.studyingLevel(startLevel, accessible);
  const currentId = firstIncompleteLesson(gated, completedIds, startIndex, studying, accessible);
  const current = ordered.find((lesson) => lesson.id === currentId) ?? ordered.find((item) => item.kind === "STANDARD");
  const words = await vocabularyRepository.countLearned(userId, courseId);
  if (!current) {
    return;
  }

  await progressRepository.updateCourseProgress({
    userId,
    courseId,
    currentUnitId: current.unitId,
    currentLessonId: current.id,
    totalLessonsCompleted: gated.filter((item) => completedIds.has(item.id)).length,
    totalWordsLearned: words,
  });
}

function pathStatus(
  lessonId: string,
  completedIds: Set<string>,
  currentId: string | null,
  ordered: Array<{ id: string; level: string; kind?: string }>,
  startIndex: number,
  accessible: Set<string>,
): PathUnit["lessons"][number]["status"] {
  if (completedIds.has(lessonId)) {
    return "completed";
  }
  if (lessonId === currentId) {
    return "current";
  }
  if (isLessonUnlocked(ordered, completedIds, lessonId, startIndex, accessible)) {
    return "available";
  }
  return "locked";
}

async function unlockAchievements(userId: string, courseId: string) {
  const { prisma } = await import("@/lib/db/prisma");
  const [lessons, streak, xp, words, achievements, unlocked] = await Promise.all([
    progressRepository.listCompletedLessonIds(userId, courseId),
    gamificationService.applyStreak(userId),
    gamificationService.totalXp(userId),
    vocabularyRepository.countLearned(userId, courseId),
    rememberCatalog("achievements", () => prisma.achievement.findMany()),
    prisma.userAchievement.findMany({ where: { userId } }),
  ]);

  const unlockedIds = new Set(unlocked.map((item) => item.achievementId));
  const values: Record<string, number> = {
    FIRST_LESSON: lessons.length,
    LESSONS_COMPLETED: lessons.length,
    STREAK_DAYS: streak.currentStreak,
    XP_TOTAL: xp,
    WORDS_LEARNED: words,
  };

  for (const achievement of achievements) {
    if (unlockedIds.has(achievement.id)) {
      continue;
    }
    if ((values[achievement.type] ?? 0) >= achievement.threshold) {
      await prisma.userAchievement.create({
        data: { userId, achievementId: achievement.id },
      });
    }
  }
}

