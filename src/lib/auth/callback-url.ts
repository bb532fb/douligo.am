import type { Locale } from "@/i18n/config";
import { withLocale } from "@/i18n/path";

const MAX_CALLBACK_LENGTH = 200;

export function safeCallbackUrl(value: unknown, locale: Locale): string | null {
  if (typeof value !== "string" || value.length === 0 || value.length > MAX_CALLBACK_LENGTH) {
    return null;
  }
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return null;
  }
  if (value.includes("..")) {
    return null;
  }

  const path = value.split("?")[0] ?? "";
  if (path !== `/${locale}` && !path.startsWith(`/${locale}/`)) {
    return null;
  }

  return value;
}

export function loginUrlWithCallback(locale: Locale, callbackUrl: string): string {
  return `${withLocale(locale, "/login")}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}
