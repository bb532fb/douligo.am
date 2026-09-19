import { z } from "zod";
import { AUTH_ERRORS } from "@/lib/constants/copy";

export const loginSchema = z.object({
  email: z.email(AUTH_ERRORS.invalidEmail),
  password: z.string().min(4, AUTH_ERRORS.passwordMin),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, AUTH_ERRORS.nameMin),
    email: z.email(AUTH_ERRORS.invalidEmail),
    password: z.string().min(4, AUTH_ERRORS.passwordMin),
    confirmPassword: z.string().min(4, AUTH_ERRORS.passwordMin),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_ERRORS.passwordMismatch,
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
