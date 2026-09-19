import Link from "next/link";
import { Card } from "@/components/ui/card";
import { formatAdminDateTime } from "@/lib/admin/format";
import type { Locale } from "@/i18n/config";
import { withLocale } from "@/i18n/path";
import type { Dictionary } from "@/i18n/types";
import type { AdminActivityItem } from "@/types/admin";

type AdminActivityRowProps = {
  item: AdminActivityItem;
  locale: Locale;
  dict: Dictionary;
};

export function AdminActivityRow({ item, locale, dict }: AdminActivityRowProps) {
  const href = withLocale(locale, `/admin/users/${item.userId}`);
  const label = item.kind === "signup" ? dict.admin.signup : dict.admin.lessonDone;
  const emoji = item.kind === "signup" ? "👋" : "✅";

  return (
    <Card className="flex items-start gap-3">
      <span className="text-2xl" aria-hidden="true">
        {emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-extrabold">
          <Link href={href} className="hover:text-teal">
            {item.userName}
          </Link>{" "}
          <span className="text-ink-soft">{label}</span>
        </p>
        <p className="truncate font-semibold text-ink-soft">{item.title}</p>
        <p className="text-sm font-bold text-ink-soft">{formatAdminDateTime(item.at, locale)}</p>
      </div>
    </Card>
  );
}
