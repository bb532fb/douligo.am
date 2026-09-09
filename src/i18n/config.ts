export const LOCALES = ["hy", "en", "ru"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "hy";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_META: Record<Locale, { label: string; og: string }> = {
  hy: { label: "Հայերեն", og: "hy_AM" },
  en: { label: "English", og: "en_US" },
  ru: { label: "Русский", og: "ru_RU" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function hasLocale(value: string | undefined | null): value is Locale {
  return isLocale(value);
}
