import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/brand/mascot";
import { getDictionary } from "@/i18n/get-dictionary";
import { getRequestLocale } from "@/i18n/request-locale";
import { withLocale } from "@/i18n/path";

export default async function NotFound() {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4 text-center">
      <Mascot mood="think" size={140} />
      <h1 className="text-2xl font-black">{dict.errors.notFound}</h1>
      <Link href={withLocale(locale, "/")}>
        <Button>{dict.common.home}</Button>
      </Link>
    </div>
  );
}
