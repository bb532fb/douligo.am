import { redirect } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { withLocale } from "@/i18n/path";
import { COURSE_SLUGS, isCourseSlug } from "@/lib/constants/app";
import { requireUser } from "@/lib/auth/session";
import { courseService } from "@/server/services/course-service";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return COURSE_SLUGS.map((slug) => ({ slug }));
}

export default async function StartCoursePage({ params }: PageProps<"/[lang]/start/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || !isCourseSlug(slug)) {
    redirect(hasLocale(lang) ? withLocale(lang, "/courses") : "/");
  }

  const user = await requireUser();
  let selected;
  try {
    selected = await courseService.selectCourseBySlug(user.id, slug);
  } catch {
    redirect(withLocale(lang, "/courses"));
  }

  redirect(withLocale(lang, selected.needsPlacement ? "/onboarding/level" : "/learn"));
}
