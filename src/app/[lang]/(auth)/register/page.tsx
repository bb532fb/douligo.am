import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { registerAction } from "@/server/actions/auth-actions";

export async function generateMetadata({ params }: PageProps<"/[lang]/register">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    return {};
  }
  const dict = await getDictionary(lang);
  return { title: dict.auth.register };
}

export default async function RegisterPage({ searchParams }: PageProps<"/[lang]/register">) {
  const query = await searchParams;
  const callbackUrl = typeof query.callbackUrl === "string" ? query.callbackUrl : undefined;
  return <AuthForm mode="register" action={registerAction} callbackUrl={callbackUrl} />;
}
