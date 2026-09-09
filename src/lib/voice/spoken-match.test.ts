import { describe, expect, it } from "vitest";
import { matchSpokenOption, pickTokensFromSpeech, spokenMatches } from "@/lib/voice/spoken-match";

describe("spokenMatches", () => {
  it("accepts close speech around the target phrase", () => {
    expect(spokenMatches("I said hello", ["hello"])).toBe(true);
    expect(spokenMatches("բարեւ ջան", ["բարև"])).toBe(true);
    expect(spokenMatches("cat", ["hello"])).toBe(false);
  });
});

describe("matchSpokenOption", () => {
  it("picks the option that matches the transcript", () => {
    const option = matchSpokenOption("I said thank you", [
      { id: "1", text: "please" },
      { id: "2", text: "thank you" },
    ]);
    expect(option?.id).toBe("2");
  });
});

describe("pickTokensFromSpeech", () => {
  it("consumes matching tokens in spoken order", () => {
    const result = pickTokensFromSpeech("I am a student", ["student", "I", "a", "am"]);
    expect(result.picked).toEqual(["I", "am", "a", "student"]);
    expect(result.remaining).toEqual([]);
  });
});
