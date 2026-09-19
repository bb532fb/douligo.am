import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getRequestLocale } from "@/i18n/request-locale";
import { withLocale } from "@/i18n/path";
import { userRepository } from "@/server/repositories/user-repository";

export const getOptionalUser = cache(async () => {
  const session = await auth();
  return session?.user?.id ? session.user : null;
});

export const getOptionalAccount = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return userRepository.findAccountById(session.user.id);
});

export const requireUser = cache(async () => {
  const user = await getOptionalUser();
  if (!user) {
    const locale = await getRequestLocale();
    redirect(withLocale(locale, "/login"));
  }

  const account = await userRepository.findAccountById(user.id);
  if (!account || account.status !== "ACTIVE") {
    const locale = await getRequestLocale();
    redirect(withLocale(locale, "/login"));
  }

  return user;
});

export const requireAdmin = cache(async () => {
  const account = await getOptionalAccount();
  if (!account || account.status !== "ACTIVE") {
    const locale = await getRequestLocale();
    redirect(withLocale(locale, "/login"));
  }
  if (account.role !== "ADMIN") {
    notFound();
  }
  return account;
});

export async function redirectIfAuthenticated() {
  const account = await getOptionalAccount();
  if (account?.status === "ACTIVE") {
    const locale = await getRequestLocale();
    redirect(withLocale(locale, "/learn"));
  }
}
