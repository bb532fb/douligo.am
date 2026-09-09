import { describe, expect, it } from "vitest";
import { buildSsml, escapeXml, rateToProsody } from "@/lib/voice/ssml";
import { speakQuerySchema } from "@/lib/validations/voice";
import { audioCacheKey, getCachedAudio, resetAudioCache, setCachedAudio } from "@/server/voice/audio-cache";
import { secMsGec } from "@/server/voice/drm";

describe("ssml", () => {
  it("escapes markup and maps rate to prosody", () => {
    expect(escapeXml(`<hi & "bye">`)).toBe("&lt;hi &amp; &quot;bye&quot;&gt;");
    expect(rateToProsody(1)).toBe("+0%");
    expect(rateToProsody(0.7)).toBe("-30%");
  });

  it("builds Armenian neural SSML", () => {
    const ssml = buildSsml("Բարև", "hy-AM", 1);
    expect(ssml).toContain("hy-AM-AnahitNeural");
    expect(ssml).toContain("Բարև");
    expect(ssml).toContain('xml:lang="hy-AM"');
    expect(buildSsml("Բարև", "hy-AM", 1, "en-US-AvaMultilingualNeural")).toContain('xml:lang="en-US"');
  });
});

describe("speakQuerySchema", () => {
  it("accepts a short phrase and coerces rate", () => {
    const parsed = speakQuerySchema.parse({ text: "բարև", lang: "hy-AM", rate: "0.7" });
    expect(parsed.rate).toBe(0.7);
  });

  it("rejects empty text", () => {
    expect(speakQuerySchema.safeParse({ text: " ", lang: "hy-AM" }).success).toBe(false);
  });
});

describe("audio cache", () => {
  it("returns the latest value and refreshes LRU order", async () => {
    resetAudioCache();
    await setCachedAudio(audioCacheKey("a", "hy-AM", 1), new Uint8Array([1]));
    expect(await getCachedAudio(audioCacheKey("a", "hy-AM", 1))).toEqual(new Uint8Array([1]));
    expect(await getCachedAudio("missing")).toBeNull();
  });
});

describe("secMsGec", () => {
  it("is stable inside a 5-minute window", () => {
    const start = Date.UTC(2026, 0, 1, 12, 1, 0);
    expect(secMsGec(start)).toBe(secMsGec(start + 60_000));
    expect(secMsGec(start)).toHaveLength(64);
    expect(secMsGec(start)).not.toBe(secMsGec(start + 5 * 60_000));
  });
});
