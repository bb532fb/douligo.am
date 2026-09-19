import { z } from "zod";
import { HEARTS_MAX_LIMIT, HEARTS_MAX_MIN } from "@/lib/constants/app";

export const ADMIN_USER_PAGE_SIZE = 12;

export const adminUserQuerySchema = z.object({
  q: z.string().trim().max(80).default(""),
  status: z.enum(["ALL", "ACTIVE", "SUSPENDED"]).default("ALL"),
  page: z.coerce.number().int().min(1).default(1),
});

export const adjustHeartsSchema = z.object({
  userId: z.string().min(1),
  intent: z.enum(["add", "remove", "refill"]),
});

export const updateUserStatusSchema = z.object({
  userId: z.string().min(1),
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});

export const updateHeartsMaxSchema = z.object({
  heartsMax: z.coerce.number().int().min(HEARTS_MAX_MIN).max(HEARTS_MAX_LIMIT),
});

export type AdminUserQuery = z.infer<typeof adminUserQuerySchema>;
export type AdjustHeartsInput = z.infer<typeof adjustHeartsSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type UpdateHeartsMaxInput = z.infer<typeof updateHeartsMaxSchema>;
