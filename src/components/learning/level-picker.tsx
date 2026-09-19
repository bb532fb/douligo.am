import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { withLocale } from "@/i18n/path";
import { cn } from "@/lib/utils/cn";
import type { Dictionary } from "@/i18n/types";

const LEVELS = [
  { id: "A1", labelKey: "levelA1", hintKey: "levelA1Hint" },
  { id: "A2", labelKey: "levelA2", hintKey: "levelA2Hint" },
  { id: "B1", labelKey: "levelB1", hintKey: "levelB1Hint" },
] as const;

type LevelPickerProps = {
  locale: Locale;
  levels: string[];
  selected?: string;
  dict: Dictionary;
  variant?: "compact" | "cards";
};

export function LevelPicker({ locale, levels, selected, dict, variant = "compact" }: LevelPickerProps) {
  const cards = variant === "cards";
  return (
    <div className="space-y-3">
      {cards ? (
        <p className="font-semibold text-ink-soft">{dict.learn.chooseLevelLead}</p>
      ) : (
        <p className="text-sm font-extrabold text-ink-soft">
          {selected ? dict.learn.changeLevel : dict.learn.chooseLevel}
        </p>
      )}
      <div className={cards ? "grid gap-3" : "flex flex-wrap gap-2"}>
        {LEVELS.filter((level) => levels.includes(level.id)).map((level) => (
          <LevelLink
            key={level.id}
            href={withLocale(locale, `/place/${level.id}`)}
            label={dict.learn[level.labelKey]}
            hint={cards ? dict.learn[level.hintKey] : null}
            selected={selected === level.id}
            cards={cards}
          />
        ))}
      </div>
    </div>
  );
}

function LevelLink({
  href,
  label,
  hint,
  selected,
  cards,
}: {
  href: string;
  label: string;
  hint: string | null;
  selected: boolean;
  cards: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "pressable rounded-2xl border-2 font-extrabold",
        cards ? "space-y-1 px-5 py-4 text-left" : "px-4 py-3 text-sm",
        selected ? "border-brand bg-brand text-white" : "border-line bg-paper-raised text-ink",
      )}
    >
      <span className="block">{label}</span>
      {hint ? (
        <span className={cn("block text-sm font-semibold", selected ? "text-white/90" : "text-ink-soft")}>
          {hint}
        </span>
      ) : null}
    </Link>
  );
}
