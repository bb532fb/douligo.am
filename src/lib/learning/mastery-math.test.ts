import { describe, expect, it } from "vitest";
import {
  applyRetentionDecay,
  calculateLevelMastery,
  calculateSkillMastery,
  calculateTopicMastery,
  emptyTopicMastery,
} from "@/lib/learning/mastery-math";

const easyCorrect = { isCorrect: true, difficulty: "EASY" as const, attemptNumber: 1, isReview: false };
const mediumCorrect = { isCorrect: true, difficulty: "MEDIUM" as const, attemptNumber: 2, isReview: false };
const mediumWrong = { isCorrect: false, difficulty: "MEDIUM" as const, attemptNumber: 2, isReview: false };

describe("calculateTopicMastery", () => {
  it("increases mastery after a correct answer", () => {
    const next = calculateTopicMastery(emptyTopicMastery(), mediumCorrect);
    expect(next.score).toBeGreaterThan(0);
    expect(next.correctCount).toBe(1);
    expect(next.consecutiveCorrect).toBe(1);
  });

  it("decreases or limits mastery after a wrong answer", () => {
    const strong = calculateTopicMastery({ ...emptyTopicMastery(), score: 70, evidenceScore: 70 }, mediumWrong);
    expect(strong.score).toBeLessThan(70);
    expect(strong.incorrectCount).toBe(1);
    expect(strong.consecutiveWrong).toBe(1);
  });

  it("increases mastery progressively after repeated correct answers", () => {
    let state = emptyTopicMastery();
    const scores: number[] = [];
    for (let index = 0; index < 6; index += 1) {
      state = calculateTopicMastery(state, { ...mediumCorrect, attemptNumber: index + 1 });
      scores.push(state.score);
    }
    expect(scores[5]).toBeGreaterThan(scores[0] ?? 0);
    expect(scores[3]).toBeGreaterThan(scores[1] ?? 0);
    expect(state.score).toBeLessThanOrEqual(100);
  });

  it("penalizes repeated mistakes more than a single miss", () => {
    const first = calculateTopicMastery({ ...emptyTopicMastery(), score: 62, evidenceScore: 62 }, mediumWrong);
    const second = calculateTopicMastery(first, mediumWrong);
    expect(second.score).toBeLessThan(first.score);
    expect(first.score - second.score).toBeGreaterThan(2);
  });

  it("gives smaller gains on easy items than on medium", () => {
    const easy = calculateTopicMastery(emptyTopicMastery(), easyCorrect);
    const medium = calculateTopicMastery(emptyTopicMastery(), mediumCorrect);
    expect(medium.score).toBeGreaterThan(easy.score);
  });
});

describe("calculateSkillMastery", () => {
  it("blends topic scores with recent accuracy", () => {
    expect(calculateSkillMastery([80, 60], 100)).toBeGreaterThan(70);
    expect(calculateSkillMastery([], null)).toBe(0);
  });
});

describe("calculateLevelMastery", () => {
  it("uses configured weights and ignores missing curriculum skills", () => {
    const overall = calculateLevelMastery(
      { VOCABULARY: 80, GRAMMAR: 80, READING: 80, TRANSLATION: 80 },
      ["VOCABULARY", "GRAMMAR", "READING", "TRANSLATION"],
    );
    expect(overall).toBeGreaterThan(75);
    expect(overall).toBeLessThan(85);
  });
});

describe("applyRetentionDecay", () => {
  it("keeps recent scores and decays stale ones", () => {
    const now = new Date("2026-09-19T12:00:00.000Z");
    expect(applyRetentionDecay(90, now, now)).toBe(90);
    const stale = applyRetentionDecay(90, new Date("2026-07-01T12:00:00.000Z"), now);
    expect(stale).toBeLessThan(90);
    expect(stale).toBeGreaterThan(30);
  });
});
