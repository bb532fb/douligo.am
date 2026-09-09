import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { requireUser } from "@/lib/auth/session";
import { AppError } from "@/lib/errors/app-error";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { translateError } from "@/i18n/errors";
import { lessonService } from "@/server/services/lesson-service";
import type { LessonSession } from "@/components/lesson/use-lesson-player";

type LessonPageProps = PageProps<"/[lang]/lesson/[lessonId]">;

export default async function LessonPage({ params }: LessonPageProps) {
  const user = await requireUser();
  const { lang, lessonId } = await params;
  if (!hasLocale(lang)) {
    notFound();
  }

  const started = await startOrTranslate(user.id, lessonId, lang);
  if (!started) {
    notFound();
  }

  return (
    <LessonPlayer
      lessonId={started.lessonId}
      lessonTitle={started.lessonTitle}
      initial={started.initial}
      initialError={started.initialError}
    />
  );
}

async function startOrTranslate(userId: string, lessonId: string, lang: Locale) {
  try {
    const session = await lessonService.startLesson(userId, lessonId);
    const initial: LessonSession = {
      attemptId: session.attemptId,
      resumeIndex: session.resumeIndex,
      questions: session.questions,
    };
    return {
      lessonId: session.lesson.id,
      lessonTitle: session.lesson.title,
      initial,
      initialError: null,
    };
  } catch (error) {
    if (error instanceof AppError && error.code === "NOT_FOUND") {
      return null;
    }
    const dict = await getDictionary(lang);
    return {
      lessonId,
      lessonTitle: "",
      initial: null,
      initialError: translateError(error, dict),
    };
  }
}
