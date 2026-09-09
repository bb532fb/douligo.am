import { describe, expect, it } from "vitest";
import { pickVoice } from "@/lib/voice/pick-voice";

describe("pickVoice", () => {
  const voices = [
    { lang: "en-US", name: "Google US English" },
    { lang: "ru-RU", name: "Google русский" },
    { lang: "hy-AM", name: "Microsoft Syuzanna" },
  ];

  it("prefers an exact language match", () => {
    expect(pickVoice(voices, "hy-AM")?.name).toBe("Microsoft Syuzanna");
    expect(pickVoice(voices, "ru-RU")?.lang).toBe("ru-RU");
  });

  it("falls back to a name hint", () => {
    expect(pickVoice([{ lang: "en-GB", name: "Armenian Neural" }], "hy-AM")?.name).toBe(
      "Armenian Neural",
    );
  });
});
