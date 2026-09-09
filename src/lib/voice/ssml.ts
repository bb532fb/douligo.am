import type { SpeechLang } from "@/lib/voice/locale";

export const NEURAL_VOICES: Record<SpeechLang, string> = {
  "hy-AM": "hy-AM-AnahitNeural",
  "en-US": "en-US-AvaNeural",
  "ru-RU": "ru-RU-SvetlanaNeural",
};

export const NEURAL_VOICE_FALLBACKS: Record<SpeechLang, readonly string[]> = {
  "hy-AM": ["hy-AM-AnahitNeural", "en-US-AvaMultilingualNeural"],
  "en-US": ["en-US-AvaNeural"],
  "ru-RU": ["ru-RU-SvetlanaNeural"],
};

export function rateToProsody(rate: number): string {
  const percent = Math.round((rate - 1) * 100);
  return percent >= 0 ? `+${percent}%` : `${percent}%`;
}

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildSsml(text: string, lang: SpeechLang, rate: number, voice = NEURAL_VOICES[lang]): string {
  const xmlLang = voice.slice(0, 5) || lang;
  const prosody = rateToProsody(rate);
  return (
    `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${xmlLang}">` +
    `<voice name="${voice}">` +
    `<prosody rate="${prosody}">${escapeXml(text)}</prosody>` +
    `</voice></speak>`
  );
}
