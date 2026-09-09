import type { Metadata } from "next";
import { Nunito, Noto_Sans_Armenian } from "next/font/google";
import { APP_NAME } from "@/lib/constants/app";
import { getRequestLocale } from "@/i18n/request-locale";
import { getDictionary } from "@/i18n/get-dictionary";
import { LOCALE_META } from "@/i18n/config";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800", "900"],
});

const notoArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  variable: "--font-hy",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);

  return {
    title: {
      default: APP_NAME,
      template: `%s · ${APP_NAME}`,
    },
    description: dict.meta.description,
    openGraph: {
      title: APP_NAME,
      description: dict.meta.description,
      locale: LOCALE_META[locale].og,
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale} className={`${nunito.variable} ${notoArmenian.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
