import type { SpeechLang } from "@/lib/voice/locale";

export type VoiceHint = {
  lang: string;
  name: string;
};

function normalizeLang(value: string): string {
  return value.toLowerCase().replace("_", "-");
}

export function pickVoice<T extends VoiceHint>(voices: T[], lang: SpeechLang): T | null {
  const wanted = normalizeLang(lang);
  const prefix = wanted.slice(0, 2);
  const exact = voices.find((voice) => normalizeLang(voice.lang) === wanted);
  if (exact) {
    return exact;
  }

  const byPrefix = voices.find((voice) => normalizeLang(voice.lang).startsWith(prefix));
  if (byPrefix) {
    return byPrefix;
  }

  const byName = voices.find((voice) => matchesVoiceName(voice.name, prefix));
  return byName ?? null;
}

function matchesVoiceName(name: string, prefix: string): boolean {
  const lower = name.toLowerCase();
  if (prefix === "hy") {
    return lower.includes("armenian") || lower.includes("հայ");
  }
  if (prefix === "ru") {
    return lower.includes("russian") || lower.includes("рус");
  }
  return lower.includes("english");
}
