"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getRequestLocale } from "@/i18n/request-locale";
import { withLocale } from "@/i18n/path";
import { APP_ERRORS } from "@/lib/constants/copy";
import { AppError } from "@/lib/errors/app-error";
import { getDictionary } from "@/i18n/get-dictionary";
import { translateError } from "@/i18n/errors";
import { learningLevelSchema } from "@/lib/validations/learning";
import { courseService } from "@/server/services/course-service";
import { assessmentRepository } from "@/server/repositories/assessment-repository";
import { masteryDashboardService } from "@/server/services/mastery-dashboard-service";
import { progressRepository } from "@/server/repositories/progress-repository";

export async function getLearningProgressAction() {
  return loadDashboard();
}

export async function getMasteryAction() {
  return loadDashboard();
}

export async function getLevelStatusAction() {
  return loadDashboard();
}

export async function startReviewAction() {
  await startSpecial("REVIEW");
}

export async function startWeakPracticeAction() {
  await startSpecial("REVIEW");
}

export async function startAssessmentAction(formData: FormData) {
  const parsed = learningLevelSchema.safeParse({ level: formData.get("level") });
  if (!parsed.success) {
    const dict = await getDictionary(await getRequestLocale());
    throw new Error(dict.errors[APP_ERRORS.validation]);
  }
  await startSpecial("ASSESSMENT", parsed.data.level);
}

async function loadDashboard() {
  const dict = await getDictionary(await getRequestLocale());
  try {
    const ctx = await requireCourse();
    const data = await masteryDashboardService.getDashboard(ctx.userId, ctx.courseId, ctx.startLevel);
    return { ok: true as const, data };
  } catch (error) {
    return { ok: false as const, message: translateError(error, dict) };
  }
}

async function startSpecial(kind: "REVIEW" | "ASSESSMENT", level?: string) {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);
  try {
    const ctx = await requireCourse();
    const dashboard = await masteryDashboardService.getDashboard(ctx.userId, ctx.courseId, ctx.startLevel);
    const lessonId =
      kind === "ASSESSMENT"
        ? dashboard.assessmentLessonId
        : dashboard.reviewLessonId;
    const lesson = lessonId
      ? { id: lessonId }
      : await assessmentRepository.findSpecialLesson(ctx.courseId, level ?? dashboard.currentLevel, kind);
    if (!lesson) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }
    if (kind === "ASSESSMENT" && !dashboard.assessmentAvailable) {
      throw new AppError("LOCKED", APP_ERRORS.lessonLocked, 403);
    }
    redirect(withLocale(locale, `/lesson/${lesson.id}`));
  } catch (error) {
    if (error instanceof AppError) {
      throw new Error(translateError(error, dict));
    }
    throw error;
  }
}

async function requireCourse() {
  const user = await requireUser();
  const course = await courseService.requireActiveCourse(user.id);
  if (!course) {
    throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
  }
  const progress = await progressRepository.getCourseProgress(user.id, course.id);
  return { userId: user.id, courseId: course.id, startLevel: progress?.startLevel ?? "A1" };
}
