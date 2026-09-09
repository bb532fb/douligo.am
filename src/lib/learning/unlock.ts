export type OrderedLesson = {
  id: string;
  level?: string;
};

export function firstIndexForLevel(lessons: OrderedLesson[], startLevel: string): number {
  const index = lessons.findIndex((lesson) => lesson.level === startLevel);
  return index < 0 ? 0 : index;
}

export function isLessonUnlocked(
  lessons: OrderedLesson[],
  completedIds: Set<string>,
  lessonId: string,
  startIndex = 0,
): boolean {
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) {
    return false;
  }
  if (index <= startIndex) {
    return true;
  }

  return completedIds.has(lessons[index - 1]?.id ?? "");
}

export function firstIncompleteLesson(
  lessons: OrderedLesson[],
  completedIds: Set<string>,
  startIndex = 0,
): string | null {
  const current = lessons.slice(startIndex).find((lesson) => !completedIds.has(lesson.id));
  return current?.id ?? lessons.at(-1)?.id ?? null;
}
