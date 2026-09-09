import { CACHE_TTL_SEC, remember, weeklyLeaderboardKey } from "@/lib/cache/remember";
import { prisma } from "@/lib/db/prisma";
import { startOfUtcWeek } from "@/lib/utils/date";

type WeeklyRow = {
  rank: number;
  userId: string;
  name: string;
  avatar: string | null;
  xp: number;
};

export const leaderboardService = {
  async weekly(currentUserId: string) {
    const rows = await remember(
      weeklyLeaderboardKey(startOfUtcWeek()),
      CACHE_TTL_SEC.leaderboard,
      loadWeeklyRows,
    );
    return rows.map((row) => ({ ...row, isCurrentUser: row.userId === currentUserId }));
  },
};

async function loadWeeklyRows(): Promise<WeeklyRow[]> {
  const weekStart = startOfUtcWeek();
  const grouped = await prisma.userXP.groupBy({
    by: ["userId"],
    where: { createdAt: { gte: weekStart } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
    take: 20,
  });

  const users = await prisma.user.findMany({
    where: { id: { in: grouped.map((item) => item.userId) } },
    include: { profile: true },
  });
  const userMap = new Map(users.map((user) => [user.id, user]));

  return grouped.map((item, index) => {
    const user = userMap.get(item.userId);
    return {
      rank: index + 1,
      userId: item.userId,
      name: user?.profile?.displayName ?? user?.name ?? "Lezu",
      avatar: user?.avatar ?? null,
      xp: item._sum.amount ?? 0,
    };
  });
}
