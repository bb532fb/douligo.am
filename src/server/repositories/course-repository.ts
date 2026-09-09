import { rememberCatalog } from "@/lib/cache/remember";
import { prisma } from "@/lib/db/prisma";

export const courseRepository = {
  listPublished() {
    return rememberCatalog("courses:published", () =>
      prisma.course.findMany({
        where: { isPublished: true },
        orderBy: { slug: "asc" },
      }),
    );
  },

  findById(id: string) {
    return rememberCatalog(`course:${id}`, () => prisma.course.findUnique({ where: { id } }));
  },

  findBySlug(slug: string) {
    return prisma.course.findUnique({ where: { slug } });
  },

  getActiveEnrollment(userId: string) {
    return prisma.userCourseEnrollment.findFirst({
      where: { userId, isActive: true },
      include: { course: true },
    });
  },

  listEnrollments(userId: string) {
    return prisma.userCourseEnrollment.findMany({
      where: { userId },
      include: { course: true },
    });
  },

  async setActiveCourse(userId: string, courseId: string) {
    await prisma.$transaction([
      prisma.userCourseEnrollment.updateMany({
        where: { userId },
        data: { isActive: false },
      }),
      prisma.userCourseEnrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: { isActive: true },
        create: { userId, courseId, isActive: true },
      }),
      prisma.userProgress.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: {},
        create: { userId, courseId },
      }),
    ]);
  },
};
