import { Mascot } from "@/components/brand/mascot";

type AdminHeaderProps = {
  title: string;
  lead?: string;
};

export function AdminHeader({ title, lead }: AdminHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      <Mascot size={72} mood="wow" />
      <div>
        <p className="text-sm font-extrabold uppercase tracking-wide text-teal">Admin</p>
        <h1 className="text-3xl font-black">{title}</h1>
        {lead ? <p className="mt-1 font-semibold text-ink-soft">{lead}</p> : null}
      </div>
    </div>
  );
}
