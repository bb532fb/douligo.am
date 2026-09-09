import { APP_ERRORS } from "@/lib/constants/copy";
import { AppError } from "@/lib/errors/app-error";
import { courseRepository } from "@/server/repositories/course-repository";

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
};
