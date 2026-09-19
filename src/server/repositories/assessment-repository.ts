import type { DbClient } from "@/lib/db/client";
import { prisma } from "@/lib/db/prisma";

export const assessmentRepository = {
  latest(userId: string, courseId: string, levelKey: string) {
    return prisma.assessmentAttempt.findFirst({
      where: { userId, courseId, levelKey },
      orderBy: { createdAt: "desc" },
    });
  },

  create(
    input: {
      userId: string;
      courseId: string;
      levelKey: string;
      lessonId?: string | null;
      attemptId?: string | null;
      score: number;
      passed: boolean;
      questionIds: string[];
    },
    db: DbClient = prisma,
  ) {
    return db.assessmentAttempt.create({ data: input });
  },

  findSpecialLesson(courseId: string, levelKey: string, kind: "ASSESSMENT" | "REVIEW") {
    return prisma.lesson.findFirst({
      where: {
        kind,
        unit: kind === "REVIEW" ? { courseId } : { courseId, level: levelKey },
      },
      include: { unit: true },
      orderBy: { order: "asc" },
    });
  },
};
