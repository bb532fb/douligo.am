import { APP_ERRORS } from "@/lib/constants/copy";
import { AppError } from "@/lib/errors/app-error";
import { firstIndexForLevel, isLessonUnlocked } from "@/lib/learning/unlock";
import { attemptRepository } from "@/server/repositories/attempt-repository";

type UnlockRow = { id: string; kind?: string; unit: { level: string } };

export async function assertUnlocked(
  lessonId: string,
  ordered: UnlockRow[],
  completed: Array<{ lessonId: string }>,
  startLevel: string,
  accessibleLevels?: Set<string>,
) {
  const lesson = ordered.find((item) => item.id === lessonId);
  if (lesson?.kind === "REVIEW" && accessibleLevels?.has(lesson.unit.level)) {
    return;
  }
  if (lesson?.kind === "ASSESSMENT" && accessibleLevels?.has(lesson.unit.level)) {
    return;
  }
  const gated = ordered.map((item) => ({ id: item.id, level: item.unit.level, kind: item.kind }));
  const startIndex = firstIndexForLevel(gated, startLevel);
  const unlocked = isLessonUnlocked(
    gated,
    new Set(completed.map((item) => item.lessonId)),
    lessonId,
    startIndex,
    accessibleLevels,
  );
  if (!unlocked) {
    throw new AppError("LOCKED", APP_ERRORS.lessonLocked, 403);
  }
}

export async function resolveAttemptId(
  openId: string | undefined,
  userId: string,
  lessonId: string,
  questions: Array<{ id: string }>,
) {
  if (openId) {
    return openId;
  }
  const attempt = await attemptRepository.create({
    userId,
    lessonId,
    questionIds: questions.map((question) => question.id),
  });
  return attempt.id;
}

export function resumeIndexOf(questions: Array<{ id: string }>, answers: Array<{ questionId: string }>) {
  const answered = new Set(answers.map((item) => item.questionId));
  const index = questions.findIndex((question) => !answered.has(question.id));
  return index < 0 ? 0 : index;
}
