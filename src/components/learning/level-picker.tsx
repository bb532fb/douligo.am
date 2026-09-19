import { setStartLevelAction } from "@/server/actions/course-actions";
import { cn } from "@/lib/utils/cn";
import type { Dictionary } from "@/i18n/types";

const LEVELS = [
  { id: "A1", labelKey: "levelA1", hintKey: "levelA1Hint" },
  { id: "A2", labelKey: "levelA2", hintKey: "levelA2Hint" },
  { id: "B1", labelKey: "levelB1", hintKey: "levelB1Hint" },
] as const;

type LevelPickerProps = {
  levels: string[];
  selected?: string;
  dict: Dictionary;
  variant?: "compact" | "cards";
};

export function LevelPicker({ levels, selected, dict, variant = "compact" }: LevelPickerProps) {
  const cards = variant === "cards";
  return (
    <form action={setStartLevelAction} className="space-y-3">
      {cards ? (
        <p className="font-semibold text-ink-soft">{dict.learn.chooseLevelLead}</p>
      ) : (
        <p className="text-sm font-extrabold text-ink-soft">
          {selected ? dict.learn.changeLevel : dict.learn.chooseLevel}
        </p>
      )}
      <div className={cards ? "grid gap-3" : "flex flex-wrap gap-2"}>
        {LEVELS.filter((level) => levels.includes(level.id)).map((level) => (
          <LevelButton
            key={level.id}
            id={level.id}
            label={dict.learn[level.labelKey]}
            hint={cards ? dict.learn[level.hintKey] : null}
            selected={selected === level.id}
            cards={cards}
          />
        ))}
      </div>
    </form>
  );
}

function LevelButton({
  id,
  label,
  hint,
  selected,
  cards,
}: {
  id: string;
  label: string;
  hint: string | null;
  selected: boolean;
  cards: boolean;
}) {
  return (
    <button
      type="submit"
      name="startLevel"
      value={id}
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
    </button>
  );
}
