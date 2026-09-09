"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { APP_ERRORS } from "@/lib/constants/copy";
import { getDictionary } from "@/i18n/get-dictionary";
import { getRequestLocale } from "@/i18n/request-locale";
import { translateError } from "@/i18n/errors";
import { withLocale } from "@/i18n/path";
import { selectCourseSchema, selectStartLevelSchema } from "@/lib/validations/settings";
import { courseService } from "@/server/services/course-service";

export async function selectCourseAction(formData: FormData) {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);
  const user = await requireUser();
  const parsed = selectCourseSchema.safeParse({ courseId: formData.get("courseId") });
  if (!parsed.success) {
    throw new Error(dict.errors[APP_ERRORS.validation]);
  }

  try {
    await courseService.selectCourse(user.id, parsed.data.courseId);
  } catch (error) {
    throw new Error(translateError(error, dict));
  }

  redirect(withLocale(locale, "/learn"));
}

export async function setStartLevelAction(formData: FormData) {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);
  const user = await requireUser();
  const parsed = selectStartLevelSchema.safeParse({ startLevel: formData.get("startLevel") });
  if (!parsed.success) {
    throw new Error(dict.errors[APP_ERRORS.validation]);
  }

  try {
    await courseService.setStartLevel(user.id, parsed.data.startLevel);
  } catch (error) {
    throw new Error(translateError(error, dict));
  }

  redirect(withLocale(locale, "/learn"));
}
