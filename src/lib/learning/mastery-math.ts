import type { ExerciseDifficulty, SkillType } from "@prisma/client";
import {
  DIFFICULTY_GAIN,
  DIFFICULTY_LOSS,
  EVIDENCE_EMA,
  FAST_GUESS_MS,
  MASTERY_BLEND_DELTA,
  MASTERY_BLEND_EVIDENCE,
  MASTERY_BLEND_RETENTION,
  RETENTION_HALF_LIFE_DAYS,
  SKILL_WEIGHTS,
  SLOW_EASY_MS,
} from "@/lib/learning/mastery-config";

export type MasteryEvent = {
  isCorrect: boolean;
  difficulty: ExerciseDifficulty;
  timeSpentMs?: number | null;
  attemptNumber: number;
  isReview: boolean;
};

export type TopicMasteryState = {
  score: number;
  evidenceScore: number;
  correctCount: number;
  incorrectCount: number;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  lastPracticedAt?: Date | null;
};

export function emptyTopicMastery(): TopicMasteryState {
  return {
    score: 0,
    evidenceScore: 50,
    correctCount: 0,
    incorrectCount: 0,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    lastPracticedAt: null,
  };
}

export function calculateTopicMastery(
  current: TopicMasteryState,
  event: MasteryEvent,
  now = new Date(),
): TopicMasteryState {
  const correctCount = current.correctCount + (event.isCorrect ? 1 : 0);
  const incorrectCount = current.incorrectCount + (event.isCorrect ? 0 : 1);
  const consecutiveCorrect = event.isCorrect ? current.consecutiveCorrect + 1 : 0;
  const consecutiveWrong = event.isCorrect ? 0 : current.consecutiveWrong + 1;
  const delta = attemptDelta(current.score, event, consecutiveCorrect, consecutiveWrong);
  const evidence = nextEvidence(current.evidenceScore, event);
  const retention = retentionScore(current.lastPracticedAt, event, now);
  const blended =
    evidence * MASTERY_BLEND_EVIDENCE +
    clamp(current.score + delta) * MASTERY_BLEND_DELTA +
    retention * MASTERY_BLEND_RETENTION;

  return {
    score: clamp(blended),
    evidenceScore: evidence,
    correctCount,
    incorrectCount,
    consecutiveCorrect,
    consecutiveWrong,
    lastPracticedAt: now,
  };
}

export function calculateSkillMastery(topicScores: number[], recentAccuracy: number | null): number {
  if (topicScores.length === 0) {
    return recentAccuracy === null ? 0 : clamp(recentAccuracy);
  }
  const topicAvg = topicScores.reduce((sum, score) => sum + score, 0) / topicScores.length;
  if (recentAccuracy === null) {
    return clamp(topicAvg);
  }
  return clamp(topicAvg * 0.7 + recentAccuracy * 0.3);
}

export function calculateLevelMastery(
  skills: Partial<Record<SkillType, number>>,
  available: readonly SkillType[],
  weights: Record<SkillType, number> = SKILL_WEIGHTS,
): number {
  const present = available.filter((skill) => skills[skill] !== undefined);
  if (present.length === 0) {
    return 0;
  }
  const totalWeight = present.reduce((sum, skill) => sum + weights[skill], 0);
  if (totalWeight <= 0) {
    return 0;
  }
  return clamp(
    present.reduce((sum, skill) => sum + (skills[skill] ?? 0) * (weights[skill] / totalWeight), 0),
  );
}

export function applyRetentionDecay(score: number, lastPracticedAt: Date | null | undefined, now = new Date()): number {
  if (!lastPracticedAt) {
    return score;
  }
  const days = (now.getTime() - lastPracticedAt.getTime()) / 86_400_000;
  if (days <= 2) {
    return score;
  }
  const decay = Math.exp(-days / RETENTION_HALF_LIFE_DAYS);
  const mixed = score * decay + score * 0.2 * (1 - decay);
  return clamp(Math.max(score * 0.4, mixed));
}

function attemptDelta(
  score: number,
  event: MasteryEvent,
  consecutiveCorrect: number,
  consecutiveWrong: number,
): number {
  const time = timeFactor(event);
  if (event.isCorrect) {
    const gain = 8 * DIFFICULTY_GAIN[event.difficulty] * (1 - score / 120) * time;
    const streak = consecutiveCorrect >= 3 ? Math.min(4, consecutiveCorrect - 2) : 0;
    const reviewBonus = event.isReview ? 3 : 0;
    return gain + streak + reviewBonus;
  }
  const loss = 10 * DIFFICULTY_LOSS[event.difficulty] * (score / 100 + 0.3) * time;
  const repeat = consecutiveWrong >= 2 ? 4 * Math.log2(consecutiveWrong) : 0;
  const reviewPenalty = event.isReview ? 5 : 0;
  return -(loss + repeat + reviewPenalty);
}

function nextEvidence(current: number, event: MasteryEvent): number {
  const observed = event.isCorrect ? 100 * DIFFICULTY_GAIN[event.difficulty] : 20 / DIFFICULTY_LOSS[event.difficulty];
  return clamp(current * (1 - EVIDENCE_EMA) + clamp(observed) * EVIDENCE_EMA);
}

function retentionScore(lastPracticedAt: Date | null | undefined, event: MasteryEvent, now: Date): number {
  if (!lastPracticedAt) {
    return event.isCorrect ? 55 : 35;
  }
  const decayed = applyRetentionDecay(event.isCorrect ? 80 : 40, lastPracticedAt, now);
  return event.isReview ? (event.isCorrect ? Math.min(100, decayed + 15) : Math.max(20, decayed - 20)) : decayed;
}

function timeFactor(event: MasteryEvent): number {
  const time = event.timeSpentMs;
  if (time == null) {
    return 1;
  }
  if (event.isCorrect && event.difficulty === "HARD" && time < FAST_GUESS_MS) {
    return 0.5;
  }
  if (event.difficulty === "EASY" && time > SLOW_EASY_MS) {
    return event.isCorrect ? 0.6 : 1.15;
  }
  return 1;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
