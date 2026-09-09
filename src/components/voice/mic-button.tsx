"use client";

import { useRef, useState } from "react";
import { Mic } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { cn } from "@/lib/utils/cn";
import { canListen, startListening, type ListenSession } from "@/lib/voice/stt";
import type { SpeechLang } from "@/lib/voice/locale";
import { useVoicePrefs } from "@/components/voice/use-voice-prefs";

type MicButtonProps = {
  lang: SpeechLang;
  disabled?: boolean;
  onTranscript: (transcripts: string[]) => void;
};

export function MicButton({ lang, disabled = false, onTranscript }: MicButtonProps) {
  const { dict } = useI18n();
  const { prefs } = useVoicePrefs();
  const sessionRef = useRef<ListenSession | null>(null);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!prefs.enabled) {
    return null;
  }

  async function toggle() {
    if (listening) {
      sessionRef.current?.stop();
      sessionRef.current = null;
      setListening(false);
      return;
    }
    if (!canListen()) {
      setMessage(dict.voice.unsupported);
      return;
    }
    setMessage(null);
    setListening(true);
    try {
      const session = startListening(lang);
      sessionRef.current = session;
      const transcripts = await session.result;
      onTranscript(transcripts);
    } catch (error) {
      setMessage(messageFor(error, dict.voice.micDenied, dict.voice.unsupported));
    } finally {
      sessionRef.current = null;
      setListening(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => void toggle()}
        className={cn(
          "pressable tap-target inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 px-4 font-extrabold",
          listening
            ? "voice-pulse border-rose bg-rose-soft text-rose"
            : "border-violet bg-violet-soft text-violet-dark",
        )}
        aria-pressed={listening}
        aria-label={listening ? dict.voice.listening : dict.voice.listen}
      >
        <Mic className="h-5 w-5" aria-hidden="true" />
        {listening ? dict.voice.listening : dict.voice.listen}
      </button>
      {message ? <p className="text-sm font-bold text-rose">{message}</p> : null}
    </div>
  );
}

function messageFor(error: unknown, micDenied: string, unsupported: string): string | null {
  const code = error instanceof Error ? error.message : "";
  if (code === "not-allowed" || code === "service-not-allowed") {
    return micDenied;
  }
  if (code === "unsupported") {
    return unsupported;
  }
  if (code === "empty" || code === "no-speech" || code === "aborted") {
    return null;
  }
  return unsupported;
}
