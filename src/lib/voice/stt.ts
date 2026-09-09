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

type RecognitionResult = ArrayLike<{ transcript: string }> & { isFinal?: boolean };

type RecognitionEvent = {
  results: ArrayLike<RecognitionResult>;
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
  return listenWith([lang, lang.slice(0, 2)]);
}

function listenWith(langs: string[]): ListenSession {
  const Ctor = recognitionCtor();
  const lang = langs[0];
  if (!Ctor || !lang) {
    throw new Error("unsupported");
  }

  const recognition = configureRecognition(new Ctor(), lang);
  const fallback = langs.slice(1);
  const result = new Promise<string[]>((resolve, reject) => {
    bindRecognition(recognition, fallback, resolve, reject);
  });
  recognition.start();
  return { stop: () => recognition.abort(), result };
}

function configureRecognition(recognition: RecognitionLike, lang: string): RecognitionLike {
  recognition.lang = lang;
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 5;
  return recognition;
}

function bindRecognition(
  recognition: RecognitionLike,
  fallback: string[],
  resolve: (value: string[]) => void,
  reject: (error: Error) => void,
): void {
  let settled = false;
  let heard: string[] = [];
  recognition.onresult = (event) => {
    heard = transcriptsOf(event);
    const last = event.results[event.results.length - 1];
    if (last?.isFinal && heard.length > 0 && !settled) {
      settled = true;
      recognition.abort();
      resolve(heard);
    }
  };
  recognition.onerror = (event) => {
    if (settled) {
      return;
    }
    if (event.error === "language-not-supported" && fallback.length > 0) {
      settled = true;
      window.setTimeout(() => listenWith(fallback).result.then(resolve, reject), 0);
      return;
    }
    settled = true;
    reject(new Error(event.error));
  };
  recognition.onend = () => {
    if (settled) {
      return;
    }
    settled = true;
    if (heard.length > 0) {
      resolve(heard);
      return;
    }
    reject(new Error("empty"));
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
