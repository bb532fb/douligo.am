export type OrderedLesson = {
  id: string;
};

export function isLessonUnlocked(lessons: OrderedLesson[], completedIds: Set<string>, lessonId: string): boolean {
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index <= 0) {
    return index === 0;
  }

  return completedIds.has(lessons[index - 1].id);
}

export function firstIncompleteLesson(lessons: OrderedLesson[], completedIds: Set<string>): string | null {
  const current = lessons.find((lesson) => !completedIds.has(lesson.id));
  return current?.id ?? lessons.at(-1)?.id ?? null;
}
