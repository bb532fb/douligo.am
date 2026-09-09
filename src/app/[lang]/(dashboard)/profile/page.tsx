import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Mascot } from "@/components/brand/mascot";
import { requireUser } from "@/lib/auth/session";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/i18n/interpolate";
import { withLocale } from "@/i18n/path";
import { logoutAction } from "@/server/actions/auth-actions";
import { courseService } from "@/server/services/course-service";
import { profileService } from "@/server/services/profile-service";

export default async function ProfilePage({ params }: PageProps<"/[lang]/profile">) {
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
  const profile = await profileService.getOverview(user.id, course.id);

  return (
    <div className="space-y-6">
      <Card className="flex items-center gap-4 bg-brand-soft border-brand">
        <Avatar name={profile.name} />
        <div className="flex-1">
          <h1 className="text-2xl font-black">{profile.name}</h1>
          <p className="font-bold text-brand-dark">⭐ {interpolate(dict.profile.level, { level: profile.level })}</p>
        </div>
        <Mascot size={72} mood="celebrate" />
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <StatCard emoji="⚡" label="XP" value={profile.totalXp} />
        <StatCard emoji="🔥" label={dict.learn.streak} value={profile.currentStreak} />
        <StatCard emoji="🏆" label={dict.profile.longestStreak} value={profile.longestStreak} />
        <StatCard emoji="📚" label={dict.profile.lessons} value={profile.lessonsCompleted} />
        <StatCard emoji="💬" label={dict.profile.words} value={profile.wordsLearned} />
        <StatCard emoji="🎯" label={dict.profile.accuracy} value={`${profile.accuracy}%`} />
      </div>
      <section className="space-y-3">
        <h2 className="text-xl font-black">{dict.profile.achievements}</h2>
        {profile.achievements.length === 0 ? (
          <EmptyState title={dict.profile.emptyAchievements} />
        ) : (
          <ul className="flex flex-wrap gap-2">
            {profile.achievements.map((item) => (
              <li key={item.id}>
                <Badge>🏅 {item.name}</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
      <div className="flex flex-wrap gap-3">
        <Link href={withLocale(lang, "/settings")}>
          <Button variant="secondary">{dict.profile.settings}</Button>
        </Link>
        <Link href={withLocale(lang, "/courses")}>
          <Button variant="secondary">{dict.profile.activeCourse}</Button>
        </Link>
        <form action={logoutAction}>
          <Button variant="danger" type="submit">
            {dict.auth.logout}
          </Button>
        </form>
      </div>
    </div>
  );
}

function StatCard({ emoji, label, value }: { emoji: string; label: string; value: string | number }) {
  return (
    <Card>
      <p className="text-sm font-bold text-ink-soft">
        {emoji} {label}
      </p>
      <p className="text-2xl font-black">{value}</p>
    </Card>
  );
}
