"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, Users } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { withLocale } from "@/i18n/path";
import { cn } from "@/lib/utils/cn";

const ITEMS = [
  { path: "/admin", key: "overview" as const, icon: LayoutDashboard },
  { path: "/admin/users", key: "users" as const, icon: Users },
  { path: "/admin/activity", key: "activity" as const, icon: Activity },
];

export function AdminSubnav() {
  const pathname = usePathname();
  const { locale, dict } = useI18n();
  const labels = {
    overview: dict.nav.adminOverview,
    users: dict.nav.adminUsers,
    activity: dict.nav.adminActivity,
  };

  return (
    <nav aria-label={dict.nav.adminSection} className="flex flex-wrap gap-2">
      {ITEMS.map((item) => {
        const href = withLocale(locale, item.path);
        const active = item.path === "/admin" ? pathname === href : pathname.startsWith(href);
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl border-2 px-4 py-2 text-sm font-extrabold",
              active ? "border-brand bg-brand-soft text-brand-dark" : "border-line bg-paper-raised text-ink-soft hover:bg-paper",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {labels[item.key]}
          </Link>
        );
      })}
    </nav>
  );
}
