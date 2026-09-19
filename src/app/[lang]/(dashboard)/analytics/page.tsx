import { redirect } from "next/navigation";
import { MasteryPanel } from "@/components/learning/mastery-panel";
import { Mascot } from "@/components/brand/mascot";
import { requireUser } from "@/lib/auth/session";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { withLocale } from "@/i18n/path";
import { courseService } from "@/server/services/course-service";
import { masteryDashboardService } from "@/server/services/mastery-dashboard-service";
import { progressRepository } from "@/server/repositories/progress-repository";

export default async function AnalyticsPage({ params }: PageProps<"/[lang]/analytics">) {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    redirect("/");
  }

  const user = await requireUser();
  const placement = await courseService.getActivePlacement(user.id);
  if (!placement) {
    redirect(withLocale(lang, "/courses"));
  }
  if (placement.needsPlacement) {
    redirect(withLocale(lang, "/onboarding/level"));
  }

  const dict = await getDictionary(lang);
  const progress = await progressRepository.getCourseProgress(user.id, placement.course.id);
  const mastery = await masteryDashboardService.getDashboard(
    user.id,
    placement.course.id,
    progress?.startLevel ?? "A1",
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot size={80} mood="wow" />
        <div>
          <h1 className="text-3xl font-black">{dict.mastery.pageTitle}</h1>
          <p className="mt-1 font-bold text-ink-soft">{dict.mastery.currentLevel}: {mastery.currentLevel}</p>
        </div>
      </div>
      <MasteryPanel data={mastery} dict={dict} locale={lang} />
    </div>
  );
}
