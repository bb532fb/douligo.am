import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { interpolate } from "@/i18n/interpolate";
import { withLocale } from "@/i18n/path";

type LevelGateProps = {
  nextLevel: string;
  locale: Locale;
  dict: Dictionary;
};

export function LevelGate({ nextLevel, locale, dict }: LevelGateProps) {
  return (
    <div className="mx-auto max-w-sm space-y-3 rounded-3xl border-2 border-line bg-paper-raised px-5 py-6 text-center shadow-[0_8px_0_rgba(0,0,0,0.06)]">
      <Lock className="mx-auto h-8 w-8 text-ink-soft" aria-hidden="true" />
      <p className="text-lg font-black">{interpolate(dict.mastery.lockedLevel, { level: nextLevel })}</p>
      <p className="text-sm font-bold text-ink-soft">{dict.learn.levelGateLead}</p>
      <Button href={withLocale(locale, "/analytics")} variant="secondary" className="w-full">
        {dict.learn.viewAnalytics}
      </Button>
    </div>
  );
}
