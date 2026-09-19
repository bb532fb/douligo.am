import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { loginAction } from "@/server/actions/auth-actions";

export async function generateMetadata({ params }: PageProps<"/[lang]/login">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    return {};
  }
  const dict = await getDictionary(lang);
  return { title: dict.auth.login };
}

export default async function LoginPage({ searchParams }: PageProps<"/[lang]/login">) {
  const query = await searchParams;
  const callbackUrl = typeof query.callbackUrl === "string" ? query.callbackUrl : undefined;
  return <AuthForm mode="login" action={loginAction} callbackUrl={callbackUrl} />;
}
