import type { SkillType } from "@prisma/client";
import type { UnlockGap } from "@/lib/learning/level-gate";

export type SkillBreakdown = {
  skill: SkillType;
  score: number;
  required: number;
  inCurriculum: boolean;
};

export type TopicSummary = {
  key: string;
  title: string;
  score: number;
  isCritical: boolean;
};

export type LevelUnlockView = {
  nextLevel: string | null;
  locked: boolean;
  overall: number;
  required: number;
  gaps: UnlockGap[];
  weakTopics: TopicSummary[];
};

export type MasteryDashboard = {
  currentLevel: string;
  overall: number;
  skills: SkillBreakdown[];
  lessonsCompleted: number;
  lessonsTotal: number;
  weakTopics: TopicSummary[];
  recentlyLearned: TopicSummary[];
  reviewDue: number;
  unlock: LevelUnlockView;
  assessmentLessonId: string | null;
  assessmentAvailable: boolean;
  lastAssessmentScore: number | null;
  lastAssessmentPassed: boolean | null;
  reviewLessonId: string | null;
};
