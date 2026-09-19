import { describe, expect, it } from "vitest";
import { getAdaptiveDifficulty, rankExercises, type AdaptiveContext } from "@/lib/learning/adaptive";

const context: AdaptiveContext = {
  targetDifficulty: "MEDIUM",
  topics: {
    "past-simple": {
      key: "past-simple",
      score: 48,
      recentWrong: true,
      retentionLow: true,
      reviewDue: true,
      isNew: false,
      recentIds: [],
    },
    "present-simple": {
      key: "present-simple",
      score: 94,
      recentWrong: false,
      retentionLow: false,
      reviewDue: false,
      isNew: false,
      recentIds: [],
    },
    travel: {
      key: "travel",
      score: 54,
      recentWrong: false,
      retentionLow: false,
      reviewDue: false,
      isNew: false,
      recentIds: [],
    },
  },
};

describe("rankExercises", () => {
  it("prioritizes weak topics over strong ones", () => {
    const ranked = rankExercises(
      [
        { id: "strong", topicKey: "present-simple", difficulty: "EASY", skillType: "GRAMMAR" },
        { id: "weak", topicKey: "past-simple", difficulty: "MEDIUM", skillType: "GRAMMAR" },
        { id: "travel", topicKey: "travel", difficulty: "MEDIUM", skillType: "VOCABULARY" },
      ],
      context,
    );
    expect(ranked[0]?.id).toBe("weak");
    expect(ranked.map((item) => item.id)).not.toEqual(["strong", "weak", "travel"]);
    expect(ranked.find((item) => item.id === "weak")?.weight ?? 0).toBeGreaterThan(
      ranked.find((item) => item.id === "strong")?.weight ?? 0,
    );
  });
});

describe("getAdaptiveDifficulty", () => {
  it("increases difficulty after consistent medium success", () => {
    const recent = Array.from({ length: 5 }, () => ({ difficulty: "MEDIUM" as const, isCorrect: true }));
    expect(getAdaptiveDifficulty(recent)).toBe("HARD");
  });

  it("decreases difficulty after repeated hard failure", () => {
    const recent = Array.from({ length: 4 }, () => ({ difficulty: "HARD" as const, isCorrect: false }));
    expect(getAdaptiveDifficulty(recent)).toBe("MEDIUM");
  });

  it("moves off easy after 95%+ easy accuracy", () => {
    const recent = Array.from({ length: 6 }, () => ({ difficulty: "EASY" as const, isCorrect: true }));
    expect(getAdaptiveDifficulty(recent)).toBe("MEDIUM");
  });
});
