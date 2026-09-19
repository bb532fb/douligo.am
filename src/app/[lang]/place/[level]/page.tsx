import { redirect } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { withLocale } from "@/i18n/path";
import { CEFR_LEVELS, isCefrLevel } from "@/lib/constants/app";
import { requireUser } from "@/lib/auth/session";
import { courseService } from "@/server/services/course-service";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return CEFR_LEVELS.map((level) => ({ level }));
}

export default async function PlaceLevelPage({ params }: PageProps<"/[lang]/place/[level]">) {
  const { lang, level } = await params;
  if (!hasLocale(lang) || !isCefrLevel(level)) {
    redirect(hasLocale(lang) ? withLocale(lang, "/onboarding/level") : "/");
  }

  const user = await requireUser();
  try {
    await courseService.setStartLevel(user.id, level);
  } catch {
    redirect(withLocale(lang, "/onboarding/level"));
  }

  redirect(withLocale(lang, "/learn"));
}
