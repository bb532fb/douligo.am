"use client";

import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/brand/mascot";
import { useI18n } from "@/components/i18n/i18n-provider";

export default function LocaleError({ reset }: { reset: () => void }) {
  const { dict } = useI18n();

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4 text-center">
      <Mascot mood="sad" size={140} />
      <h1 className="text-2xl font-black">{dict.errors.generic}</h1>
      <Button onClick={reset}>{dict.common.reset}</Button>
    </div>
  );
}
