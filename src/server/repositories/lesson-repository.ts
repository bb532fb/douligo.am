import { prisma } from "@/lib/db/prisma";

const playInclude = {
  unit: { include: { course: { select: { sourceLanguage: true, targetLanguage: true } } } },
  questions: { include: { options: true }, orderBy: { order: "asc" as const } },
} as const;

export const lessonRepository = {
  findById(lessonId: string) {
    return prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        unit: { include: { course: true } },
        questions: { include: { options: true }, orderBy: { order: "asc" } },
        vocabulary: { include: { vocabularyWord: true } },
      },
    });
  },

  findForPlay(lessonId: string) {
    return prisma.lesson.findUnique({
      where: { id: lessonId },
      include: playInclude,
    });
  },

  findQuestion(questionId: string) {
    return prisma.question.findUnique({
      where: { id: questionId },
      include: { options: true },
    });
  },

  listCourseLessons(courseId: string) {
    return prisma.lesson.findMany({
      where: { unit: { courseId } },
      include: { unit: true },
      orderBy: [{ unit: { order: "asc" } }, { order: "asc" }],
    });
  },

  listUnlockOrder(courseId: string) {
    return prisma.lesson.findMany({
      where: { unit: { courseId } },
      select: { id: true, unit: { select: { level: true } } },
      orderBy: [{ unit: { order: "asc" } }, { order: "asc" }],
    });
  },

  listCoursePath(courseId: string) {
    return prisma.unit.findMany({
      where: { courseId },
      include: { lessons: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    });
  },
};
