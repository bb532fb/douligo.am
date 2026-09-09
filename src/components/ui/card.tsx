import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border-2 border-line bg-paper-raised p-5 shadow-[var(--shadow-card)]",
        className,
      )}
      {...props}
    />
  );
}
