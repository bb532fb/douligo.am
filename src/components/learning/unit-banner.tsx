import { cn } from "@/lib/utils/cn";

const THEMES = [
  "bg-teal text-white",
  "bg-violet text-white",
  "bg-brand text-white",
  "bg-clay text-white",
] as const;

type UnitBannerProps = {
  title: string;
  description: string;
  level: string;
  index: number;
};

export function UnitBanner({ title, description, level, index }: UnitBannerProps) {
  const theme = THEMES[index % THEMES.length] ?? THEMES[0];

  return (
    <div className={cn("rounded-3xl border-b-4 px-5 py-4 shadow-[0_6px_0_rgba(0,0,0,0.08)]", theme)}>
      <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-extrabold">
        {level}
      </span>
      <h2 className="mt-2 text-2xl font-black">{title}</h2>
      <p className="mt-1 text-sm font-semibold opacity-90">{description}</p>
    </div>
  );
}
