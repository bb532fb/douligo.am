import type { SpeechLang } from "@/lib/voice/locale";

type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  abort: () => void;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type RecognitionEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type RecognitionCtor = new () => RecognitionLike;

export type ListenSession = {
  stop: () => void;
  result: Promise<string[]>;
};

export function canListen(): boolean {
  return recognitionCtor() !== null;
}

export function startListening(lang: SpeechLang): ListenSession {
  const Ctor = recognitionCtor();
  if (!Ctor) {
    throw new Error("unsupported");
  }

  const recognition = new Ctor();
  recognition.lang = lang;
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 3;

  let settled = false;
  const result = new Promise<string[]>((resolve, reject) => {
    recognition.onresult = (event) => {
      settled = true;
      resolve(transcriptsOf(event));
    };
    recognition.onerror = (event) => {
      settled = true;
      reject(new Error(event.error));
    };
    recognition.onend = () => {
      if (!settled) {
        reject(new Error("empty"));
      }
    };
  });

  recognition.start();
  return {
    stop: () => recognition.abort(),
    result,
  };
}

function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") {
    return null;
  }
  const holder = window as Window & {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return holder.SpeechRecognition ?? holder.webkitSpeechRecognition ?? null;
}

function transcriptsOf(event: RecognitionEvent): string[] {
  const first = event.results[0];
  if (!first) {
    return [];
  }
  return Array.from(first, (item) => item.transcript.trim()).filter(Boolean);
}
