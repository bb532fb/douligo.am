import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminActivityRow } from "@/components/admin/admin-activity-item";
import { EmptyState } from "@/components/ui/empty-state";
import { requireAdmin } from "@/lib/auth/session";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { adminService } from "@/server/services/admin-service";

export default async function AdminActivityPage({ params }: PageProps<"/[lang]/admin/activity">) {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    redirect("/");
  }

  await requireAdmin();
  const dict = await getDictionary(lang);
  const activity = await adminService.listActivity();

  return (
    <div className="space-y-6">
      <AdminHeader title={dict.nav.adminActivity} lead={dict.admin.activityLead} />
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
    </div>
  );
}
