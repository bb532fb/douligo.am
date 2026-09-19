import { cn } from "@/lib/utils/cn";
import { APP_NAME } from "@/lib/constants/app";
import { Mascot } from "@/components/brand/mascot";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
};

const SIZES = {
  sm: { mascot: 36, text: "text-xl" },
  md: { mascot: 48, text: "text-2xl" },
  lg: { mascot: 72, text: "text-4xl" },
} as const;

export function Logo({ size = "md", showWordmark = true, className }: LogoProps) {
  const scale = SIZES[size];

  return (
    <span className={cn("inline-flex items-center gap-2 font-extrabold tracking-tight text-brand", className)}>
      <Mascot size={scale.mascot} mood="happy" animated={false} className="shrink-0" />
      {showWordmark ? <span className={scale.text}>{APP_NAME}</span> : null}
    </span>
  );
}
