import type { ExerciseDifficulty } from "@prisma/client";
import { STRONG_TOPIC_SCORE, WEAK_TOPIC_SCORE } from "@/lib/learning/mastery-config";

export type AdaptiveCandidate = {
  id: string;
  topicKey: string;
  difficulty: ExerciseDifficulty;
  skillType: string;
};

export type AdaptiveTopicStat = {
  key: string;
  score: number;
  recentWrong: boolean;
  retentionLow: boolean;
  reviewDue: boolean;
  isNew: boolean;
  recentIds: string[];
};

export type AdaptiveContext = {
  topics: Record<string, AdaptiveTopicStat>;
  targetDifficulty: ExerciseDifficulty;
};

export function getAdaptiveDifficulty(
  recent: Array<{ difficulty: ExerciseDifficulty; isCorrect: boolean }>,
): ExerciseDifficulty {
  if (recent.length === 0) {
    return "MEDIUM";
  }
  const last = recent.slice(-8);
  const mediumWin = streakOf(last, "MEDIUM", true);
  const hardFail = streakOf(last, "HARD", false);
  const easy = last.filter((item) => item.difficulty === "EASY");
  const easyAccuracy = easy.length === 0 ? 0 : easy.filter((item) => item.isCorrect).length / easy.length;

  if (hardFail >= 3) {
    return "MEDIUM";
  }
  if (mediumWin >= 5) {
    return "HARD";
  }
  if (easy.length >= 4 && easyAccuracy >= 0.95) {
    return "MEDIUM";
  }
  return last.at(-1)?.difficulty ?? "MEDIUM";
}

export function selectNextExercise(candidates: AdaptiveCandidate[], context: AdaptiveContext): string | null {
  if (candidates.length === 0) {
    return null;
  }
  const ranked = rankExercises(candidates, context);
  const top = ranked.slice(0, Math.min(5, ranked.length));
  const total = top.reduce((sum, item) => sum + item.weight, 0);
  let cursor = Math.random() * total;
  for (const item of top) {
    cursor -= item.weight;
    if (cursor <= 0) {
      return item.id;
    }
  }
  return top[0]?.id ?? candidates[0]?.id ?? null;
}

export function rankExercises(candidates: AdaptiveCandidate[], context: AdaptiveContext) {
  return candidates
    .map((candidate) => ({ id: candidate.id, weight: Math.max(1, exerciseWeight(candidate, context)) }))
    .sort((left, right) => right.weight - left.weight);
}

export function orderByAdaptive<T extends AdaptiveCandidate>(items: T[], context: AdaptiveContext): T[] {
  const remaining = [...items];
  const ordered: T[] = [];
  while (remaining.length > 0) {
    const nextId = selectNextExercise(remaining, context);
    const index = remaining.findIndex((item) => item.id === nextId);
    const picked = index >= 0 ? remaining.splice(index, 1)[0] : remaining.shift();
    if (picked) {
      ordered.push(picked);
    }
  }
  return ordered;
}

function exerciseWeight(candidate: AdaptiveCandidate, context: AdaptiveContext): number {
  const topic = context.topics[candidate.topicKey];
  if (!topic) {
    return 20;
  }
  let weight = 8;
  if (topic.score < WEAK_TOPIC_SCORE && !topic.isNew) {
    weight += 40;
  }
  if (topic.recentWrong) {
    weight += 35;
  }
  if (topic.retentionLow) {
    weight += 30;
  }
  if (topic.reviewDue) {
    weight += 25;
  }
  if (topic.isNew) {
    weight += 20;
  }
  if (topic.score >= STRONG_TOPIC_SCORE) {
    weight += 5;
  }
  if (topic.recentIds.includes(candidate.id)) {
    weight -= 50;
  }
  if (candidate.difficulty !== context.targetDifficulty) {
    weight -= 12;
  }
  return weight;
}

function streakOf(
  recent: Array<{ difficulty: ExerciseDifficulty; isCorrect: boolean }>,
  difficulty: ExerciseDifficulty,
  isCorrect: boolean,
): number {
  let streak = 0;
  for (let index = recent.length - 1; index >= 0; index -= 1) {
    const item = recent[index];
    if (!item || item.difficulty !== difficulty || item.isCorrect !== isCorrect) {
      break;
    }
    streak += 1;
  }
  return streak;
}
