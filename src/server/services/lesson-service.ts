import { APP_ERRORS } from "@/lib/constants/copy";
import { calculateLessonXp } from "@/lib/gamification/xp";
import { nextMastery } from "@/lib/gamification/mastery";
import { AppError } from "@/lib/errors/app-error";
import { firstIncompleteLesson, firstIndexForLevel, isLessonUnlocked } from "@/lib/learning/unlock";
import { revealCorrectAnswer, toPublicQuestion } from "@/lib/learning/to-public-question";
import { validateAnswer } from "@/lib/learning/validate-answer";
import type { AnswerPayload, PathUnit } from "@/types/learning";
import { attemptRepository } from "@/server/repositories/attempt-repository";
import { lessonRepository } from "@/server/repositories/lesson-repository";
import { progressRepository } from "@/server/repositories/progress-repository";
import { vocabularyRepository } from "@/server/repositories/vocabulary-repository";
import { gamificationService } from "@/server/services/gamification-service";

export const lessonService = {
  async getLearningPath(userId: string, courseId: string): Promise<PathUnit[]> {
    const [units, completed, progress] = await Promise.all([
      lessonRepository.listCoursePath(courseId),
      progressRepository.listCompletedLessonIds(userId, courseId),
      progressRepository.getCourseProgress(userId, courseId),
    ]);
    const completedIds = new Set(completed.map((item) => item.lessonId));
    const ordered = units.flatMap((unit) => unit.lessons.map((lesson) => ({ id: lesson.id, level: unit.level })));
    const startIndex = firstIndexForLevel(ordered, progress?.startLevel ?? "A1");
    const currentId = firstIncompleteLesson(ordered, completedIds, startIndex);

    return units.map((unit) => ({
      id: unit.id,
      title: unit.title,
      description: unit.description,
      order: unit.order,
      level: unit.level,
      lessons: unit.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        estimatedMinutes: lesson.estimatedMinutes,
        xpReward: lesson.xpReward,
        status: pathStatus(lesson.id, completedIds, currentId, ordered, startIndex),
      })),
    }));
  },

  async startLesson(userId: string, lessonId: string) {
    const lesson = await lessonRepository.findById(lessonId);
    if (!lesson) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }

    const ordered = await lessonRepository.listCourseLessons(lesson.unit.courseId);
    const completed = await progressRepository.listCompletedLessonIds(userId, lesson.unit.courseId);
    const progress = await progressRepository.getCourseProgress(userId, lesson.unit.courseId);
    const gated = ordered.map((item) => ({ id: item.id, level: item.unit.level }));
    const startIndex = firstIndexForLevel(gated, progress?.startLevel ?? "A1");
    const unlocked = isLessonUnlocked(gated, new Set(completed.map((item) => item.lessonId)), lessonId, startIndex);
    if (!unlocked) {
      throw new AppError("LOCKED", APP_ERRORS.lessonLocked, 403);
    }

    await gamificationService.requireHearts(userId);
    const attempt = await attemptRepository.create({
      userId,
      lessonId,
      questionIds: lesson.questions.map((question) => question.id),
    });

    const langs = {
      sourceLanguage: lesson.unit.course.sourceLanguage,
      targetLanguage: lesson.unit.course.targetLanguage,
    };

    return {
      attemptId: attempt.id,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        xpReward: lesson.xpReward,
      },
      questions: lesson.questions.map((question) => toPublicQuestion(question, langs)),
    };
  },

  async submitAnswer(userId: string, attemptId: string, questionId: string, answer: AnswerPayload) {
    const attempt = await attemptRepository.findById(attemptId);
    if (!attempt || attempt.userId !== userId || attempt.completedAt) {
      throw new AppError("INVALID_ATTEMPT", APP_ERRORS.invalidAttempt, 403);
    }
    if (!attempt.questionIds.includes(questionId)) {
      throw new AppError("INVALID_ATTEMPT", APP_ERRORS.invalidAttempt, 403);
    }

    const existing = await attemptRepository.findAnswer(attemptId, questionId);
    if (existing) {
      throw new AppError("ALREADY_ANSWERED", APP_ERRORS.alreadyAnswered, 409);
    }

    const lesson = await lessonRepository.findById(attempt.lessonId);
    const question = lesson?.questions.find((item) => item.id === questionId);
    if (!lesson || !question) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }

    const result = validateAnswer(question, answer);
    let hearts = await gamificationService.syncHearts(userId);
    if (!result.isCorrect) {
      hearts = await gamificationService.applyWrongAnswer(userId);
    }

    await attemptRepository.createAnswer({
      attemptId,
      userId,
      questionId,
      answer: result.storedAnswer,
      isCorrect: result.isCorrect,
    });

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
    await progressRepository.upsertLessonCompletion({ userId, lessonId: lesson.id, score });

    const wordsLearned = await updateVocabulary(userId, lesson, attempt.answers);
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

type FullLesson = NonNullable<Awaited<ReturnType<typeof lessonRepository.findById>>>;

async function updateVocabulary(
  this: void,
  userId: string,
  lesson: FullLesson,
  answers: Array<{ isCorrect: boolean }>,
) {
  const mostlyCorrect = answers.filter((item) => item.isCorrect).length >= answers.length / 2;
  let learned = 0;
  for (const item of lesson.vocabulary) {
    const current = await vocabularyRepository.listByCourse(userId, lesson.unit.courseId);
    const existing = current.find((entry) => entry.vocabularyWordId === item.vocabularyWordId);
    const mastery = nextMastery(existing?.mastery ?? 0, mostlyCorrect);
    await vocabularyRepository.upsertReview({
      userId,
      vocabularyWordId: item.vocabularyWordId,
      isCorrect: mostlyCorrect,
      mastery,
    });
    learned += 1;
  }
  return learned;
}

async function refreshCourseProgress(userId: string, courseId: string) {
  const ordered = await lessonRepository.listCourseLessons(courseId);
  const [completed, progress] = await Promise.all([
    progressRepository.listCompletedLessonIds(userId, courseId),
    progressRepository.getCourseProgress(userId, courseId),
  ]);
  const completedIds = new Set(completed.map((item) => item.lessonId));
  const gated = ordered.map((item) => ({ id: item.id, level: item.unit.level }));
  const startIndex = firstIndexForLevel(gated, progress?.startLevel ?? "A1");
  const currentId = firstIncompleteLesson(gated, completedIds, startIndex);
  const current = ordered.find((lesson) => lesson.id === currentId) ?? ordered.at(-1);
  const words = await vocabularyRepository.countLearned(userId, courseId);
  if (!current) {
    return;
  }

  await progressRepository.updateCourseProgress({
    userId,
    courseId,
    currentUnitId: current.unitId,
    currentLessonId: current.id,
    totalLessonsCompleted: completedIds.size,
    totalWordsLearned: words,
  });
}

function pathStatus(
  lessonId: string,
  completedIds: Set<string>,
  currentId: string | null,
  ordered: Array<{ id: string; level: string }>,
  startIndex: number,
): PathUnit["lessons"][number]["status"] {
  if (completedIds.has(lessonId)) {
    return "completed";
  }
  if (lessonId === currentId) {
    return "current";
  }
  if (isLessonUnlocked(ordered, completedIds, lessonId, startIndex)) {
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
    prisma.achievement.findMany(),
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

