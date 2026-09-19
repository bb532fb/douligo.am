import { APP_ERRORS } from "@/lib/constants/copy";
import { AppError } from "@/lib/errors/app-error";
import { courseRepository } from "@/server/repositories/course-repository";
import { lessonRepository } from "@/server/repositories/lesson-repository";
import { masteryRepository } from "@/server/repositories/mastery-repository";
import { progressRepository } from "@/server/repositories/progress-repository";
import { levelUnlockService } from "@/server/services/level-unlock-service";

export const courseService = {
  listPublished() {
    return courseRepository.listPublished();
  },

  async requireActiveCourse(userId: string) {
    const active = await courseRepository.getActiveEnrollment(userId);
    if (active) {
      return active.course;
    }

    const latest = await courseRepository.getLatestEnrollment(userId);
    if (!latest) {
      return null;
    }

    await courseRepository.setActiveCourse(userId, latest.courseId);
    return latest.course;
  },

  async getActivePlacement(userId: string) {
    const course = await this.requireActiveCourse(userId);
    if (!course) {
      return null;
    }

    const [masteries, units] = await Promise.all([
      masteryRepository.listLevelMasteries(userId, course.id),
      lessonRepository.listCoursePath(course.id),
    ]);
    return {
      course,
      levels: [...new Set(units.map((unit) => unit.level))],
      needsPlacement: masteries.length === 0,
    };
  },

  async selectCourse(userId: string, courseId: string) {
    const course = await courseRepository.findById(courseId);
    if (!course || !course.isPublished) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }

    await courseRepository.setActiveCourse(userId, courseId);
    const masteries = await masteryRepository.listLevelMasteries(userId, courseId);
    return { course, needsPlacement: masteries.length === 0 };
  },

  async selectCourseBySlug(userId: string, slug: string) {
    const course = await courseRepository.findBySlug(slug);
    if (!course) {
      throw new AppError("NOT_FOUND", APP_ERRORS.notFound, 404);
    }
    return this.selectCourse(userId, course.id);
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
    await levelUnlockService.resetPlacement(userId, course.id, startLevel);
  },
};
