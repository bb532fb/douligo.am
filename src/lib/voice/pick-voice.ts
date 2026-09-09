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
  let best: T | null = null;
  let bestScore = 0;

  for (const voice of voices) {
    const score = scoreVoice(voice, wanted, prefix);
    if (score > bestScore) {
      best = voice;
      bestScore = score;
    }
  }

  return bestScore > 0 ? best : null;
}

function scoreVoice(voice: VoiceHint, wanted: string, prefix: string): number {
  const lang = normalizeLang(voice.lang);
  const name = voice.name.toLowerCase();
  let score = 0;
  if (lang === wanted) {
    score += 100;
  } else if (lang.startsWith(prefix)) {
    score += 50;
  } else if (matchesVoiceName(voice.name, prefix)) {
    score += 20;
  }
  if (name.includes("neural") || name.includes("natural") || name.includes("online")) {
    score += 15;
  }
  return score;
}

function matchesVoiceName(name: string, prefix: string): boolean {
  const lower = name.toLowerCase();
  if (prefix === "hy") {
    return lower.includes("armenian") || lower.includes("հայ") || lower.includes("anahit");
  }
  if (prefix === "ru") {
    return lower.includes("russian") || lower.includes("рус");
  }
  return lower.includes("english");
}
