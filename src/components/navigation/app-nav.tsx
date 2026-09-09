"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Library, Trophy, UserRound, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { useI18n } from "@/components/i18n/i18n-provider";
import type { Locale } from "@/i18n/config";
import { withLocale } from "@/i18n/path";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/utils/cn";

const ITEMS: {
  path: "/learn" | "/vocabulary" | "/leaderboard" | "/profile";
  key: "learn" | "vocabulary" | "leaderboard" | "profile";
  icon: LucideIcon;
  active: string;
  iconColor: string;
}[] = [
  { path: "/learn", key: "learn", icon: BookOpen, active: "bg-brand-soft text-brand-dark", iconColor: "text-brand" },
  { path: "/vocabulary", key: "vocabulary", icon: Library, active: "bg-violet-soft text-violet-dark", iconColor: "text-violet" },
  { path: "/leaderboard", key: "leaderboard", icon: Trophy, active: "bg-gold-soft text-clay-dark", iconColor: "text-gold-dark" },
  { path: "/profile", key: "profile", icon: UserRound, active: "bg-teal-soft text-teal-dark", iconColor: "text-teal" },
];

export function AppNav() {
  const pathname = usePathname();
  const { locale, dict } = useI18n();

  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r-2 lg:border-line lg:bg-paper-raised lg:px-5 lg:py-8">
        <Link href={withLocale(locale, "/learn")} prefetch className="mb-10">
          <Logo />
        </Link>
        <DesktopNav pathname={pathname} locale={locale} dict={dict} />
        <div className="mt-auto pt-6">
          <LocaleSwitcher />
        </div>
      </aside>
      <MobileNav pathname={pathname} locale={locale} dict={dict} />
    </>
  );
}

function DesktopNav({ pathname, locale, dict }: { pathname: string; locale: Locale; dict: Dictionary }) {
  return (
    <nav aria-label={dict.nav.main} className="space-y-2">
      {ITEMS.map((item) => (
        <DesktopItem key={item.path} item={item} pathname={pathname} locale={locale} dict={dict} />
      ))}
    </nav>
  );
}

function DesktopItem({
  item,
  pathname,
  locale,
  dict,
}: {
  item: (typeof ITEMS)[number];
  pathname: string;
  locale: Locale;
  dict: Dictionary;
}) {
  const href = withLocale(locale, item.path);
  const active = pathname.startsWith(href);
  const Icon = item.icon;
  return (
    <Link
      href={href}
      prefetch
      className={cn(
        "relative flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-base font-extrabold",
        active ? `border-current ${item.active}` : "border-transparent text-ink-soft hover:bg-paper",
      )}
    >
      <Icon className={cn("h-6 w-6", active ? item.iconColor : "text-ink-soft")} aria-hidden="true" />
      {dict.nav[item.key]}
      <PendingHint />
    </Link>
  );
}

function MobileNav({ pathname, locale, dict }: { pathname: string; locale: Locale; dict: Dictionary }) {
  return (
    <nav
      aria-label={dict.nav.main}
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-line bg-paper-raised px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden"
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map((item) => (
          <li key={item.path}>
            <MobileItem item={item} pathname={pathname} locale={locale} dict={dict} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MobileItem({
  item,
  pathname,
  locale,
  dict,
}: {
  item: (typeof ITEMS)[number];
  pathname: string;
  locale: Locale;
  dict: Dictionary;
}) {
  const href = withLocale(locale, item.path);
  const active = pathname.startsWith(href);
  const Icon = item.icon;
  return (
    <Link
      href={href}
      prefetch
      className={cn(
        "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-extrabold",
        active ? item.iconColor : "text-ink-soft",
      )}
    >
      <Icon className="h-6 w-6" aria-hidden="true" />
      {dict.nav[item.key]}
      <PendingHint />
    </Link>
  );
}

function PendingHint() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 rounded-2xl bg-brand/15 transition-opacity",
        pending ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
