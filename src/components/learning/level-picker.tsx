import { setStartLevelAction } from "@/server/actions/course-actions";
import { cn } from "@/lib/utils/cn";
import type { Dictionary } from "@/i18n/types";

const LEVELS = [
  { id: "A1", labelKey: "levelA1" },
  { id: "A2", labelKey: "levelA2" },
  { id: "B1", labelKey: "levelB1" },
] as const;

type LevelPickerProps = {
  levels: string[];
  selected: string;
  dict: Dictionary;
};

export function LevelPicker({ levels, selected, dict }: LevelPickerProps) {
  return (
    <form action={setStartLevelAction} className="space-y-3">
      <p className="text-sm font-extrabold text-ink-soft">{dict.learn.chooseLevel}</p>
      <div className="flex flex-wrap gap-2">
        {LEVELS.filter((level) => levels.includes(level.id)).map((level) => (
          <button
            key={level.id}
            type="submit"
            name="startLevel"
            value={level.id}
            className={cn(
              "pressable rounded-2xl border-2 px-4 py-3 text-sm font-extrabold",
              selected === level.id
                ? "border-brand bg-brand text-white"
                : "border-line bg-paper-raised text-ink",
            )}
          >
            {dict.learn[level.labelKey]}
          </button>
        ))}
      </div>
    </form>
  );
}
