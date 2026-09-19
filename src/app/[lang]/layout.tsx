import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { LOCALES, LOCALE_META, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { APP_NAME } from "@/lib/constants/app";

export const dynamicParams = true;

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    return {};
  }
  const dict = await getDictionary(lang);
  return {
    description: dict.meta.description,
    openGraph: {
      title: APP_NAME,
      description: dict.meta.description,
      locale: LOCALE_META[lang].og,
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <I18nProvider locale={lang} dict={dict}>
      {children}
    </I18nProvider>
  );
}
