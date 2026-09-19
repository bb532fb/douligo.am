import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, hasLocale, type Locale } from "@/i18n/config";

const PROTECTED_PREFIXES = [
  "/learn",
  "/lesson",
  "/profile",
  "/leaderboard",
  "/vocabulary",
  "/settings",
  "/courses",
  "/onboarding",
  "/analytics",
  "/admin",
  "/start",
  "/place",
];

function hasSessionCookie(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get("authjs.session-token") ??
      request.cookies.get("__Secure-authjs.session-token"),
  );
}

function negotiateLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (hasLocale(cookie)) {
    return cookie;
  }

  const header = request.headers.get("accept-language") ?? "";
  const candidates = header.split(",").map((part) => part.split(";")[0]?.trim().toLowerCase());
  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    if (hasLocale(candidate)) {
      return candidate;
    }
    const base = candidate.split("-")[0];
    if (hasLocale(base)) {
      return base;
    }
  }

  return DEFAULT_LOCALE;
}

function pathnameLocale(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return hasLocale(segment) ? segment : null;
}

function persistLocale(
  response: NextResponse,
  locale: Locale,
  current: string | undefined,
): NextResponse {
  if (current === locale) {
    return response;
  }
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathnameLocale(pathname);
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  if (!locale) {
    const nextLocale = negotiateLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${nextLocale}${pathname === "/" ? "" : pathname}`;
    return persistLocale(NextResponse.redirect(url), nextLocale, cookieLocale);
  }

  const pathWithoutLocale = pathname.slice(locale.length + 1) || "/";
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathWithoutLocale === prefix || pathWithoutLocale.startsWith(`${prefix}/`),
  );

  if (isProtected && !hasSessionCookie(request)) {
    const login = new URL(`/${locale}/login`, request.url);
    login.searchParams.set("callbackUrl", pathname);
    return persistLocale(NextResponse.redirect(login), locale, cookieLocale);
  }

  const headers = new Headers(request.headers);
  headers.set("x-pathname", pathname);
  return persistLocale(NextResponse.next({ request: { headers } }), locale, cookieLocale);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
