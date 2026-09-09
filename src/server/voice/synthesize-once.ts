import { getCachedAudio, setCachedAudio } from "@/server/voice/audio-cache";

const inflight = new Map<string, Promise<Uint8Array>>();

export async function synthesizeOnce(
  key: string,
  produce: () => Promise<Uint8Array>,
): Promise<Uint8Array> {
  const cached = await getCachedAudio(key);
  if (cached) {
    return cached;
  }

  const pending = inflight.get(key);
  if (pending) {
    return pending;
  }

  const next = produce()
    .then(async (audio) => {
      await setCachedAudio(key, audio);
      return audio;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, next);
  return next;
}
