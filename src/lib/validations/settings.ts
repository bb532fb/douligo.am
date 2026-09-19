import { z } from "zod";
import { DAILY_GOAL_OPTIONS } from "@/lib/constants/app";

export const updateSettingsSchema = z.object({
  displayName: z.string().trim().min(2).max(40).optional(),
  dailyGoalXp: z.number().refine((value) => DAILY_GOAL_OPTIONS.includes(value as (typeof DAILY_GOAL_OPTIONS)[number])),
});
