import type { ExerciseDifficulty, SkillType } from "@prisma/client";

export const CEFR_TRACK = ["A1", "A2", "B1", "B2", "C1"] as const;
export type CefrTrackLevel = (typeof CEFR_TRACK)[number];

export const SKILL_WEIGHTS: Record<SkillType, number> = {
  VOCABULARY: 0.25,
  GRAMMAR: 0.25,
  LISTENING: 0.2,
  READING: 0.15,
  TRANSLATION: 0.15,
};

export type SkillThresholds = Record<SkillType, number>;

export type LevelUnlockRule = {
  overall: number;
  skills: SkillThresholds;
  assessment: number;
  criticalFloor: number;
};

export const DEFAULT_UNLOCK_RULE: LevelUnlockRule = {
  overall: 80,
  skills: {
    VOCABULARY: 75,
    GRAMMAR: 75,
    LISTENING: 70,
    READING: 70,
    TRANSLATION: 70,
  },
  assessment: 75,
  criticalFloor: 70,
};

export const LEVEL_UNLOCK_RULES: Record<CefrTrackLevel, LevelUnlockRule> = {
  A1: DEFAULT_UNLOCK_RULE,
  A2: {
    ...DEFAULT_UNLOCK_RULE,
    overall: 82,
    skills: { ...DEFAULT_UNLOCK_RULE.skills, GRAMMAR: 78, READING: 75 },
    assessment: 78,
    criticalFloor: 72,
  },
  B1: {
    ...DEFAULT_UNLOCK_RULE,
    overall: 85,
    skills: { ...DEFAULT_UNLOCK_RULE.skills, GRAMMAR: 80, READING: 78, VOCABULARY: 78 },
    assessment: 80,
    criticalFloor: 75,
  },
  B2: {
    ...DEFAULT_UNLOCK_RULE,
    overall: 88,
    skills: { ...DEFAULT_UNLOCK_RULE.skills, GRAMMAR: 85, VOCABULARY: 82 },
    assessment: 85,
    criticalFloor: 78,
  },
  C1: {
    ...DEFAULT_UNLOCK_RULE,
    overall: 90,
    skills: { ...DEFAULT_UNLOCK_RULE.skills, GRAMMAR: 88, READING: 85, LISTENING: 80 },
    assessment: 88,
    criticalFloor: 82,
  },
};

export const REVIEW_INTERVALS_MS = [
  10 * 60 * 1000,
  24 * 60 * 60 * 1000,
  3 * 24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
  14 * 24 * 60 * 60 * 1000,
  30 * 24 * 60 * 60 * 1000,
] as const;

export const DIFFICULTY_GAIN: Record<ExerciseDifficulty, number> = {
  EASY: 0.55,
  MEDIUM: 1,
  HARD: 1.35,
};

export const DIFFICULTY_LOSS: Record<ExerciseDifficulty, number> = {
  EASY: 1.4,
  MEDIUM: 1,
  HARD: 0.75,
};

export const EVIDENCE_EMA = 0.18;
export const MASTERY_BLEND_EVIDENCE = 0.55;
export const MASTERY_BLEND_DELTA = 0.25;
export const MASTERY_BLEND_RETENTION = 0.2;
export const RETENTION_HALF_LIFE_DAYS = 21;
export const WEAK_TOPIC_SCORE = 60;
export const STRONG_TOPIC_SCORE = 85;
export const ASSESSMENT_QUESTION_COUNT = 24;
export const FAST_GUESS_MS = 800;
export const SLOW_EASY_MS = 45_000;

export function nextCefrLevel(level: string): CefrTrackLevel | null {
  const index = CEFR_TRACK.indexOf(level as CefrTrackLevel);
  if (index < 0 || index + 1 >= CEFR_TRACK.length) {
    return null;
  }
  return CEFR_TRACK[index + 1] ?? null;
}

export function cefrIndex(level: string): number {
  const index = CEFR_TRACK.indexOf(level as CefrTrackLevel);
  return index < 0 ? 0 : index;
}

export function unlockRuleFor(level: string): LevelUnlockRule {
  return LEVEL_UNLOCK_RULES[level as CefrTrackLevel] ?? DEFAULT_UNLOCK_RULE;
}
