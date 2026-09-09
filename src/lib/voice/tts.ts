import type { SpeechLang } from "@/lib/voice/locale";
import {
  canSpeakBrowser,
  cancelBrowserSpeech,
  primeBrowserSpeech,
  speakBrowser,
} from "@/lib/voice/browser-tts";
import { cancelNeural, prefetchNeural, primeNeural, speakNeural } from "@/lib/voice/neural-player";

let speakGen = 0;

export function canSpeak(): boolean {
  return typeof window !== "undefined" || canSpeakBrowser();
}

export function cancelSpeech(): void {
  speakGen += 1;
  cancelNeural();
  cancelBrowserSpeech();
}

export function prefetchSpeech(text: string, lang: SpeechLang): void {
  void prefetchNeural(text, lang);
}

export function primeSpeech(): void {
  primeBrowserSpeech();
  primeNeural();
}

export async function speakText(text: string, lang: SpeechLang, rate = 1): Promise<void> {
  const value = text.trim();
  if (!value) {
    return;
  }

  cancelSpeech();
  const generation = speakGen;
  try {
    await speakNeural(value, lang, rate);
  } catch (error) {
    if (generation !== speakGen || isAbort(error)) {
      return;
    }
    await speakBrowser(value, lang, rate);
  }
}

function isAbort(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}
