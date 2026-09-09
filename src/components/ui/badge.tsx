import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-brand-soft px-3 py-1 text-sm font-extrabold text-brand-dark",
        className,
      )}
      {...props}
    />
  );
}
