import { CACHE_TTL_SEC, rememberCatalog } from "@/lib/cache/remember";
import { prisma } from "@/lib/db/prisma";

const playInclude = {
  unit: { include: { course: { select: { sourceLanguage: true, targetLanguage: true, id: true } } } },
  questions: { include: { options: true, topic: true }, orderBy: { order: "asc" as const } },
} as const;

export const lessonRepository = {
  findById(lessonId: string) {
    return rememberCatalog(
      `lesson:${lessonId}`,
      () =>
        prisma.lesson.findUnique({
          where: { id: lessonId },
          include: {
            unit: { include: { course: true } },
            questions: { include: { options: true, topic: true }, orderBy: { order: "asc" } },
            vocabulary: { include: { vocabularyWord: true } },
          },
        }),
      CACHE_TTL_SEC.lesson,
    );
  },

  findForPlay(lessonId: string) {
    return rememberCatalog(
      `play:${lessonId}`,
      () =>
        prisma.lesson.findUnique({
          where: { id: lessonId },
          include: playInclude,
        }),
      CACHE_TTL_SEC.lesson,
    );
  },

  findQuestion(questionId: string) {
    return rememberCatalog(
      `question:${questionId}`,
      () =>
        prisma.question.findUnique({
          where: { id: questionId },
          include: {
            options: true,
            topic: true,
            lesson: { include: { unit: { include: { course: true } } } },
          },
        }),
      CACHE_TTL_SEC.lesson,
    );
  },

  listCourseLessons(courseId: string) {
    return rememberCatalog(`lessons:${courseId}`, () =>
      prisma.lesson.findMany({
        where: { unit: { courseId } },
        include: { unit: true },
        orderBy: [{ unit: { order: "asc" } }, { order: "asc" }],
      }),
    );
  },

  listUnlockOrder(courseId: string) {
    return rememberCatalog(`unlock:${courseId}`, () =>
      prisma.lesson.findMany({
        where: { unit: { courseId } },
        select: { id: true, kind: true, unit: { select: { level: true } } },
        orderBy: [{ unit: { order: "asc" } }, { order: "asc" }],
      }),
    );
  },

  listCoursePath(courseId: string) {
    return rememberCatalog(`path:${courseId}`, () =>
      prisma.unit.findMany({
        where: { courseId },
        include: { lessons: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      }),
    );
  },
};
