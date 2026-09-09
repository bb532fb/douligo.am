import type { NextRequest } from "next/server";
import { speakQuerySchema } from "@/lib/validations/voice";
import { audioCacheKey } from "@/server/voice/audio-cache";
import { synthesizeEdgeMp3 } from "@/server/voice/edge-tts";
import { synthesizeOnce } from "@/server/voice/synthesize-once";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const parsed = speakQuerySchema.safeParse({
    text: request.nextUrl.searchParams.get("text") ?? "",
    lang: request.nextUrl.searchParams.get("lang") ?? "",
    rate: request.nextUrl.searchParams.get("rate") ?? "1",
  });
  if (!parsed.success) {
    return new Response("invalid", { status: 400 });
  }

  const { text, lang } = parsed.data;
  const key = audioCacheKey(text, lang, 1);

  try {
    const audio = await synthesizeOnce(key, () => synthesizeEdgeMp3(text, lang, 1));
    return mp3Response(audio);
  } catch (error) {
    console.error("tts failed", error);
    return new Response("unavailable", { status: 502 });
  }
}

function mp3Response(audio: Uint8Array): Response {
  return new Response(Buffer.from(audio), {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
