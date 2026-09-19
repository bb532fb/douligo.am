import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { AdminUserControls } from "@/components/admin/admin-user-controls";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatAdminDate } from "@/lib/admin/format";
import type { Locale } from "@/i18n/config";
import { withLocale } from "@/i18n/path";
import type { Dictionary } from "@/i18n/types";
import type { AdminUserListItem } from "@/types/admin";

type AdminUserCardProps = {
  user: AdminUserListItem;
  locale: Locale;
  dict: Dictionary;
  currentUserId: string;
  heartsMax: number;
};

export function AdminUserCard({ user, locale, dict, currentUserId, heartsMax }: AdminUserCardProps) {
  const href = withLocale(locale, `/admin/users/${user.id}`);
  const lastSeen = user.lastActivityDate ? formatAdminDate(user.lastActivityDate, locale) : dict.admin.never;

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-start gap-3">
        <Avatar name={user.name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={href} className="text-lg font-black hover:text-teal">
              {user.name}
            </Link>
            <StatusBadge
              status={user.status}
              activeLabel={dict.admin.statusActive}
              suspendedLabel={dict.admin.statusSuspended}
            />
            {user.role === "ADMIN" ? <span className="text-xs font-extrabold text-teal">{dict.admin.roleAdmin}</span> : null}
          </div>
          <p className="truncate text-sm font-bold text-ink-soft">{user.email}</p>
        </div>
        <Link href={href} className="text-sm font-extrabold text-teal">
          {dict.admin.openProfile}
        </Link>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm font-bold sm:grid-cols-4">
        <MiniStat label={dict.admin.xp} value={user.totalXp} />
        <MiniStat label={dict.admin.streak} value={user.currentStreak} />
        <MiniStat label={dict.admin.lessons} value={user.lessonsCompleted} />
        <MiniStat label={dict.admin.lastSeen} value={lastSeen} />
      </dl>
      <AdminUserControls
        userId={user.id}
        status={user.status}
        hearts={user.hearts}
        heartsMax={heartsMax}
        isSelf={user.id === currentUserId}
        dict={dict}
      />
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-paper px-3 py-2">
      <dt className="text-xs font-extrabold uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="font-black">{value}</dd>
    </div>
  );
}
