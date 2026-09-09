import { createClient } from "redis";

function redisUrl(): string | undefined {
  if (process.env.VITEST === "true") {
    return undefined;
  }
  return process.env.REDIS_URL;
}

function createRedis(url: string) {
  const client = createClient({ url });
  client.on("error", (error) => {
    console.error("redis", error);
  });
  return client;
}

type RedisClient = ReturnType<typeof createRedis>;

const globalForRedis = globalThis as unknown as {
  redis?: RedisClient;
  redisReady?: Promise<RedisClient | null>;
};

export async function getRedis(): Promise<RedisClient | null> {
  const url = redisUrl();
  if (!url) {
    return null;
  }

  const existing = globalForRedis.redis;
  if (existing?.isOpen) {
    return existing;
  }
  if (existing && !existing.isOpen) {
    globalForRedis.redisReady = undefined;
  }

  if (!globalForRedis.redisReady) {
    const client = existing ?? createRedis(url);
    globalForRedis.redis = client;
    globalForRedis.redisReady = client
      .connect()
      .then(() => client)
      .catch((error: unknown) => {
        console.error("redis connect", error);
        globalForRedis.redisReady = undefined;
        return null;
      });
  }

  return globalForRedis.redisReady;
}

export async function redisGet(key: string): Promise<string | null> {
  try {
    const client = await getRedis();
    if (!client) {
      return null;
    }
    return await client.get(key);
  } catch (error) {
    console.error("redis get", error);
    return null;
  }
}

export async function redisSet(key: string, value: string, ttlSec: number): Promise<void> {
  try {
    const client = await getRedis();
    if (!client) {
      return;
    }
    await client.set(key, value, { EX: ttlSec });
  } catch (error) {
    console.error("redis set", error);
  }
}

export async function redisIncr(key: string): Promise<void> {
  try {
    const client = await getRedis();
    if (!client) {
      return;
    }
    await client.incr(key);
  } catch (error) {
    console.error("redis incr", error);
  }
}

export async function closeRedis(): Promise<void> {
  const client = globalForRedis.redis;
  globalForRedis.redis = undefined;
  globalForRedis.redisReady = undefined;
  if (client?.isOpen) {
    await client.quit();
  }
}
