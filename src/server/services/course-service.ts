import { APP_ERRORS } from "@/lib/constants/copy";
import { AppError } from "@/lib/errors/app-error";
import { courseRepository } from "@/server/repositories/course-repository";
import { lessonRepository } from "@/server/repositories/lesson-repository";
import { progressRepository } from "@/server/repositories/progress-repository";

export const courseService = {
  listPublished() {
    return courseRepository.listPublished();
  },

  async requireActiveCourse(userId: string) {
    const enrollment = await courseRepository.getActiveEnrollment(userId);
    if (!enrollment) {
      return null;
    }
    return enrollment.course;
  },

  async selectCourse(userId: string, courseId: string) {
    const course = await courseRepository.findById(courseId);
    if (!course || !course.isPublished) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }

    await courseRepository.setActiveCourse(userId, courseId);
    return course;
  },

  async setStartLevel(userId: string, startLevel: string) {
    const course = await this.requireActiveCourse(userId);
    if (!course) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }

    const units = await lessonRepository.listCoursePath(course.id);
    const allowed = new Set(units.map((unit) => unit.level));
    if (!allowed.has(startLevel)) {
      throw new AppError("VALIDATION", APP_ERRORS.validation, 400);
    }

    await progressRepository.setStartLevel(userId, course.id, startLevel);
  },
};
