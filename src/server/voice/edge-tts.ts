import { WebSocket, type RawData } from "ws";
import { buildSsml, NEURAL_VOICE_FALLBACKS } from "@/lib/voice/ssml";
import type { SpeechLang } from "@/lib/voice/locale";
import { edgeRequestHeaders, secMsGec, synthUrl } from "@/server/voice/drm";

const AUDIO_MARK = Buffer.from("Path:audio\r\n");
const TIMEOUT_MS = 4_000;

let queue: Promise<unknown> = Promise.resolve();

export function synthesizeEdgeMp3(
  text: string,
  lang: SpeechLang,
  rate: number,
): Promise<Uint8Array> {
  const run = () => synthesizeVoices(text, lang, rate);
  const next = queue.then(run, run);
  queue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

async function synthesizeVoices(text: string, lang: SpeechLang, rate: number): Promise<Uint8Array> {
  let lastError: Error = new Error("tts-failed");
  for (const voice of NEURAL_VOICE_FALLBACKS[lang]) {
    try {
      return await requestAudio(buildSsml(text, lang, rate, voice));
    } catch (error) {
      lastError = error instanceof Error ? error : lastError;
    }
  }
  throw lastError;
}

function requestAudio(ssml: string): Promise<Uint8Array> {
  const connectionId = crypto.randomUUID().replaceAll("-", "");
  const socket = new WebSocket(synthUrl(connectionId, secMsGec()), {
    headers: edgeRequestHeaders(),
  });
  return collectMp3(socket, connectionId, ssml);
}

function collectMp3(socket: WebSocket, connectionId: string, ssml: string): Promise<Uint8Array> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => finish(new Error("tts-timeout")), TIMEOUT_MS);

    function finish(error?: Error) {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      socket.close();
      if (error) {
        reject(error);
        return;
      }
      resolve(new Uint8Array(Buffer.concat(chunks)));
    }

    socket.on("open", () => {
      socket.send(configMessage());
      socket.send(ssmlMessage(connectionId, ssml));
    });
    socket.on("message", (data, isBinary) => onMessage(data, isBinary, chunks, finish));
    socket.on("unexpected-response", (_req, res) => finish(new Error(`tts-http-${res.statusCode}`)));
    socket.on("error", (error) => finish(error));
    socket.on("close", () => finish(chunks.length > 0 ? undefined : new Error("tts-empty")));
  });
}

function onMessage(
  data: RawData,
  isBinary: boolean,
  chunks: Buffer[],
  finish: (error?: Error) => void,
): void {
  const frame = rawToBuffer(data);
  const index = frame.indexOf(AUDIO_MARK);
  if (index >= 0) {
    chunks.push(frame.subarray(index + AUDIO_MARK.length));
  }
  if (isBinary) {
    return;
  }
  const text = frame.toString("utf8");
  if (/audiofailure|invalid|error code/i.test(text)) {
    finish(new Error(text.replaceAll(/\s+/g, " ").slice(0, 180)));
    return;
  }
  if (text.includes("Path:turn.end")) {
    finish(chunks.length > 0 ? undefined : new Error("tts-empty"));
  }
}

function configMessage(): string {
  const stamp = new Date().toUTCString();
  const body =
    '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":false,"wordBoundaryEnabled":false},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}';
  return `X-Timestamp:${stamp}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n${body}`;
}

function ssmlMessage(connectionId: string, ssml: string): string {
  const stamp = new Date().toUTCString();
  return `X-RequestId:${connectionId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${stamp}\r\nPath:ssml\r\n\r\n${ssml}`;
}

function rawToBuffer(data: RawData): Buffer {
  if (Buffer.isBuffer(data)) {
    return data;
  }
  if (Array.isArray(data)) {
    return Buffer.concat(data);
  }
  return Buffer.from(data);
}
