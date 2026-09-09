"use client";

import { useEffect } from "react";
import { useVoicePrefs } from "@/components/voice/use-voice-prefs";
import { cancelSpeech, speakText } from "@/lib/voice/tts";
import type { SpeechLang } from "@/lib/voice/locale";

type CoachSpeechProps = {
  line: string;
  lang: SpeechLang;
  followUp?: { text: string; lang: SpeechLang };
};

export function CoachSpeech({ line, lang, followUp }: CoachSpeechProps) {
  const { prefs } = useVoicePrefs();

  useEffect(() => {
    if (!prefs.enabled || !prefs.autoplay) {
      return;
    }
    let cancelled = false;
    void (async () => {
      await speakText(line, lang);
      if (!cancelled && followUp?.text) {
        await speakText(followUp.text, followUp.lang);
      }
    })();
    return () => {
      cancelled = true;
      cancelSpeech();
    };
  }, [followUp?.lang, followUp?.text, lang, line, prefs.autoplay, prefs.enabled]);

  return null;
}
