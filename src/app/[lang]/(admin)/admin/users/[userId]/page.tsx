import { notFound, redirect } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminUserControls } from "@/components/admin/admin-user-controls";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatAdminDate, formatAdminDateTime } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/auth/session";
import { AppError } from "@/lib/errors/app-error";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/i18n/interpolate";
import { withLocale } from "@/i18n/path";
import { adminService } from "@/server/services/admin-service";
import type { Dictionary } from "@/i18n/types";
import type { AdminUserDetail } from "@/types/admin";

export default async function AdminUserDetailPage({
  params,
}: PageProps<"/[lang]/admin/users/[userId]">) {
  const { lang, userId } = await params;
  if (!hasLocale(lang)) {
    redirect("/");
  }

  const admin = await requireAdmin();
  const dict = await getDictionary(lang);
  const [user, heartsMax] = await Promise.all([loadUser(userId), adminService.getHeartsMax()]);
  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" href={withLocale(lang, "/admin/users")}>
        ← {dict.admin.backToUsers}
      </Button>
      <UserHero user={user} locale={lang} dict={dict} />
      <AdminUserControls
        userId={user.id}
        status={user.status}
        hearts={user.hearts}
        heartsMax={heartsMax}
        isSelf={user.id === admin.id}
        dict={dict}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat emoji="⚡" label={dict.admin.xp} value={user.totalXp} />
        <Stat emoji="🔥" label={dict.admin.streak} value={user.currentStreak} />
        <Stat emoji="🏆" label={dict.profile.longestStreak} value={user.longestStreak} />
        <Stat emoji="📚" label={dict.admin.lessons} value={user.lessonsCompleted} />
        <Stat emoji="💬" label={dict.admin.words} value={user.wordsLearned} />
        <Stat emoji="🎯" label={dict.admin.accuracy} value={`${user.accuracy}%`} />
      </div>
      <CoursesBlock courses={user.courses} dict={dict} />
      <LessonsBlock lessons={user.recentLessons} locale={lang} dict={dict} />
      <AnswersBlock answers={user.recentAnswers} locale={lang} dict={dict} />
    </div>
  );
}

async function loadUser(userId: string) {
  try {
    return await adminService.getUser(userId);
  } catch (error) {
    if (error instanceof AppError && error.code === "NOT_FOUND") {
      return null;
    }
    throw error;
  }
}

function UserHero({
  user,
  locale,
  dict,
}: {
  user: AdminUserDetail;
  locale: Parameters<typeof formatAdminDate>[1];
  dict: Dictionary;
}) {
  const lastSeen = user.lastActivityDate ? formatAdminDate(user.lastActivityDate, locale) : dict.admin.never;
  return (
    <Card className="flex flex-wrap items-center gap-4 border-brand bg-brand-soft">
      <Avatar name={user.name} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-black">{user.name}</h1>
          <StatusBadge
            status={user.status}
            activeLabel={dict.admin.statusActive}
            suspendedLabel={dict.admin.statusSuspended}
          />
        </div>
        <p className="font-bold text-ink-soft">{user.email}</p>
        <p className="text-sm font-bold text-ink-soft">
          {user.role === "ADMIN" ? dict.admin.roleAdmin : dict.admin.roleUser} · {dict.admin.joined}{" "}
          {formatAdminDate(user.createdAt, locale)} · {dict.admin.lastSeen} {lastSeen}
        </p>
        <p className="font-bold text-brand-dark">{interpolate(dict.profile.level, { level: user.level })}</p>
      </div>
    </Card>
  );
}

function Stat({ emoji, label, value }: { emoji: string; label: string; value: string | number }) {
  return (
    <Card>
      <p className="text-sm font-bold text-ink-soft">
        {emoji} {label}
      </p>
      <p className="text-2xl font-black">{value}</p>
    </Card>
  );
}

function CoursesBlock({ courses, dict }: { courses: AdminUserDetail["courses"]; dict: Dictionary }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-black">{dict.admin.courses}</h2>
      {courses.length === 0 ? (
        <EmptyState title={dict.admin.emptyCourses} />
      ) : (
        <ul className="space-y-2">
          {courses.map((course) => (
            <li key={course.id}>
              <Card className="flex items-center justify-between gap-3">
                <p className="font-extrabold">{course.title}</p>
                {course.isActive ? <span className="text-sm font-extrabold text-teal">{dict.admin.activeCourse}</span> : null}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function LessonsBlock({
  lessons,
  locale,
  dict,
}: {
  lessons: AdminUserDetail["recentLessons"];
  locale: Parameters<typeof formatAdminDateTime>[1];
  dict: Dictionary;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-black">{dict.admin.recentLessons}</h2>
      {lessons.length === 0 ? (
        <EmptyState title={dict.admin.noLessons} />
      ) : (
        <ul className="space-y-2">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Card className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-extrabold">{lesson.title}</p>
                  <p className="text-sm font-bold text-ink-soft">{formatAdminDateTime(lesson.completedAt, locale)}</p>
                </div>
                <p className="font-black text-brand-dark">{lesson.score}%</p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function AnswersBlock({
  answers,
  locale,
  dict,
}: {
  answers: AdminUserDetail["recentAnswers"];
  locale: Parameters<typeof formatAdminDateTime>[1];
  dict: Dictionary;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-black">{dict.admin.recentAnswers}</h2>
      {answers.length === 0 ? (
        <EmptyState title={dict.admin.noAnswers} />
      ) : (
        <ul className="space-y-2">
          {answers.map((answer) => (
            <li key={answer.id}>
              <Card>
                <p className="font-extrabold">{answer.prompt}</p>
                <p className="text-sm font-bold text-ink-soft">
                  {answer.isCorrect ? dict.common.correct : dict.common.incorrect} ·{" "}
                  {formatAdminDateTime(answer.createdAt, locale)}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
