import { createHash } from "node:crypto";
import { redisGet, redisSet } from "@/lib/db/redis";

const MAX_ENTRIES = 200;
const AUDIO_TTL_SEC = 60 * 60 * 24 * 7;

const store = new Map<string, Uint8Array>();

export function audioCacheKey(text: string, lang: string, rate: number): string {
  return `${lang}|${rate.toFixed(2)}|${text}`;
}

function redisAudioKey(key: string): string {
  return `lezoo:audio:${createHash("sha256").update(key).digest("hex")}`;
}

function memoryGet(key: string): Uint8Array | null {
  const value = store.get(key);
  if (!value) {
    return null;
  }
  store.delete(key);
  store.set(key, value);
  return value;
}

function memorySet(key: string, value: Uint8Array): void {
  if (store.has(key)) {
    store.delete(key);
  }
  store.set(key, value);
  const oldest = store.keys().next().value;
  if (store.size > MAX_ENTRIES && oldest) {
    store.delete(oldest);
  }
}

export async function getCachedAudio(key: string): Promise<Uint8Array | null> {
  const local = memoryGet(key);
  if (local) {
    return local;
  }

  const encoded = await redisGet(redisAudioKey(key));
  if (!encoded) {
    return null;
  }

  const remote = new Uint8Array(Buffer.from(encoded, "base64"));
  memorySet(key, remote);
  return remote;
}

export async function setCachedAudio(key: string, value: Uint8Array): Promise<void> {
  memorySet(key, value);
  await redisSet(redisAudioKey(key), Buffer.from(value).toString("base64"), AUDIO_TTL_SEC);
}

export function resetAudioCache(): void {
  store.clear();
}
