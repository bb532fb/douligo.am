import { describe, expect, it } from "vitest";
import { detectLanguageCode, speechLangFromCode, speechLangFromText } from "@/lib/voice/locale";

describe("voice locale", () => {
  it("detects Armenian, Russian, and English scripts", () => {
    expect(detectLanguageCode("Բարև")).toBe("HY");
    expect(detectLanguageCode("Привет")).toBe("RU");
    expect(detectLanguageCode("Hello")).toBe("EN");
  });

  it("maps language codes to BCP-47", () => {
    expect(speechLangFromCode("HY")).toBe("hy-AM");
    expect(speechLangFromText("спасибо")).toBe("ru-RU");
  });
});
