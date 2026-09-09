import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getRequestLocale } from "@/i18n/request-locale";
import { withLocale } from "@/i18n/path";

export const requireUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    const locale = await getRequestLocale();
    redirect(withLocale(locale, "/login"));
  }

  return session.user;
});

export async function redirectIfAuthenticated() {
  const session = await auth();
  if (session?.user?.id) {
    const locale = await getRequestLocale();
    redirect(withLocale(locale, "/learn"));
  }
}
