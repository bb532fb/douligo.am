import { Card } from "@/components/ui/card";

type AdminStatCardProps = {
  emoji: string;
  label: string;
  value: string | number;
};

export function AdminStatCard({ emoji, label, value }: AdminStatCardProps) {
  return (
    <Card className="min-h-[7rem]">
      <p className="text-sm font-bold text-ink-soft">
        {emoji} {label}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </Card>
  );
}
