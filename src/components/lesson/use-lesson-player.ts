import { useState } from "react";
import {
  completeLessonAction,
  startLessonAction,
  submitAnswerAction,
} from "@/server/actions/lesson-actions";
import type { AnswerPayload, PublicQuestion } from "@/types/learning";

export type LessonFeedback = {
  isCorrect: boolean;
  explanation: string | null;
  correctAnswer: string;
  hearts: number;
};

export type LessonResult = {
  score: number;
  xpAwarded: number;
  currentStreak?: number;
  wordsLearned: number;
};

export type LessonSession = {
  attemptId: string;
  resumeIndex: number;
  questions: PublicQuestion[];
};

export function useLessonPlayer(lessonId: string, initial?: LessonSession | null) {
  const [attemptId, setAttemptId] = useState<string | null>(initial?.attemptId ?? null);
  const [questions, setQuestions] = useState<PublicQuestion[]>(initial?.questions ?? []);
  const [index, setIndex] = useState(initial?.resumeIndex ?? 0);
  const [feedback, setFeedback] = useState<LessonFeedback | null>(null);
  const [result, setResult] = useState<LessonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const question = questions[index];
  const progress = questions.length === 0 ? 0 : Math.round((index / questions.length) * 100);
  const [startedAt, setStartedAt] = useState(() => Date.now());

  async function withBusy(work: () => Promise<void>) {
    setBusy(true);
    try {
      await work();
    } finally {
      setBusy(false);
    }
  }

  async function start() {
    setError(null);
    await withBusy(async () => {
      const response = await startLessonAction({ lessonId });
      if (!response.ok) {
        setError(response.message);
        return;
      }
      setAttemptId(response.data.attemptId);
      setQuestions(response.data.questions);
      setIndex(response.data.resumeIndex);
      setStartedAt(Date.now());
    });
  }

  async function onSubmit(answer: AnswerPayload) {
    if (!attemptId || !question || feedback || busy) {
      return;
    }
    await withBusy(async () => {
      const response = await submitAnswerAction({
        attemptId,
        questionId: question.id,
        answer,
        timeSpentMs: Date.now() - startedAt,
      });
      if (!response.ok) {
        setError(response.message);
        return;
      }
      setFeedback(response.data);
    });
  }

  async function onNext() {
    if (!attemptId) {
      return;
    }
    if (index + 1 < questions.length) {
      setIndex((value) => value + 1);
      setFeedback(null);
      setStartedAt(Date.now());
      return;
    }
    await withBusy(async () => {
      const response = await completeLessonAction({ attemptId });
      if (!response.ok) {
        setError(response.message);
        return;
      }
      setResult(response.data);
    });
  }

  return { question, progress, index, questions, feedback, result, error, busy, start, onSubmit, onNext };
}
