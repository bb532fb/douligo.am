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

export function useLessonPlayer(lessonId: string) {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<LessonFeedback | null>(null);
  const [result, setResult] = useState<LessonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const question = questions[index];
  const progress = questions.length === 0 ? 0 : Math.round((index / questions.length) * 100);

  async function start() {
    setBusy(true);
    setError(null);
    const response = await startLessonAction({ lessonId });
    setBusy(false);
    if (!response.ok) {
      setError(response.message);
      return;
    }
    setAttemptId(response.data.attemptId);
    setQuestions(response.data.questions);
  }

  async function onSubmit(answer: AnswerPayload) {
    if (!attemptId || !question || feedback || busy) {
      return;
    }
    setBusy(true);
    const response = await submitAnswerAction({ attemptId, questionId: question.id, answer });
    setBusy(false);
    if (!response.ok) {
      setError(response.message);
      return;
    }
    setFeedback(response.data);
  }

  async function onNext() {
    if (!attemptId) {
      return;
    }
    if (index + 1 < questions.length) {
      setIndex((value) => value + 1);
      setFeedback(null);
      return;
    }
    setBusy(true);
    const response = await completeLessonAction({ attemptId });
    setBusy(false);
    if (!response.ok) {
      setError(response.message);
      return;
    }
    setResult(response.data);
  }

  return { question, progress, index, questions, feedback, result, error, busy, start, onSubmit, onNext };
}
