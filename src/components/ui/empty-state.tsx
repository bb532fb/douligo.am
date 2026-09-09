import { Mascot } from "@/components/brand/mascot";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[var(--radius-card)] border-2 border-dashed border-line bg-paper-raised px-6 py-10 text-center">
      <div className="mx-auto mb-3 flex justify-center">
        <Mascot mood="think" size={96} />
      </div>
      <p className="text-lg font-extrabold text-ink">{title}</p>
      {description ? <p className="mt-2 font-semibold text-ink-soft">{description}</p> : null}
    </div>
  );
}
