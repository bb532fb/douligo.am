import { getOptionalUser } from "@/lib/auth/session";
import { courseService } from "@/server/services/course-service";
import { masteryDashboardService } from "@/server/services/mastery-dashboard-service";
import { progressRepository } from "@/server/repositories/progress-repository";
import { reviewService } from "@/server/services/review-service";
import { adaptiveLearningService } from "@/server/services/adaptive-learning-service";
import { lessonService } from "@/server/services/lesson-service";
import { submitAnswerSchema } from "@/lib/validations/lesson";
import { learningLevelSchema } from "@/lib/validations/learning";
import { assessmentRepository } from "@/server/repositories/assessment-repository";

export async function learningContext() {
  const user = await getOptionalUser();
  if (!user) {
    return null;
  }
  const course = await courseService.requireActiveCourse(user.id);
  if (!course) {
    return null;
  }
  const progress = await progressRepository.getCourseProgress(user.id, course.id);
  return { userId: user.id, courseId: course.id, startLevel: progress?.startLevel ?? "A1" };
}

export async function jsonDashboard() {
  const ctx = await learningContext();
  if (!ctx) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const data = await masteryDashboardService.getDashboard(ctx.userId, ctx.courseId, ctx.startLevel);
  return Response.json(data);
}

export async function jsonReview() {
  const ctx = await learningContext();
  if (!ctx) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const items = await reviewService.getReviewQueue(ctx.userId, ctx.courseId);
  return Response.json({ items: items.map((item) => ({ id: item.id, questionId: item.questionId, nextReviewAt: item.nextReviewAt })) });
}

export async function jsonNextExercise() {
  const ctx = await learningContext();
  if (!ctx) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const dashboard = await masteryDashboardService.getDashboard(ctx.userId, ctx.courseId, ctx.startLevel);
  const questions = await adaptiveLearningService.pickPracticeQuestions(ctx.userId, ctx.courseId, dashboard.currentLevel, 1);
  return Response.json({ questionId: questions[0]?.id ?? null });
}

export async function postAttempt(request: Request) {
  const ctx = await learningContext();
  if (!ctx) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const body: unknown = await request.json();
  const parsed = submitAnswerSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "validation" }, { status: 400 });
  }
  const data = await lessonService.submitAnswer(
    ctx.userId,
    parsed.data.attemptId,
    parsed.data.questionId,
    parsed.data.answer,
    parsed.data.timeSpentMs,
  );
  return Response.json(data);
}

export async function postAssessment(request: Request) {
  const ctx = await learningContext();
  if (!ctx) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const body: unknown = await request.json().catch(() => ({}));
  const parsed = learningLevelSchema.safeParse(body);
  const dashboard = await masteryDashboardService.getDashboard(ctx.userId, ctx.courseId, ctx.startLevel);
  const level = parsed.success ? parsed.data.level : dashboard.currentLevel;
  const lesson = await assessmentRepository.findSpecialLesson(ctx.courseId, level, "ASSESSMENT");
  if (!lesson || !dashboard.assessmentAvailable) {
    return Response.json({ error: "locked" }, { status: 403 });
  }
  return Response.json({ lessonId: lesson.id });
}
