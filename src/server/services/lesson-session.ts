import { adaptiveLearningService } from "@/server/services/adaptive-learning-service";
import { assessmentService } from "@/server/services/assessment-service";
import { masteryRepository } from "@/server/repositories/mastery-repository";

type PlayQuestion = Awaited<ReturnType<typeof masteryRepository.listLevelQuestions>>[number];

type PlayLesson = {
  kind: "STANDARD" | "REVIEW" | "ASSESSMENT";
  unit: { courseId: string; level: string };
  questions: PlayQuestion[];
};

export async function questionsForLesson(userId: string, lesson: PlayLesson, savedIds?: string[]) {
  if (savedIds && savedIds.length > 0) {
    return hydrateSaved(lesson, savedIds);
  }
  if (lesson.kind === "ASSESSMENT") {
    return assessmentService.pickQuestions(lesson.unit.courseId, lesson.unit.level);
  }
  if (lesson.kind === "REVIEW") {
    return adaptiveLearningService.pickPracticeQuestions(userId, lesson.unit.courseId, lesson.unit.level);
  }
  return adaptiveLearningService.orderLessonQuestions(
    userId,
    lesson.unit.courseId,
    lesson.questions,
    lesson.unit.level,
  );
}

async function hydrateSaved(lesson: PlayLesson, savedIds: string[]) {
  const pool = lesson.kind === "STANDARD"
    ? lesson.questions
    : await masteryRepository.listLevelQuestions(lesson.unit.courseId, lesson.unit.level);
  const byId = new Map(pool.map((question) => [question.id, question]));
  return savedIds
    .map((id) => byId.get(id))
    .filter((question): question is PlayQuestion => Boolean(question));
}
