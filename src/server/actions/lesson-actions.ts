"use server";

import { requireUser } from "@/lib/auth/session";
import { APP_ERRORS } from "@/lib/constants/copy";
import { AppError } from "@/lib/errors/app-error";
import { getDictionary } from "@/i18n/get-dictionary";
import { getRequestLocale } from "@/i18n/request-locale";
import { translateError } from "@/i18n/errors";
import {
  completeLessonSchema,
  startLessonSchema,
  submitAnswerSchema,
} from "@/lib/validations/lesson";
import { lessonService } from "@/server/services/lesson-service";

export async function startLessonAction(input: unknown) {
  const dict = await getDictionary(await getRequestLocale());
  const user = await requireUser();
  const parsed = startLessonSchema.parse(input);
  try {
    return { ok: true as const, data: await lessonService.startLesson(user.id, parsed.lessonId) };
  } catch (error) {
    return { ok: false as const, message: translateError(error, dict) };
  }
}

export async function submitAnswerAction(input: unknown) {
  const dict = await getDictionary(await getRequestLocale());
  const user = await requireUser();
  const parsed = submitAnswerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: dict.errors[APP_ERRORS.validation] };
  }

  try {
    return {
      ok: true as const,
      data: await lessonService.submitAnswer(
        user.id,
        parsed.data.attemptId,
        parsed.data.questionId,
        parsed.data.answer,
      ),
    };
  } catch (error) {
    const message = translateError(error, dict);
    const status = error instanceof AppError ? error.status : 400;
    return { ok: false as const, message, status };
  }
}

export async function completeLessonAction(input: unknown) {
  const dict = await getDictionary(await getRequestLocale());
  const user = await requireUser();
  const parsed = completeLessonSchema.parse(input);
  try {
    return { ok: true as const, data: await lessonService.completeLesson(user.id, parsed.attemptId) };
  } catch (error) {
    return { ok: false as const, message: translateError(error, dict) };
  }
}
