import { calculateTopicMastery, emptyTopicMastery } from "@/lib/learning/mastery-math";
import { nextKnowledgeState } from "@/lib/learning/knowledge-state";
import { calculateNextReviewDate } from "@/lib/learning/review-schedule";
import type { DbClient } from "@/lib/db/client";
import { vocabularyRepository } from "@/server/repositories/vocabulary-repository";
import { masteryService } from "@/server/services/mastery-service";
import type { lessonRepository } from "@/server/repositories/lesson-repository";

type QuestionRow = NonNullable<Awaited<ReturnType<typeof lessonRepository.findQuestion>>>;
type LessonRow = NonNullable<Awaited<ReturnType<typeof lessonRepository.findById>>>;

export async function recordLessonAnswer(input: {
  tx: DbClient;
  userId: string;
  attemptId: string;
  question: QuestionRow;
  storedAnswer: string;
  isCorrect: boolean;
  timeSpentMs?: number;
  isReview: boolean;
}) {
  const prior = await input.tx.userAnswer.count({
    where: { userId: input.userId, questionId: input.question.id },
  });
  const timeSpentMs = clampTime(input.timeSpentMs);
  await input.tx.userAnswer.create({
    data: {
      attemptId: input.attemptId,
      userId: input.userId,
      questionId: input.question.id,
      answer: input.storedAnswer,
      isCorrect: input.isCorrect,
      timeSpentMs,
      attemptNumber: prior + 1,
      skillType: input.question.skillType,
      topicId: input.question.topicId,
      unitId: input.question.lesson.unitId,
      levelKey: input.question.lesson.unit.level,
    },
  });
  await masteryService.recordAttempt(
    {
      userId: input.userId,
      courseId: input.question.lesson.unit.courseId,
      questionId: input.question.id,
      topicId: input.question.topicId,
      skillType: input.question.skillType,
      difficulty: input.question.difficulty,
      levelKey: input.question.lesson.unit.level,
      unitId: input.question.lesson.unitId,
      isCorrect: input.isCorrect,
      timeSpentMs,
      attemptNumber: prior + 1,
      isReview: input.isReview,
    },
    input.tx,
  );
}

export async function updateLessonVocabulary(
  userId: string,
  lesson: LessonRow,
  answers: Array<{ questionId: string; isCorrect: boolean }>,
) {
  const wordIds = lesson.vocabulary.map((item) => item.vocabularyWordId);
  const existing = await vocabularyRepository.listByWordIds(userId, wordIds);
  const byWord = new Map(existing.map((item) => [item.vocabularyWordId, item]));
  await Promise.all(
    lesson.vocabulary.map((item) => {
      const related = answersForWord(item.vocabularyWord, lesson.questions, answers);
      const isCorrect = related.length > 0
        ? related.filter((answer) => answer.isCorrect).length >= related.length / 2
        : answers.filter((answer) => answer.isCorrect).length >= answers.length / 2;
      const current = byWord.get(item.vocabularyWordId);
      const next = calculateTopicMastery(
        {
          ...emptyTopicMastery(),
          score: current?.mastery ?? 0,
          evidenceScore: current?.mastery ?? 50,
          correctCount: current?.correctAnswers ?? 0,
          incorrectCount: current?.incorrectAnswers ?? 0,
        },
        { isCorrect, difficulty: "MEDIUM", attemptNumber: (current?.correctAnswers ?? 0) + 1, isReview: false },
      );
      const review = calculateNextReviewDate(current?.intervalDays ?? 0, isCorrect);
      return vocabularyRepository.upsertReview({
        userId,
        vocabularyWordId: item.vocabularyWordId,
        isCorrect,
        mastery: Math.round(next.score),
        knowledgeState: nextKnowledgeState({
          state: current?.knowledgeState ?? "NEW",
          score: next.score,
          consecutiveCorrect: isCorrect ? 1 : 0,
          consecutiveWrong: isCorrect ? 0 : 1,
          successfulReviews: next.correctCount,
          distinctReviewDays: Math.min(next.correctCount, 2),
        }),
        intervalDays: review.intervalIndex,
        repetitions: (current?.repetitions ?? 0) + 1,
        nextReviewAt: review.nextReviewAt,
      });
    }),
  );
  return wordIds.length;
}

function answersForWord(
  word: { sourceText: string; targetText: string },
  questions: Array<{ id: string; prompt: string; acceptedAnswers: string[] }>,
  answers: Array<{ questionId: string; isCorrect: boolean }>,
) {
  const related = new Set(
    questions
      .filter((question) => matchesWord(question, word))
      .map((question) => question.id),
  );
  return answers.filter((answer) => related.has(answer.questionId));
}

function matchesWord(
  question: { prompt: string; acceptedAnswers: string[] },
  word: { sourceText: string; targetText: string },
) {
  const haystack = [question.prompt, ...question.acceptedAnswers].join(" ").toLocaleLowerCase("und");
  return haystack.includes(word.sourceText.toLocaleLowerCase("und")) || haystack.includes(word.targetText.toLocaleLowerCase("und"));
}

function clampTime(value?: number) {
  if (value == null || Number.isNaN(value)) {
    return null;
  }
  return Math.max(0, Math.min(300_000, Math.round(value)));
}
