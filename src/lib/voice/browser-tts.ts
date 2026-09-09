import { pickVoice } from "@/lib/voice/pick-voice";
import type { SpeechLang } from "@/lib/voice/locale";

function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.speechSynthesis ?? null;
}

export function canSpeakBrowser(): boolean {
  return synth() !== null;
}

export function cancelBrowserSpeech(): void {
  synth()?.cancel();
}

export function primeBrowserSpeech(): void {
  const engine = synth();
  if (!engine) {
    return;
  }
  engine.cancel();
  const utter = new SpeechSynthesisUtterance(" ");
  utter.volume = 0;
  engine.speak(utter);
}

export async function speakBrowser(text: string, lang: SpeechLang, rate = 1): Promise<void> {
  const engine = synth();
  if (!engine || !text.trim()) {
    return;
  }

  const utter = new SpeechSynthesisUtterance(text.trim());
  utter.lang = lang;
  utter.rate = rate;
  const voice = pickVoice(await voicesOf(engine), lang);
  if (voice) {
    utter.voice = voice;
  }

  await new Promise<void>((resolve) => {
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    engine.speak(utter);
  });
}

function voicesOf(engine: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  const current = engine.getVoices();
  if (current.length > 0) {
    return Promise.resolve(current);
  }

  return new Promise((resolve) => {
    const finish = () => resolve(engine.getVoices());
    engine.addEventListener("voiceschanged", finish, { once: true });
    window.setTimeout(finish, 400);
  });
}
