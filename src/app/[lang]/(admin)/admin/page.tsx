import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminHeartsMaxForm } from "@/components/admin/admin-hearts-max-form";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminActivityRow } from "@/components/admin/admin-activity-item";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { requireAdmin } from "@/lib/auth/session";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { withLocale } from "@/i18n/path";
import { adminService } from "@/server/services/admin-service";

export default async function AdminOverviewPage({ params }: PageProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    redirect("/");
  }

  await requireAdmin();
  const dict = await getDictionary(lang);
  const [stats, activity, heartsMax] = await Promise.all([
    adminService.getOverview(),
    adminService.listActivity(6),
    adminService.getHeartsMax(),
  ]);

  return (
    <div className="space-y-6">
      <AdminHeader title={dict.admin.title} lead={dict.admin.lead} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <AdminStatCard emoji="👥" label={dict.admin.totalUsers} value={stats.totalUsers} />
        <AdminStatCard emoji="🟢" label={dict.admin.activeToday} value={stats.activeToday} />
        <AdminStatCard emoji="✨" label={dict.admin.newThisWeek} value={stats.newThisWeek} />
        <AdminStatCard emoji="⛔" label={dict.admin.suspended} value={stats.suspended} />
        <AdminStatCard emoji="📚" label={dict.admin.lessonsToday} value={stats.lessonsToday} />
      </div>
      <AdminHeartsMaxForm heartsMax={heartsMax} dict={dict} />
      <div className="flex flex-wrap gap-3">
        <Button href={withLocale(lang, "/admin/users")}>{dict.nav.adminUsers}</Button>
        <Button variant="secondary" href={withLocale(lang, "/admin/activity")}>
          {dict.nav.adminActivity}
        </Button>
      </div>
      <section className="space-y-3">
        <h2 className="text-xl font-black">{dict.nav.adminActivity}</h2>
        {activity.length === 0 ? (
          <EmptyState title={dict.admin.noActivity} />
        ) : (
          <ul className="space-y-3">
            {activity.map((item) => (
              <li key={item.id}>
                <AdminActivityRow item={item} locale={lang} dict={dict} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
