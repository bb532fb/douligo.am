import { z } from "zod";

export const textAnswerSchema = z.object({
  kind: z.literal("text"),
  value: z.string().trim().min(1).max(200),
});

export const optionAnswerSchema = z.object({
  kind: z.literal("option"),
  optionId: z.string().min(1),
});

export const orderAnswerSchema = z.object({
  kind: z.literal("order"),
  tokens: z.array(z.string().min(1)).min(1).max(12),
});

export const answerPayloadSchema = z.discriminatedUnion("kind", [
  textAnswerSchema,
  optionAnswerSchema,
  orderAnswerSchema,
]);

export const submitAnswerSchema = z.object({
  attemptId: z.string().min(1),
  questionId: z.string().min(1),
  answer: answerPayloadSchema,
});

export const startLessonSchema = z.object({
  lessonId: z.string().min(1),
});

export const completeLessonSchema = z.object({
  attemptId: z.string().min(1),
});

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
