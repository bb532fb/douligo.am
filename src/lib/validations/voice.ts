import { z } from "zod";
import { SPEECH_LANGS } from "@/lib/voice/locale";

export const speakQuerySchema = z.object({
  text: z.string().trim().min(1).max(300),
  lang: z.enum(SPEECH_LANGS),
  rate: z.coerce.number().min(0.5).max(1.5).default(1),
});

export type SpeakQuery = z.infer<typeof speakQuerySchema>;
