import { z } from "zod";
import { CEFR_TRACK } from "@/lib/learning/mastery-config";

export const learningLevelSchema = z.object({
  level: z.enum(CEFR_TRACK),
});
