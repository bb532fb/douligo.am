export const VOICE_PREFS_KEY = "lezoo.voice";

export type VoicePrefs = {
  enabled: boolean;
  autoplay: boolean;
};

export const DEFAULT_VOICE_PREFS: VoicePrefs = {
  enabled: true,
  autoplay: true,
};

export function readVoicePrefs(): VoicePrefs {
  if (typeof window === "undefined") {
    return DEFAULT_VOICE_PREFS;
  }
  try {
    const raw = window.localStorage.getItem(VOICE_PREFS_KEY);
    if (!raw) {
      return DEFAULT_VOICE_PREFS;
    }
    const parsed = JSON.parse(raw) as Partial<VoicePrefs>;
    return {
      enabled: parsed.enabled ?? true,
      autoplay: parsed.autoplay ?? true,
    };
  } catch {
    return DEFAULT_VOICE_PREFS;
  }
}

export function writeVoicePrefs(prefs: VoicePrefs): void {
  window.localStorage.setItem(VOICE_PREFS_KEY, JSON.stringify(prefs));
}
