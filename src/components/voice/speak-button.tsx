"use client";

import { useEffect, useState } from "react";
import { Turtle, Volume2 } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { cn } from "@/lib/utils/cn";
import { cancelSpeech, speakText } from "@/lib/voice/tts";
import type { SpeechLang } from "@/lib/voice/locale";
import { useVoicePrefs } from "@/components/voice/use-voice-prefs";

type SpeakButtonProps = {
  text: string;
  lang: SpeechLang;
  autoPlay?: boolean;
  size?: "sm" | "md";
};

export function SpeakButton({ text, lang, autoPlay = false, size = "md" }: SpeakButtonProps) {
  const { dict } = useI18n();
  const { prefs } = useVoicePrefs();
  const [speaking, setSpeaking] = useState(false);
  const box = size === "sm" ? "h-11 w-11" : "h-14 w-14";

  useEffect(() => {
    if (!autoPlay || !prefs.enabled || !prefs.autoplay) {
      return;
    }
    let cancelled = false;
    void speakText(text, lang).finally(() => {
      if (!cancelled) {
        setSpeaking(false);
      }
    });
    return () => {
      cancelled = true;
      cancelSpeech();
    };
  }, [autoPlay, lang, prefs.autoplay, prefs.enabled, text]);

  if (!prefs.enabled) {
    return null;
  }

  async function play(rate: number) {
    setSpeaking(true);
    await speakText(text, lang, rate);
    setSpeaking(false);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        className={cn(
          "pressable inline-flex items-center justify-center rounded-2xl border-2 border-teal bg-teal-soft text-teal-dark",
          box,
          speaking && "voice-pulse",
        )}
        aria-label={dict.voice.speak}
        onClick={() => void play(1)}
      >
        <Volume2 className="h-6 w-6" aria-hidden="true" />
      </button>
      {size === "md" ? (
        <button
          type="button"
          className="pressable inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-line bg-paper-raised text-ink-soft"
          aria-label={dict.voice.speakSlow}
          onClick={() => void play(0.7)}
        >
          <Turtle className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
}
