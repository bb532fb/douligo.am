import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Mascot } from "@/components/brand/mascot";
import { requireUser } from "@/lib/auth/session";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils/cn";
import { leaderboardService } from "@/server/services/leaderboard-service";

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function LeaderboardPage({ params }: PageProps<"/[lang]/leaderboard">) {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    return null;
  }

  const user = await requireUser();
  const dict = await getDictionary(lang);
  const rows = await leaderboardService.weekly(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Mascot size={80} mood="wow" />
        <h1 className="text-3xl font-black">{dict.nav.leaderboard}</h1>
      </div>
      {rows.length === 0 ? (
        <EmptyState title={dict.leaderboard.empty} />
      ) : (
        <ol className="space-y-3">
          {rows.map((row) => (
            <li key={row.userId}>
              <Card
                className={cn(
                  "flex items-center gap-4",
                  row.isCurrentUser && "border-brand bg-brand-soft shadow-[0_8px_0_#46a302]",
                )}
              >
                <span className="w-10 text-center text-2xl font-black">
                  {MEDALS[row.rank - 1] ?? row.rank}
                </span>
                <Avatar name={row.name} size="sm" />
                <div className="flex-1">
                  <p className="font-extrabold">{row.name}</p>
                  <p className="text-sm font-bold text-ink-soft">⚡ {row.xp} XP</p>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
