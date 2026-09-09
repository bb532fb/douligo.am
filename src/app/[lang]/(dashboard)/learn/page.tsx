import { redirect } from "next/navigation";
import { CoursePath } from "@/components/learning/course-path";
import { LevelPicker } from "@/components/learning/level-picker";
import { StatsRow } from "@/components/layout/stats-row";
import { Mascot } from "@/components/brand/mascot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
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
import { progressRepository } from "@/server/repositories/progress-repository";

export default async function LearnPage({ params }: PageProps<"/[lang]/learn">) {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    redirect("/");
  }

  const user = await requireUser();
  const course = await courseService.requireActiveCourse(user.id);
  if (!course) {
    redirect(withLocale(lang, "/courses"));
  }

  const dict = await getDictionary(lang);
  const data = await loadLearnData(user.id, course.id, user.name, dict, course.slug, course.title);
  return <LearnView lang={lang} dict={dict} data={data} />;
}

async function loadLearnData(
  userId: string,
  courseId: string,
  userName: string | null | undefined,
  dict: Dictionary,
  slug: string,
  fallbackTitle: string,
) {
  const [path, totalXp, hearts, stats, progress] = await Promise.all([
    lessonService.getLearningPath(userId, courseId),
    gamificationService.totalXp(userId),
    gamificationService.syncHearts(userId),
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

  return {
    path,
    totalXp,
    hearts,
    streak: stats?.streak?.currentStreak ?? 0,
    current: path.flatMap((unit) => unit.lessons).find((lesson) => lesson.status === "current"),
    dailyTarget: stats?.profile?.dailyGoalXp ?? 50,
    dailyCurrent: stats?.dailyGoals[0]?.currentXP ?? 0,
    name: stats?.profile?.displayName ?? userName ?? "",
    courseTitle: dict.home.pairs[slug as keyof typeof dict.home.pairs] ?? fallbackTitle,
    startLevel: progress?.startLevel ?? "A1",
    levels: [...new Set(path.map((unit) => unit.level))],
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
      <div className="flex items-center gap-4">
        <Mascot size={88} mood="happy" />
        <div>
          <h1 className="text-3xl font-black">{interpolate(dict.learn.welcome, { name: data.name })} 👋</h1>
          <p className="mt-1 font-bold text-ink-soft">{data.courseTitle}</p>
        </div>
      </div>
      <StatsRow streak={data.streak} xp={data.totalXp} hearts={data.hearts} dict={dict} />
      <Card className="space-y-4 border-teal bg-teal text-white shadow-[0_8px_0_#1899d6]">
        <p className="text-lg font-black">{dict.learn.continueLearning}</p>
        <p className="font-semibold text-white/90">{data.current?.title ?? dict.learn.courseComplete}</p>
        {data.current ? (
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            href={withLocale(lang, `/lesson/${data.current.id}`)}
          >
            {dict.learn.continueLesson}
          </Button>
        ) : null}
        <ProgressBar
          label={dict.learn.dailyGoal}
          value={Math.round((data.dailyCurrent / data.dailyTarget) * 100)}
          className="[&_span]:text-white"
        />
      </Card>
      <LevelPicker levels={data.levels} selected={data.startLevel} dict={dict} />
      <CoursePath units={data.path} locale={lang} dict={dict} />
    </div>
  );
}
