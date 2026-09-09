import Link from "next/link";
import { redirect } from "next/navigation";
import { CoursePath } from "@/components/learning/course-path";
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
  const [path, totalXp, hearts, streak, goal, profile] = await Promise.all([
    lessonService.getLearningPath(userId, courseId),
    gamificationService.totalXp(userId),
    gamificationService.syncHearts(userId),
    prisma.userStreak.findUnique({ where: { userId } }),
    prisma.dailyGoal.findUnique({
      where: { userId_date: { userId, date: startOfUtcDay() } },
    }),
    prisma.profile.findUnique({ where: { userId } }),
  ]);

  return {
    path,
    totalXp,
    hearts,
    streak: streak?.currentStreak ?? 0,
    current: path.flatMap((unit) => unit.lessons).find((lesson) => lesson.status === "current"),
    dailyTarget: profile?.dailyGoalXp ?? 50,
    dailyCurrent: goal?.currentXP ?? 0,
    name: profile?.displayName ?? userName ?? "",
    courseTitle: dict.home.pairs[slug as keyof typeof dict.home.pairs] ?? fallbackTitle,
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
          <Link href={withLocale(lang, `/lesson/${data.current.id}`)}>
            <Button variant="secondary" className="w-full sm:w-auto">
              {dict.learn.continueLesson}
            </Button>
          </Link>
        ) : null}
        <ProgressBar
          label={dict.learn.dailyGoal}
          value={Math.round((data.dailyCurrent / data.dailyTarget) * 100)}
          className="[&_span]:text-white"
        />
      </Card>
      <CoursePath units={data.path} locale={lang} dict={dict} />
    </div>
  );
}
