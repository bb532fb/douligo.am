"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Mascot } from "@/components/brand/mascot";
import { CoachSpeech } from "@/components/voice/coach-speech";
import { SpeakButton } from "@/components/voice/speak-button";
import { useI18n } from "@/components/i18n/i18n-provider";
import { interpolate } from "@/i18n/interpolate";
import { withLocale } from "@/i18n/path";
import { speechLangFromCode, speechLangFromLocale } from "@/lib/voice/locale";
import { prefetchSpeech, primeSpeech } from "@/lib/voice/tts";
import type { AnswerPayload, PublicQuestion } from "@/types/learning";
import { QuestionPrompt } from "@/components/lesson/question-prompt";
import {
  useLessonPlayer,
  type LessonFeedback,
  type LessonResult,
  type LessonSession,
} from "@/components/lesson/use-lesson-player";

type LessonPlayerProps = {
  lessonId: string;
  lessonTitle: string;
  initial?: LessonSession | null;
  initialError?: string | null;
};

export function LessonPlayer({ lessonId, lessonTitle, initial, initialError }: LessonPlayerProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const player = useLessonPlayer(lessonId, initial);

  useEffect(() => {
    const current = player.question;
    if (!current) {
      return;
    }
    primeSpeech();
    const next = player.questions[player.index + 1];
    if (next) {
      prefetchSpeech(next.prompt, speechLangFromCode(next.sourceLanguage));
    }
  }, [player.index, player.question, player.questions]);

  const error = player.error ?? initialError ?? null;

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-2xl bg-rose-soft px-4 py-3 font-bold text-rose" role="alert">
          {error}
        </p>
      ) : null}
      {player.result ? (
        <ResultCard result={player.result} onContinue={() => router.push(withLocale(locale, "/learn"))} />
      ) : null}
      {!player.result && !player.question ? (
        <StartCard title={lessonTitle} busy={player.busy} onStart={player.start} />
      ) : null}
      {!player.result && player.question ? (
        <QuizBody
          progress={player.progress}
          index={player.index}
          total={player.questions.length}
          question={player.question}
          feedback={player.feedback}
          busy={player.busy}
          onSubmit={player.onSubmit}
          onNext={player.onNext}
        />
      ) : null}
    </div>
  );
}

function StartCard({ title, busy, onStart }: { title: string; busy: boolean; onStart: () => void }) {
  const { dict } = useI18n();
  return (
    <Card className="space-y-4 text-center">
      <div className="flex justify-center">
        <Mascot mood="wow" size={140} />
      </div>
      <h1 className="text-2xl font-black">{title}</h1>
      <p className="font-bold text-ink-soft">{dict.lesson.readyToPlay}</p>
      <Button
        onClick={() => {
          primeSpeech();
          onStart();
        }}
        loading={busy}
      >
        {dict.learn.startLesson} 🚀
      </Button>
    </Card>
  );
}

function ResultCard({ result, onContinue }: { result: LessonResult; onContinue: () => void }) {
  const { dict, locale } = useI18n();
  return (
    <Card className="space-y-4 border-brand bg-brand-soft text-center shadow-[0_8px_0_#46a302]">
      <CoachSpeech line={`${dict.common.greatJob}. ${dict.lesson.lessonComplete}`} lang={speechLangFromLocale(locale)} />
      <div className="flex justify-center">
        <Mascot mood="celebrate" size={160} />
      </div>
      <h1 className="text-3xl font-black">{dict.lesson.lessonComplete}</h1>
      <p className="text-lg font-extrabold">🎉 {dict.common.greatJob}</p>
      <p className="font-bold">{interpolate(dict.lesson.score, { score: result.score })}</p>
      <p className="font-black text-brand-dark">+{result.xpAwarded} XP</p>
      <p className="font-bold">
        🔥 {result.currentStreak ?? 1} {dict.learn.streak}
      </p>
      <p className="font-bold">💬 {interpolate(dict.lesson.wordsLearned, { count: result.wordsLearned })}</p>
      <Button onClick={onContinue}>{dict.learn.continueLearning}</Button>
    </Card>
  );
}

function QuizBody({
  progress,
  index,
  total,
  question,
  feedback,
  busy,
  onSubmit,
  onNext,
}: {
  progress: number;
  index: number;
  total: number;
  question: PublicQuestion;
  feedback: LessonFeedback | null;
  busy: boolean;
  onSubmit: (answer: AnswerPayload) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-4">
      <ProgressBar value={progress} label={`${index + 1}/${total}`} />
      <QuestionPrompt
        key={question.id}
        question={question}
        disabled={Boolean(feedback) || busy}
        onSubmit={onSubmit}
      />
      {feedback ? (
        <FeedbackCard
          feedback={feedback}
          answerLang={speechLangFromCode(question.targetLanguage)}
          isLast={index + 1 >= total}
          busy={busy}
          onNext={onNext}
        />
      ) : null}
    </div>
  );
}

function FeedbackCard({
  feedback,
  answerLang,
  isLast,
  busy,
  onNext,
}: {
  feedback: LessonFeedback;
  answerLang: ReturnType<typeof speechLangFromCode>;
  isLast: boolean;
  busy: boolean;
  onNext: () => void;
}) {
  const { dict, locale } = useI18n();
  const line = feedback.isCorrect ? dict.common.greatJob : dict.common.tryAgain;
  return (
    <Card className={feedback.isCorrect ? "border-brand bg-brand-soft" : "border-rose bg-rose-soft"}>
      <CoachSpeech
        line={line}
        lang={speechLangFromLocale(locale)}
        followUp={feedback.isCorrect ? undefined : { text: feedback.correctAnswer, lang: answerLang }}
      />
      <div className="mb-3 flex items-center gap-3">
        <Mascot mood={feedback.isCorrect ? "celebrate" : "sad"} size={64} />
        <p className="text-xl font-black">
          {feedback.isCorrect ? `✅ ${dict.common.correct}` : `😅 ${dict.common.tryAgain}`}
        </p>
      </div>
      {!feedback.isCorrect ? (
        <div className="flex items-center gap-3">
          <SpeakButton text={feedback.correctAnswer} lang={answerLang} size="sm" />
          <p className="font-bold">{interpolate(dict.lesson.correctAnswer, { answer: feedback.correctAnswer })}</p>
        </div>
      ) : null}
      {feedback.explanation ? <p className="mt-2 font-semibold text-ink-soft">{feedback.explanation}</p> : null}
      <Button
        className="mt-4 w-full"
        variant={feedback.isCorrect ? "primary" : "danger"}
        onClick={onNext}
        loading={busy}
      >
        {isLast ? dict.common.continue : dict.common.next}
      </Button>
    </Card>
  );
}
