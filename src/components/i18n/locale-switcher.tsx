"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "@/i18n/config";
import { replaceLocale } from "@/i18n/path";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/components/i18n/i18n-provider";

const FLAGS: Record<Locale, string> = {
  hy: "🇦🇲",
  en: "🇬🇧",
  ru: "🇷🇺",
};

type LocaleSwitcherProps = {
  className?: string;
};

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={dict.locale.switcher}
      className={cn(
        "inline-flex rounded-2xl border-2 border-b-4 border-line bg-paper-raised p-1",
        className,
      )}
    >
      {LOCALES.map((item) => {
        const active = item === locale;
        return (
          <Link
            key={item}
            href={replaceLocale(pathname, item)}
            hrefLang={item}
            replace
            prefetch
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-xl px-2.5 py-1.5 text-xs font-black uppercase tracking-wide",
              active ? "bg-brand text-white" : "text-ink-soft hover:bg-paper",
            )}
          >
            <span aria-hidden="true">{FLAGS[item]} </span>
            {item}
          </Link>
        );
      })}
    </div>
  );
}
