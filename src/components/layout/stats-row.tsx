import type { ReactNode } from "react";
import { Flame, Heart, Star } from "lucide-react";
import type { Dictionary } from "@/i18n/types";

type StatsRowProps = {
  streak: number;
  xp: number;
  hearts: number;
  dict: Dictionary;
};

export function StatsRow({ streak, xp, hearts, dict }: StatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatChip icon={<Flame className="h-5 w-5 fill-clay text-clay" />} value={String(streak)} label={dict.learn.streak} tone="text-clay" />
      <StatChip icon={<Star className="h-5 w-5 fill-gold text-gold-dark" />} value={String(xp)} label="XP" tone="text-gold-dark" />
      <StatChip icon={<Heart className="h-5 w-5 fill-rose text-rose" />} value={`${hearts}/5`} label={dict.learn.hearts} tone="text-rose" />
    </div>
  );
}

function StatChip({
  icon,
  value,
  label,
  tone,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  tone: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-b-4 border-line bg-paper-raised px-2 py-3">
      {icon}
      <div className="min-w-0 text-center">
        <p className={`text-lg font-black leading-none ${tone}`}>{value}</p>
        <p className="mt-1 truncate text-[11px] font-bold text-ink-soft">{label}</p>
      </div>
    </div>
  );
}
