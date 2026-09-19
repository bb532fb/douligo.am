import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type CourseCardProps = {
  href: string;
  title: string;
  lead: string;
  flag: string;
  smile: string;
  continueLabel: string;
  current?: boolean;
};

export function CourseCard({ href, title, lead, flag, smile, continueLabel, current }: CourseCardProps) {
  return (
    <Link href={href} className="block w-full touch-manipulation text-left">
      <Card className={cn("space-y-4", current && "border-brand")}>
        <p className="text-3xl">
          {smile} {flag}
        </p>
        <h2 className="text-xl font-black">{title}</h2>
        <p className="font-semibold text-ink-soft">{lead}</p>
        <span
          className={cn(
            "tap-target pressable inline-flex w-full items-center justify-center rounded-2xl border-2 bg-brand px-6 text-base font-extrabold text-white",
            "border-brand-dark",
          )}
        >
          {continueLabel}
        </span>
      </Card>
    </Link>
  );
}
