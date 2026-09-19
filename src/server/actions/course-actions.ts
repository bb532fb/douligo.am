"use server";

import { redirect } from "next/navigation";
import { getOptionalUser, requireUser } from "@/lib/auth/session";
import { loginUrlWithCallback } from "@/lib/auth/callback-url";
import { APP_ERRORS } from "@/lib/constants/copy";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getRequestLocale } from "@/i18n/request-locale";
import { translateError } from "@/i18n/errors";
import { withLocale } from "@/i18n/path";
import { selectCourseSlugSchema, selectStartLevelSchema } from "@/lib/validations/settings";
import { courseService } from "@/server/services/course-service";

export async function startCourseAction(formData: FormData) {
  const locale = await getRequestLocale();
  const parsed = selectCourseSlugSchema.safeParse({ slug: formData.get("slug") });
  if (!parsed.success) {
    redirect(withLocale(locale, "/"));
  }

  const user = await getOptionalUser();
  if (!user) {
    redirect(loginUrlWithCallback(locale, withLocale(locale, `/start/${parsed.data.slug}`)));
  }

  await redirectAfterCourseSelect(user.id, parsed.data.slug, locale);
}

async function redirectAfterCourseSelect(userId: string, slug: string, locale: Locale) {
  const dict = await getDictionary(locale);
  let selected;
  try {
    selected = await courseService.selectCourseBySlug(userId, slug);
  } catch (error) {
    throw new Error(translateError(error, dict));
  }
  redirect(withLocale(locale, selected.needsPlacement ? "/onboarding/level" : "/learn"));
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
