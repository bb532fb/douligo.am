import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/brand/logo";
import { Mascot } from "@/components/brand/mascot";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { withLocale } from "@/i18n/path";
import type { Dictionary } from "@/i18n/types";
import type { CourseSlug } from "@/lib/constants/app";

const PAIRS: { slug: CourseSlug; flag: string; to: string; smile: string }[] = [
  { slug: "hy-en", flag: "🇦🇲", to: "🇬🇧", smile: "🌟" },
  { slug: "en-hy", flag: "🇬🇧", to: "🇦🇲", smile: "🎈" },
  { slug: "ru-hy", flag: "🇷🇺", to: "🇦🇲", smile: "🎯" },
  { slug: "hy-ru", flag: "🇦🇲", to: "🇷🇺", smile: "🚀" },
];

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    return null;
  }
  const dict = await getDictionary(lang);

  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col px-4 py-6 sm:px-6">
      <HomeHeader lang={lang} dict={dict} />
      <main className="flex flex-1 flex-col justify-center gap-12 py-10">
        <HomeHero lang={lang} dict={dict} />
        <HomePairs dict={dict} />
      </main>
    </div>
  );
}

function HomeHeader({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <header className="flex items-center justify-between gap-3">
      <Logo />
      <div className="flex flex-wrap items-center justify-end gap-2">
        <LocaleSwitcher />
        <Button variant="ghost" href={withLocale(lang, "/login")}>
          {dict.auth.login}
        </Button>
        <Button href={withLocale(lang, "/register")}>{dict.auth.register}</Button>
      </div>
    </header>
  );
}

function HomeHero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <p className="inline-flex rounded-full bg-gold-soft px-4 py-1 text-sm font-extrabold text-clay-dark">
          😊 {dict.home.badge}
        </p>
        <h1 className="text-4xl font-black leading-tight sm:text-6xl">Lezu</h1>
        <p className="text-xl font-bold text-ink-soft">{dict.home.tagline}</p>
        <p className="max-w-lg font-semibold text-ink-soft">{dict.home.lead}</p>
        <Button className="w-full sm:w-auto" href={withLocale(lang, "/register")}>
          {dict.auth.register} ✨
        </Button>
      </div>
      <div className="flex justify-center">
        <Mascot mood="celebrate" size={240} />
      </div>
    </div>
  );
}

function HomePairs({ dict }: { dict: Dictionary }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {PAIRS.map((pair) => (
        <li key={pair.slug}>
          <Card className="flex items-center gap-4 transition hover:-translate-y-0.5">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-soft text-3xl" aria-hidden="true">
              {pair.smile}
            </span>
            <div>
              <p className="text-2xl font-black">
                {pair.flag} → {pair.to}
              </p>
              <p className="mt-1 font-extrabold">{dict.home.pairs[pair.slug]}</p>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
