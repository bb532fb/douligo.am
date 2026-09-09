import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, hasLocale, type Locale } from "@/i18n/config";

export async function getRequestLocale(): Promise<Locale> {
  const headerStore = await headers();
  const segment = (headerStore.get("x-pathname") ?? "/").split("/")[1];
  if (hasLocale(segment)) {
    return segment;
  }

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (hasLocale(fromCookie)) {
    return fromCookie;
  }

  return DEFAULT_LOCALE;
}
