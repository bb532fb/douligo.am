import { hasLocale, type Locale } from "@/i18n/config";

export function stripLocale(pathname: string): string {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (!hasLocale(maybeLocale)) {
    return pathname || "/";
  }
  const rest = `/${segments.slice(2).join("/")}`.replace(/\/$/, "");
  return rest === "" ? "/" : rest;
}

export function withLocale(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalized}`;
}

export function replaceLocale(pathname: string, locale: Locale): string {
  return withLocale(locale, stripLocale(pathname));
}
