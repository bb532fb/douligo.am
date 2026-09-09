import type { LanguageCode } from "@prisma/client";
import type { Locale } from "@/i18n/config";

export const SPEECH_LANGS = ["hy-AM", "en-US", "ru-RU"] as const;

export type SpeechLang = (typeof SPEECH_LANGS)[number];

const FROM_CODE: Record<LanguageCode, SpeechLang> = {
  HY: "hy-AM",
  EN: "en-US",
  RU: "ru-RU",
};

const FROM_LOCALE: Record<Locale, SpeechLang> = {
  hy: "hy-AM",
  en: "en-US",
  ru: "ru-RU",
};

export function speechLangFromCode(code: LanguageCode): SpeechLang {
  return FROM_CODE[code];
}

export function speechLangFromLocale(locale: Locale): SpeechLang {
  return FROM_LOCALE[locale];
}

export function detectLanguageCode(text: string): LanguageCode {
  if (/[\u0530-\u058F]/.test(text)) {
    return "HY";
  }
  if (/[\u0400-\u04FF]/.test(text)) {
    return "RU";
  }
  return "EN";
}

export function speechLangFromText(text: string): SpeechLang {
  return speechLangFromCode(detectLanguageCode(text));
}
