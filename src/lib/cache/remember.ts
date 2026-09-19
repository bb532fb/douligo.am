import { redisGet, redisIncr, redisSet } from "@/lib/db/redis";

const VERSION_KEY = "lezoo:content:v";

export const CACHE_TTL_SEC = {
  catalog: 60 * 60,
  lesson: 6 * 60 * 60,
  leaderboard: 45,
} as const;

function parseJson<T>(raw: string): T | undefined {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export async function remember<T>(key: string, ttlSec: number, load: () => Promise<T>): Promise<T> {
  const hit = await redisGet(key);
  if (hit !== null) {
    const parsed = parseJson<T>(hit);
    if (parsed !== undefined) {
      return parsed;
    }
  }

  const value = await load();
  if (value !== null && value !== undefined) {
    await redisSet(key, JSON.stringify(value), ttlSec);
  }
  return value;
}

export async function rememberCatalog<T>(
  name: string,
  load: () => Promise<T>,
  ttlSec: number = CACHE_TTL_SEC.catalog,
): Promise<T> {
  const version = (await redisGet(VERSION_KEY)) ?? "0";
  return remember(`lezoo:c:${version}:${name}`, ttlSec, load);
}

export async function bumpContentCache(): Promise<void> {
  await redisIncr(VERSION_KEY);
}

export function weeklyLeaderboardKey(weekStart: Date): string {
  return `lezoo:lb:week:${weekStart.toISOString()}`;
}
