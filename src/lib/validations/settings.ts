import { z } from "zod";
import { CEFR_LEVELS, DAILY_GOAL_OPTIONS } from "@/lib/constants/app";

export const selectCourseSchema = z.object({
  courseId: z.string().min(1),
});

export const updateSettingsSchema = z.object({
  displayName: z.string().trim().min(2).max(40).optional(),
  dailyGoalXp: z.number().refine((value) => DAILY_GOAL_OPTIONS.includes(value as (typeof DAILY_GOAL_OPTIONS)[number])),
});

export const selectStartLevelSchema = z.object({
  startLevel: z.enum(CEFR_LEVELS),
});
