import Link from "next/link";
import { redirect } from "next/navigation";
import { CoursePath } from "@/components/learning/course-path";
import { LevelPicker } from "@/components/learning/level-picker";
import { StatsRow } from "@/components/layout/stats-row";
import { Mascot } from "@/components/brand/mascot";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/i18n/interpolate";
import { withLocale } from "@/i18n/path";
import type { Dictionary } from "@/i18n/types";
import { startOfUtcDay } from "@/lib/utils/date";
import { prisma } from "@/lib/db/prisma";
import { courseService } from "@/server/services/course-service";
import { gamificationService } from "@/server/services/gamification-service";
import { lessonService } from "@/server/services/lesson-service";
import { settingsService } from "@/server/services/settings-service";
import { masteryDashboardService } from "@/server/services/mastery-dashboard-service";
import { progressRepository } from "@/server/repositories/progress-repository";
import { levelUnlockService } from "@/server/services/level-unlock-service";

export default async function LearnPage({ params }: PageProps<"/[lang]/learn">) {
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
  const data = await loadLearnData(
    user.id,
    placement.course.id,
    user.name,
    dict,
    placement.course.slug,
    placement.course.title,
    placement.levels,
  );
  return <LearnView lang={lang} dict={dict} data={data} />;
}

async function loadLearnData(
  userId: string,
  courseId: string,
  userName: string | null | undefined,
  dict: Dictionary,
  slug: string,
  fallbackTitle: string,
  levels: string[],
) {
  const [path, totalXp, hearts, heartsMax, stats, progress] = await Promise.all([
    lessonService.getLearningPath(userId, courseId),
    gamificationService.totalXp(userId),
    gamificationService.syncHearts(userId),
    settingsService.getHeartsMax(),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        profile: { select: { displayName: true, dailyGoalXp: true } },
        streak: { select: { currentStreak: true } },
        dailyGoals: {
          where: { date: startOfUtcDay() },
          select: { currentXP: true },
          take: 1,
        },
      },
    }),
    progressRepository.getCourseProgress(userId, courseId),
  ]);
  const startLevel = progress?.startLevel ?? "A1";
  const [mastery, accessible] = await Promise.all([
    masteryDashboardService.getDashboard(userId, courseId, startLevel),
    levelUnlockService.accessibleLevels(userId, courseId, startLevel),
  ]);

  return {
    path,
    totalXp,
    hearts,
    heartsMax,
    streak: stats?.streak?.currentStreak ?? 0,
    current: path.flatMap((unit) => unit.lessons).find((lesson) => lesson.status === "current"),
    name: stats?.profile?.displayName ?? userName ?? "",
    courseTitle: dict.home.pairs[slug as keyof typeof dict.home.pairs] ?? fallbackTitle,
    currentLevel: mastery.currentLevel,
    startLevel,
    levels,
    lessonsCompleted: mastery.lessonsCompleted,
    lessonsTotal: mastery.lessonsTotal,
    accessibleLevels: [...accessible],
  };
}

function LearnView({
  lang,
  dict,
  data,
}: {
  lang: Locale;
  dict: Dictionary;
  data: Awaited<ReturnType<typeof loadLearnData>>;
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Mascot size={72} mood="happy" />
          <div>
            <p className="text-sm font-black tracking-[0.2em] text-ink-soft">{data.currentLevel}</p>
            <h1 className="text-3xl font-black">{interpolate(dict.learn.welcome, { name: data.name })}</h1>
            <p className="mt-1 font-bold text-ink-soft">
              {data.courseTitle} · {data.lessonsCompleted}/{data.lessonsTotal}
              {" · "}
              <Link href={withLocale(lang, "/courses")} className="text-teal hover:underline">
                {dict.learn.selectCourse}
              </Link>
            </p>
          </div>
        </div>
        <Button href={withLocale(lang, "/analytics")} variant="ghost" className="shrink-0">
          {dict.learn.viewAnalytics}
        </Button>
      </div>
      <StatsRow streak={data.streak} xp={data.totalXp} hearts={data.hearts} heartsMax={data.heartsMax} dict={dict} />
      <LevelPicker locale={lang} levels={data.levels} selected={data.startLevel} dict={dict} />
      {data.current ? (
        <Button className="w-full sm:w-auto" href={withLocale(lang, `/lesson/${data.current.id}`)}>
          {dict.learn.continueLesson}
        </Button>
      ) : null}
      <CoursePath units={data.path} locale={lang} dict={dict} accessibleLevels={data.accessibleLevels} />
    </div>
  );
}
