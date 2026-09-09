import { cache } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

export type { Dictionary, ErrorKey } from "@/i18n/types";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  hy: () => import("@/i18n/messages/hy.json").then((module) => module.default),
  en: () => import("@/i18n/messages/en.json").then((module) => module.default),
  ru: () => import("@/i18n/messages/ru.json").then((module) => module.default),
};

export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]();
});
