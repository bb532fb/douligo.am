import type { SkillType } from "@prisma/client";
import { SKILL_WEIGHTS } from "@/lib/learning/mastery-config";

export type UnlockGap = {
  kind: "overall" | "skill" | "assessment" | "critical" | "lessons" | "review";
  key: string;
  current: number;
  required: number;
};

export type UnlockInput = {
  levelKey: string;
  overall: number;
  skills: Partial<Record<SkillType, number>>;
  curriculumSkills: SkillType[];
  assessmentScore: number | null;
  criticalTopics: Array<{ key: string; score: number }>;
  lessonsCompleted: number;
  lessonsTotal: number;
  reviewDue: number;
};

export function canUnlockNextLevel(input: UnlockInput): { ok: boolean; gaps: UnlockGap[] } {
  if (input.lessonsTotal > 0 && input.lessonsCompleted < input.lessonsTotal) {
    return {
      ok: false,
      gaps: [
        {
          kind: "lessons",
          key: "lessons",
          current: input.lessonsCompleted,
          required: input.lessonsTotal,
        },
      ],
    };
  }
  return { ok: true, gaps: [] };
}

export function curriculumSkillsOf(available: Iterable<SkillType>): SkillType[] {
  const present = new Set(available);
  return (Object.keys(SKILL_WEIGHTS) as SkillType[]).filter((skill) => present.has(skill));
}
