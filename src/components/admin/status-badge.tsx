import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { UserStatus } from "@prisma/client";

type StatusBadgeProps = {
  status: UserStatus;
  activeLabel: string;
  suspendedLabel: string;
};

export function StatusBadge({ status, activeLabel, suspendedLabel }: StatusBadgeProps) {
  const active = status === "ACTIVE";
  return (
    <Badge
      className={cn(
        active ? "bg-brand-soft text-brand-dark" : "bg-rose-soft text-rose",
      )}
    >
      {active ? activeLabel : suspendedLabel}
    </Badge>
  );
}
