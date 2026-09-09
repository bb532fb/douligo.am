import type { SpeechLang } from "@/lib/voice/locale";

const CACHE_MAX = 80;
const blobUrls = new Map<string, string>();
let current: HTMLAudioElement | null = null;
let speakAbort: AbortController | null = null;

export function cancelNeural(): void {
  speakAbort?.abort();
  speakAbort = null;
  if (!current) {
    return;
  }
  current.pause();
  current.removeAttribute("src");
  current = null;
}

export function primeNeural(): void {
  if (typeof Audio === "undefined") {
    return;
  }
  const unlock = new Audio(
    "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=",
  );
  void unlock.play().catch(() => undefined);
}

export function prefetchNeural(text: string, lang: SpeechLang): void {
  void audioUrlFor(text, lang, new AbortController().signal).catch(() => undefined);
}

export async function speakNeural(text: string, lang: SpeechLang, rate: number): Promise<void> {
  const controller = new AbortController();
  speakAbort = controller;
  const url = await audioUrlFor(text, lang, controller.signal);
  if (controller.signal.aborted) {
    throw abortError();
  }
  await playUrl(url, rate, controller.signal);
}

async function audioUrlFor(
  text: string,
  lang: SpeechLang,
  signal: AbortSignal,
): Promise<string> {
  const key = `${lang}|${text}`;
  const cached = blobUrls.get(key);
  if (cached) {
    blobUrls.delete(key);
    blobUrls.set(key, cached);
    return cached;
  }

  const query = new URLSearchParams({ text, lang });
  const response = await fetch(`/api/voice/speak?${query}`, { signal });
  if (!response.ok) {
    throw new Error("neural-unavailable");
  }
  const url = URL.createObjectURL(await response.blob());
  remember(key, url);
  return url;
}

function remember(key: string, url: string): void {
  blobUrls.set(key, url);
  const oldest = blobUrls.keys().next().value;
  if (blobUrls.size > CACHE_MAX && oldest) {
    const stale = blobUrls.get(oldest);
    blobUrls.delete(oldest);
    if (stale) {
      URL.revokeObjectURL(stale);
    }
  }
}

function playUrl(url: string, rate: number, signal: AbortSignal): Promise<void> {
  const audio = new Audio(url);
  audio.playbackRate = rate;
  current = audio;
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      audio.pause();
      reject(abortError());
    };
    signal.addEventListener("abort", onAbort, { once: true });
    audio.onended = () => {
      signal.removeEventListener("abort", onAbort);
      if (current === audio) {
        current = null;
      }
      resolve();
    };
    audio.onerror = () => {
      signal.removeEventListener("abort", onAbort);
      reject(new Error("neural-play"));
    };
    void audio.play().catch(reject);
  });
}

function abortError(): Error {
  const error = new Error("aborted");
  error.name = "AbortError";
  return error;
}
