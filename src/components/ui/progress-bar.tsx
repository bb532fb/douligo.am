import { cn } from "@/lib/utils/cn";

type ProgressBarProps = {
  value: number;
  label: string;
  className?: string;
};

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm font-extrabold text-ink-soft">
        <span>{label}</span>
        <span>{clamped}%</span>
      </div>
      <div
        className="h-4 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-brand shadow-[inset_0_-3px_0_rgba(0,0,0,0.12)]"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
