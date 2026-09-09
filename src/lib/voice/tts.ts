import { pickVoice } from "@/lib/voice/pick-voice";
import type { SpeechLang } from "@/lib/voice/locale";

function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.speechSynthesis ?? null;
}

export function canSpeak(): boolean {
  return synth() !== null;
}

export function cancelSpeech(): void {
  synth()?.cancel();
}

export function primeSpeech(): void {
  const engine = synth();
  if (!engine) {
    return;
  }
  engine.cancel();
  const utter = new SpeechSynthesisUtterance(" ");
  utter.volume = 0;
  engine.speak(utter);
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

export async function speakText(text: string, lang: SpeechLang, rate = 1): Promise<void> {
  const engine = synth();
  const value = text.trim();
  if (!engine || !value) {
    return;
  }

  engine.cancel();
  const utter = new SpeechSynthesisUtterance(value);
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
