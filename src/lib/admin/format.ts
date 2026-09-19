import type { Locale } from "@/i18n/config";

const TAGS: Record<Locale, string> = {
  hy: "hy-AM",
  en: "en-GB",
  ru: "ru-RU",
};

export function formatAdminDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(TAGS[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatAdminDateTime(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(TAGS[locale], {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
