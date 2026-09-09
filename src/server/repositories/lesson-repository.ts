import { prisma } from "@/lib/db/prisma";

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

  listCourseLessons(courseId: string) {
    return prisma.lesson.findMany({
      where: { unit: { courseId } },
      include: { unit: true },
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
