import { cefrIndex } from "@/lib/learning/mastery-config";

export type OrderedLesson = {
  id: string;
  level?: string;
  kind?: string;
};

export function firstIndexForLevel(lessons: OrderedLesson[], startLevel: string): number {
  const index = lessons.findIndex((lesson) => lesson.level === startLevel);
  return index < 0 ? 0 : index;
}

export function unitsFromStartLevel<T extends { level: string }>(units: T[], startLevel: string): T[] {
  return units.filter((unit) => cefrIndex(unit.level) >= cefrIndex(startLevel));
}

export function isLessonUnlocked(
  lessons: OrderedLesson[],
  completedIds: Set<string>,
  lessonId: string,
  startIndex = 0,
  accessibleLevels?: Set<string>,
): boolean {
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) {
    return false;
  }
  if (accessibleLevels && lesson.level && !accessibleLevels.has(lesson.level)) {
    return false;
  }

  const cohort = lessons.filter((item) => {
    if (item.kind && item.kind !== "STANDARD") {
      return false;
    }
    if (!accessibleLevels) {
      return true;
    }
    return !item.level || accessibleLevels.has(item.level);
  });
  const scoped = accessibleLevels && lesson.level ? cohort.filter((item) => item.level === lesson.level) : cohort;
  const index = scoped.findIndex((item) => item.id === lessonId);
  if (index < 0) {
    return lesson.kind === "ASSESSMENT" || lesson.kind === "REVIEW";
  }
  if (!accessibleLevels && index <= startIndex) {
    return true;
  }
  if (index === 0) {
    return true;
  }
  return completedIds.has(scoped[index - 1]?.id ?? "");
}

export function firstIncompleteLesson(
  lessons: OrderedLesson[],
  completedIds: Set<string>,
  startIndex = 0,
  studyingLevel?: string,
  accessibleLevels?: Set<string>,
): string | null {
  const standard = lessons.filter((item) => !item.kind || item.kind === "STANDARD");
  const pool = studyingLevel ? standard.filter((item) => item.level === studyingLevel) : standard.slice(startIndex);
  const current = pool.find((lesson) => !completedIds.has(lesson.id));
  if (current) {
    return current.id;
  }
  if (accessibleLevels) {
    const next = standard.find(
      (lesson) =>
        Boolean(lesson.level) &&
        accessibleLevels.has(lesson.level ?? "") &&
        lesson.level !== studyingLevel &&
        !completedIds.has(lesson.id),
    );
    if (next) {
      return next.id;
    }
  }
  return pool.at(-1)?.id ?? standard.at(-1)?.id ?? null;
}
