import { z } from "zod";
import { CEFR_LEVELS, COURSE_SLUGS, DAILY_GOAL_OPTIONS } from "@/lib/constants/app";

export const selectCourseSlugSchema = z.object({
  slug: z.enum(COURSE_SLUGS),
});

export const updateSettingsSchema = z.object({
  displayName: z.string().trim().min(2).max(40).optional(),
  dailyGoalXp: z.number().refine((value) => DAILY_GOAL_OPTIONS.includes(value as (typeof DAILY_GOAL_OPTIONS)[number])),
});

export const selectStartLevelSchema = z.object({
  startLevel: z.enum(CEFR_LEVELS),
});
